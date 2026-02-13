import { NextResponse } from 'next/server';

// Vercel Cron Job — runs every 5 minutes
// Publishes queued posts whose scheduled_at <= now

export async function GET(request: Request) {
    // Verify cron secret (Vercel sets this automatically for cron jobs)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Dynamic import to avoid issues with server-side Supabase client
        const { createClient } = await import('@supabase/supabase-js');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch queued posts that are due
        const now = new Date().toISOString();
        const { data: duePosts, error: fetchError } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'queued')
            .lte('scheduled_at', now)
            .order('scheduled_at', { ascending: true })
            .limit(20);

        if (fetchError) {
            console.error('Error fetching queued posts:', fetchError);
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        if (!duePosts || duePosts.length === 0) {
            return NextResponse.json({ message: 'No posts due', processed: 0 });
        }

        const results = [];

        for (const post of duePosts) {
            try {
                // Get user's social account
                const { data: socialAccount } = await supabase
                    .from('social_accounts')
                    .select('*')
                    .eq('user_id', post.user_id)
                    .eq('platform', 'meta')
                    .eq('is_connected', true)
                    .maybeSingle();

                if (!socialAccount || !socialAccount.access_token) {
                    // Mark as failed — no social account connected
                    await supabase
                        .from('posts')
                        .update({ status: 'failed', published_at: now })
                        .eq('id', post.id);

                    results.push({ id: post.id, status: 'failed', reason: 'No social account' });
                    continue;
                }

                // Parse pages from social account
                const pages = socialAccount.pages || [];
                const page = pages[0] as { id: string; access_token: string; instagram_id?: string } | undefined;

                if (!page) {
                    await supabase
                        .from('posts')
                        .update({ status: 'failed', published_at: now })
                        .eq('id', post.id);

                    results.push({ id: post.id, status: 'failed', reason: 'No page connected' });
                    continue;
                }

                const platforms = post.platforms || ['facebook'];
                let publishedAny = false;

                // Publish to Facebook
                if (platforms.includes('facebook') && post.image_url) {
                    try {
                        const fbRes = await fetch(
                            `https://graph.facebook.com/v18.0/${page.id}/photos`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    url: post.image_url,
                                    message: post.caption || '',
                                    access_token: page.access_token,
                                }),
                            }
                        );
                        if (fbRes.ok) publishedAny = true;
                    } catch (err) {
                        console.error('Facebook publish error:', err);
                    }
                }

                // Publish to Instagram
                if (platforms.includes('instagram') && page.instagram_id && post.image_url) {
                    try {
                        // Step 1: Create media container
                        const containerRes = await fetch(
                            `https://graph.facebook.com/v18.0/${page.instagram_id}/media`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    image_url: post.image_url,
                                    caption: post.caption || '',
                                    access_token: page.access_token,
                                }),
                            }
                        );

                        if (containerRes.ok) {
                            const container = await containerRes.json();
                            // Step 2: Publish
                            const publishRes = await fetch(
                                `https://graph.facebook.com/v18.0/${page.instagram_id}/media_publish`,
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        creation_id: container.id,
                                        access_token: page.access_token,
                                    }),
                                }
                            );
                            if (publishRes.ok) publishedAny = true;
                        }
                    } catch (err) {
                        console.error('Instagram publish error:', err);
                    }
                }

                // Update post status
                const newStatus = publishedAny ? 'published' : 'failed';
                await supabase
                    .from('posts')
                    .update({ status: newStatus, published_at: now })
                    .eq('id', post.id);

                results.push({ id: post.id, status: newStatus });
            } catch (err) {
                console.error(`Error processing post ${post.id}:`, err);
                await supabase
                    .from('posts')
                    .update({ status: 'failed', published_at: now })
                    .eq('id', post.id);

                results.push({ id: post.id, status: 'failed', reason: String(err) });
            }
        }

        return NextResponse.json({
            message: `Processed ${results.length} posts`,
            processed: results.length,
            results,
        });
    } catch (err) {
        console.error('Cron job error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
