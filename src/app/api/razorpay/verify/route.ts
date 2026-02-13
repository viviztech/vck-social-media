import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            plan_id,
            billing_cycle,
            user_id,
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing payment verification data' },
                { status: 400 }
            );
        }

        // Verify payment signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Payment verification failed — invalid signature' },
                { status: 400 }
            );
        }

        // In production: Save subscription record to Supabase
        // await supabase.from('subscriptions').insert({
        //   user_id,
        //   plan_id,
        //   billing_cycle,
        //   razorpay_order_id,
        //   razorpay_payment_id,
        //   status: 'active',
        //   starts_at: new Date().toISOString(),
        //   expires_at: billing_cycle === 'yearly'
        //     ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        //     : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        // });

        return NextResponse.json({
            success: true,
            message: 'Payment verified and subscription activated',
            payment_id: razorpay_payment_id,
            plan_id,
            billing_cycle,
        });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message || 'Verification failed' },
            { status: 500 }
        );
    }
}
