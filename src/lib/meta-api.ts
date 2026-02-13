// ============================================
// VCK Social Media — Meta Graph API Utility
// ============================================

const META_API_VERSION = 'v19.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaPageInfo {
    id: string;
    name: string;
    access_token: string;
    category: string;
    instagram_business_account?: { id: string };
}

export interface MetaPublishResult {
    success: boolean;
    post_id?: string;
    error?: string;
}

// Build the OAuth login URL for Facebook
export function getMetaOAuthURL(): string {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || process.env.META_APP_ID || '';
    const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/meta/callback`;
    const scopes = [
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_posts',
        'instagram_basic',
        'instagram_content_publish',
        'publish_to_groups',
    ].join(',');

    return `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;
}

// Exchange short-lived code for long-lived token
export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
}> {
    const appId = process.env.META_APP_ID || '';
    const appSecret = process.env.META_APP_SECRET || '';

    // Step 1: Get short-lived token
    const shortRes = await fetch(
        `${META_BASE_URL}/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
    );
    const shortData = await shortRes.json();

    if (shortData.error) throw new Error(shortData.error.message);

    // Step 2: Exchange for long-lived token
    const longRes = await fetch(
        `${META_BASE_URL}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortData.access_token}`
    );
    const longData = await longRes.json();

    if (longData.error) throw new Error(longData.error.message);

    return longData;
}

// Get user's Facebook pages
export async function getUserPages(accessToken: string): Promise<MetaPageInfo[]> {
    const res = await fetch(
        `${META_BASE_URL}/me/accounts?fields=id,name,access_token,category,instagram_business_account&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.data || [];
}

// Publish a photo post to a Facebook Page
export async function publishToFacebook(
    pageId: string,
    pageAccessToken: string,
    imageUrl: string,
    caption: string,
): Promise<MetaPublishResult> {
    try {
        const res = await fetch(`${META_BASE_URL}/${pageId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: imageUrl,
                caption,
                access_token: pageAccessToken,
            }),
        });
        const data = await res.json();
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        return { success: true, post_id: data.id };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

// Publish to Instagram (2-step: create container, then publish)
export async function publishToInstagram(
    igAccountId: string,
    pageAccessToken: string,
    imageUrl: string,
    caption: string,
): Promise<MetaPublishResult> {
    try {
        // Step 1: Create media container
        const containerRes = await fetch(`${META_BASE_URL}/${igAccountId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: imageUrl,
                caption,
                access_token: pageAccessToken,
            }),
        });
        const containerData = await containerRes.json();
        if (containerData.error) {
            return { success: false, error: containerData.error.message };
        }

        // Step 2: Publish the container
        const publishRes = await fetch(`${META_BASE_URL}/${igAccountId}/media_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creation_id: containerData.id,
                access_token: pageAccessToken,
            }),
        });
        const publishData = await publishRes.json();
        if (publishData.error) {
            return { success: false, error: publishData.error.message };
        }
        return { success: true, post_id: publishData.id };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

// Schedule a post (Facebook supports scheduled publishing)
export async function scheduleOnFacebook(
    pageId: string,
    pageAccessToken: string,
    imageUrl: string,
    caption: string,
    scheduledTime: number, // Unix timestamp
): Promise<MetaPublishResult> {
    try {
        const res = await fetch(`${META_BASE_URL}/${pageId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: imageUrl,
                caption,
                published: false,
                scheduled_publish_time: scheduledTime,
                access_token: pageAccessToken,
            }),
        });
        const data = await res.json();
        if (data.error) {
            return { success: false, error: data.error.message };
        }
        return { success: true, post_id: data.id };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

// Get user profile info
export async function getMetaUserInfo(accessToken: string): Promise<{ id: string; name: string; }> {
    const res = await fetch(`${META_BASE_URL}/me?fields=id,name&access_token=${accessToken}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data;
}
