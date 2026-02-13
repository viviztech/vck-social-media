// ============================================
// VCK Social Media — Type Definitions
// ============================================

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone: string;
    designation: string;
    constituency: string;
    party_role: string;
    district: string;
    state: string;
    profile_photo_url: string | null;
    role: 'member' | 'coordinator' | 'admin';
    language_preference: string;
    created_at: string;
    updated_at: string;
}

export interface Template {
    id: string;
    name: string;
    category: TemplateCategory;
    language: string;
    design_data: TemplateDesignData;
    preview_url: string;
    aspect_ratio: '1:1' | '4:5' | '9:16' | '16:9';
    is_premium: boolean;
    created_at: string;
}

export interface TemplateDesignData {
    background_color: string;
    background_image?: string;
    text_color: string;
    font_family: string;
    layout: 'centered' | 'left' | 'right' | 'overlay';
    photo_position: { x: number; y: number; width: number; height: number };
    name_position: { x: number; y: number; fontSize: number };
    designation_position: { x: number; y: number; fontSize: number };
    party_logo_position: { x: number; y: number; width: number; height: number };
    custom_text_position?: { x: number; y: number; fontSize: number };
}

export type TemplateCategory =
    | 'festival'
    | 'birthday'
    | 'campaign'
    | 'event'
    | 'achievement'
    | 'condolence'
    | 'announcement'
    | 'general';

export interface Post {
    id: string;
    user_id: string;
    template_id: string;
    generated_image_url: string;
    custom_data: Record<string, string>;
    scheduled_at: string | null;
    status?: 'draft' | 'queued' | 'scheduled' | 'published' | 'failed';
    created_at: string;
}

export interface SocialAccount {
    id: string;
    user_id: string;
    platform: 'facebook' | 'instagram';
    access_token: string;
    platform_user_id: string;
    page_id?: string;
    page_name?: string;
    token_expires_at: string;
}

export interface PostPlatform {
    id: string;
    post_id: string;
    platform: 'facebook' | 'instagram';
    platform_post_id: string | null;
    status: 'pending' | 'published' | 'failed';
    error_message?: string;
    engagement_stats: {
        likes?: number;
        comments?: number;
        shares?: number;
    };
}

export interface Subscription {
    id: string;
    user_id: string;
    plan: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    amount: number;
    starts_at: string;
    ends_at: string;
    razorpay_subscription_id: string | null;
}

export interface MediaItem {
    id: string;
    user_id: string;
    file_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    duration: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
    price: number;
    original_price: number;
    features: string[];
    posts_limit: number | null; // null = unlimited
    is_popular: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'monthly',
        name: 'Basic Monthly',
        duration: 'monthly',
        price: 99,
        original_price: 99,
        features: ['30 posts/month', 'Basic templates', 'Facebook posting', 'Email support'],
        posts_limit: 30,
        is_popular: false,
    },
    {
        id: 'quarterly',
        name: 'Quarterly',
        duration: 'quarterly',
        price: 249,
        original_price: 297,
        features: ['100 posts/quarter', 'All templates', 'Facebook + Instagram', 'Priority support'],
        posts_limit: 100,
        is_popular: true,
    },
    {
        id: 'half_yearly',
        name: 'Half Yearly',
        duration: 'half_yearly',
        price: 449,
        original_price: 594,
        features: ['Unlimited posts', 'All templates', 'Scheduling', 'Analytics', 'All platforms'],
        posts_limit: null,
        is_popular: false,
    },
    {
        id: 'annual',
        name: 'Annual',
        duration: 'annual',
        price: 799,
        original_price: 1188,
        features: ['Unlimited everything', 'Priority support', 'Custom templates', 'Team management'],
        posts_limit: null,
        is_popular: false,
    },
];
