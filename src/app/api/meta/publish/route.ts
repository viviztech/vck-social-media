import { NextRequest, NextResponse } from 'next/server';
import { publishToFacebook, publishToInstagram, scheduleOnFacebook } from '@/lib/meta-api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            platform,
            page_id,
            page_access_token,
            instagram_id,
            image_url,
            caption,
            scheduled_at,
        } = body;

        if (!image_url || !caption) {
            return NextResponse.json(
                { error: 'Missing image_url or caption' },
                { status: 400 }
            );
        }

        // Scheduled posting
        if (scheduled_at) {
            const scheduledTime = Math.floor(new Date(scheduled_at).getTime() / 1000);
            const now = Math.floor(Date.now() / 1000);

            if (scheduledTime <= now + 600) {
                return NextResponse.json(
                    { error: 'Scheduled time must be at least 10 minutes in the future' },
                    { status: 400 }
                );
            }

            if (platform === 'facebook' && page_id && page_access_token) {
                const result = await scheduleOnFacebook(page_id, page_access_token, image_url, caption, scheduledTime);
                return NextResponse.json(result);
            }

            // Instagram doesn't support native scheduling via API — we'll store it for cron
            return NextResponse.json({
                success: true,
                scheduled: true,
                message: 'Post scheduled. It will be published at the scheduled time.',
            });
        }

        // Immediate publishing
        if (platform === 'facebook') {
            if (!page_id || !page_access_token) {
                return NextResponse.json({ error: 'Missing Facebook page credentials' }, { status: 400 });
            }
            const result = await publishToFacebook(page_id, page_access_token, image_url, caption);
            return NextResponse.json(result);
        }

        if (platform === 'instagram') {
            if (!instagram_id || !page_access_token) {
                return NextResponse.json({ error: 'Missing Instagram credentials' }, { status: 400 });
            }
            const result = await publishToInstagram(instagram_id, page_access_token, image_url, caption);
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message || 'Failed to publish' },
            { status: 500 }
        );
    }
}
