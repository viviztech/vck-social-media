import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserPages, getMetaUserInfo } from '@/lib/meta-api';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(
            new URL(`/social-accounts?error=${encodeURIComponent(error)}`, request.url)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL('/social-accounts?error=no_code', request.url)
        );
    }

    try {
        const redirectUri = `${request.nextUrl.origin}/api/meta/callback`;

        // Exchange code for long-lived token
        const tokenData = await exchangeCodeForToken(code, redirectUri);

        // Get user info
        const userInfo = await getMetaUserInfo(tokenData.access_token);

        // Get pages (includes IG accounts)
        const pages = await getUserPages(tokenData.access_token);

        // Store connection data in URL params (client will save to Supabase)
        const connectionData = {
            user_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            meta_user_id: userInfo.id,
            meta_user_name: userInfo.name,
            pages: pages.map((p) => ({
                id: p.id,
                name: p.name,
                access_token: p.access_token,
                category: p.category,
                instagram_id: p.instagram_business_account?.id || null,
            })),
        };

        // Redirect to social accounts page with the data
        const encoded = encodeURIComponent(JSON.stringify(connectionData));
        return NextResponse.redirect(
            new URL(`/social-accounts?connected=true&data=${encoded}`, request.url)
        );
    } catch (err) {
        const errorMsg = (err as Error).message || 'Unknown error';
        return NextResponse.redirect(
            new URL(`/social-accounts?error=${encodeURIComponent(errorMsg)}`, request.url)
        );
    }
}
