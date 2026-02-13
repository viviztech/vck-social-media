// ============================================
// VCK Social Media — Database Utility Functions
// CRUD operations for all Supabase tables
// ============================================

import { createClient } from './supabase';

const supabase = createClient();

// ============================================
// SUBSCRIPTIONS
// ============================================

export interface SubscriptionRecord {
    id?: string;
    user_id: string;
    plan_id: string;
    billing_cycle: 'monthly' | 'yearly';
    status: 'active' | 'cancelled' | 'expired' | 'pending';
    amount: number;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    starts_at?: string;
    expires_at?: string;
}

export async function getActiveSubscription(userId: string) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    return { data, error };
}

export async function createSubscription(record: SubscriptionRecord) {
    // Expire any existing active subscriptions
    await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', record.user_id)
        .eq('status', 'active');

    const expiresAt = record.billing_cycle === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
        .from('subscriptions')
        .insert({
            ...record,
            status: 'active',
            starts_at: new Date().toISOString(),
            expires_at: expiresAt,
        })
        .select()
        .single();

    return { data, error };
}

export async function cancelSubscription(subscriptionId: string) {
    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId);

    return { error };
}

// ============================================
// SOCIAL ACCOUNTS
// ============================================

export interface SocialAccountRecord {
    user_id: string;
    platform: 'meta';
    access_token: string;
    token_expires_at?: string;
    platform_user_id?: string;
    platform_user_name?: string;
    pages?: unknown[];
}

export async function getSocialAccount(userId: string, platform: string = 'meta') {
    const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .maybeSingle();

    return { data, error };
}

export async function upsertSocialAccount(record: SocialAccountRecord) {
    const { data, error } = await supabase
        .from('social_accounts')
        .upsert(
            {
                ...record,
                is_connected: true,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,platform' }
        )
        .select()
        .single();

    return { data, error };
}

export async function disconnectSocialAccount(userId: string, platform: string = 'meta') {
    const { error } = await supabase
        .from('social_accounts')
        .update({ is_connected: false, access_token: '' })
        .eq('user_id', userId)
        .eq('platform', platform);

    return { error };
}

// ============================================
// POSTS
// ============================================

export interface PostRecord {
    user_id: string;
    template_id: string;
    caption?: string;
    image_url?: string;
    platforms?: string[];
    status?: 'draft' | 'queued' | 'scheduled' | 'published' | 'failed';
    scheduled_at?: string;
    custom_data?: Record<string, string>;
}

export async function getUserPosts(userId: string, status?: string) {
    let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query.limit(50);
    return { data, error };
}

export async function createPost(record: PostRecord) {
    const { data, error } = await supabase
        .from('posts')
        .insert(record)
        .select()
        .single();

    return { data, error };
}

export async function updatePostStatus(
    postId: string,
    status: 'draft' | 'scheduled' | 'published' | 'failed',
) {
    const updates: Record<string, unknown> = { status };
    if (status === 'published') updates.published_at = new Date().toISOString();

    const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId);

    return { error };
}

export async function deletePost(postId: string) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

    return { error };
}

// ============================================
// SCHEDULING
// ============================================

export async function getScheduledPosts(userId: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['scheduled', 'queued'])
        .order('scheduled_at', { ascending: true });

    return { data, error };
}

export async function getPostsByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .gte('scheduled_at', startDate)
        .lte('scheduled_at', endDate)
        .order('scheduled_at', { ascending: true });

    return { data, error };
}

export async function batchCreatePosts(records: PostRecord[]) {
    const { data, error } = await supabase
        .from('posts')
        .insert(records)
        .select();

    return { data, error };
}

export async function reschedulePost(postId: string, newScheduledAt: string) {
    const { error } = await supabase
        .from('posts')
        .update({ scheduled_at: newScheduledAt })
        .eq('id', postId);

    return { error };
}

export async function getQueuedPostsDue() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'queued')
        .lte('scheduled_at', now)
        .order('scheduled_at', { ascending: true })
        .limit(20);

    return { data, error };
}

// ============================================
// PAYMENTS
// ============================================

export interface PaymentRecord {
    user_id: string;
    subscription_id?: string;
    plan_id: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    billing_cycle?: string;
}

export async function getPaymentHistory(userId: string) {
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

    return { data, error };
}

export async function createPayment(record: PaymentRecord) {
    const { data, error } = await supabase
        .from('payments')
        .insert(record)
        .select()
        .single();

    return { data, error };
}

// ============================================
// MEDIA
// ============================================

export async function getUserMedia(userId: string) {
    const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    return { data, error };
}

export async function addMedia(userId: string, fileUrl: string, fileName: string, fileType: string, fileSize: number) {
    const { data, error } = await supabase
        .from('media')
        .insert({
            user_id: userId,
            file_url: fileUrl,
            file_name: fileName,
            file_type: fileType,
            file_size: fileSize,
        })
        .select()
        .single();

    return { data, error };
}

export async function deleteMedia(mediaId: string) {
    const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId);

    return { error };
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(userId: string) {
    const [postsRes, subsRes, socialRes, mediaRes] = await Promise.all([
        supabase.from('posts').select('id, status', { count: 'exact' }).eq('user_id', userId),
        getActiveSubscription(userId),
        getSocialAccount(userId),
        supabase.from('media').select('id', { count: 'exact' }).eq('user_id', userId),
    ]);

    const posts = postsRes.data || [];
    const published = posts.filter(p => p.status === 'published').length;
    const scheduled = posts.filter(p => p.status === 'scheduled').length;

    return {
        totalPosts: postsRes.count || 0,
        publishedPosts: published,
        scheduledPosts: scheduled,
        activePlan: subsRes.data?.plan_id || null,
        isConnected: socialRes.data?.is_connected || false,
        mediaCount: mediaRes.count || 0,
    };
}
