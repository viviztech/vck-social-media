import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, getPlanById } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { plan_id, billing_cycle, user_email, user_name } = body;

        if (!plan_id || !billing_cycle) {
            return NextResponse.json(
                { error: 'Missing plan_id or billing_cycle' },
                { status: 400 }
            );
        }

        const plan = getPlanById(plan_id);
        if (!plan) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        const amount = billing_cycle === 'yearly' ? plan.yearlyPrice : plan.price;
        const receipt = `vck_${plan_id}_${Date.now()}`;

        const order = await createRazorpayOrder(amount, 'INR', receipt, {
            plan_id,
            billing_cycle,
            user_email: user_email || '',
            user_name: user_name || '',
        });

        return NextResponse.json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            plan_id,
            billing_cycle,
        });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
