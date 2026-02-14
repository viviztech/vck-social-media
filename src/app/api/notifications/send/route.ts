import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
        );

        // Only initialize if we have the key, otherwise skip (development mode)
        if (serviceAccount.project_id) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
    } catch (e) {
        console.error('Firebase Admin init error:', e);
    }
}

export async function POST(request: Request) {
    // Check if Firebase is initialized
    if (!admin.apps.length) {
        return NextResponse.json(
            { error: 'Firebase not configured server-side' },
            { status: 503 }
        );
    }

    try {
        const { userIds, title, body, data } = await request.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'Invalid userIds' }, { status: 400 });
        }

        // Import Supabase client dynamically to avoid build-time issues
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // use service role in real app

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch tokens for these users
        const { data: tokensData, error } = await supabase
            .from('device_tokens')
            .select('token')
            .in('user_id', userIds);

        if (error) throw error;

        if (!tokensData || tokensData.length === 0) {
            return NextResponse.json({ message: 'No devices found for users' });
        }

        const tokens = tokensData.map(r => r.token);

        // Send multicast message
        const message = {
            notification: { title, body },
            data: data || {},
            tokens: tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);

        // Allow implementation of removing invalid tokens here in future
        // response.responses.forEach(...)

        return NextResponse.json({
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount
        });

    } catch (error: any) {
        console.error('Notification error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
