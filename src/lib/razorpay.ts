// ============================================
// VCK Social Media — Razorpay Billing Utility
// ============================================

// Subscription plan definitions (₹ INR)
export interface SubscriptionPlan {
    id: string;
    name: string;
    name_ta: string;
    price: number;          // monthly price in paise
    yearlyPrice: number;    // yearly price in paise
    displayPrice: string;
    displayYearlyPrice: string;
    features: string[];
    popular?: boolean;
    razorpay_plan_id_monthly?: string;
    razorpay_plan_id_yearly?: string;
}

export const PLANS: SubscriptionPlan[] = [
    {
        id: 'starter',
        name: 'Starter',
        name_ta: 'தொடக்கம்',
        price: 9900,         // ₹99
        yearlyPrice: 79900,  // ₹799/year
        displayPrice: '₹99',
        displayYearlyPrice: '₹799',
        features: [
            '5 posts per month',
            '3 basic templates',
            'Facebook publishing',
            'Download images',
        ],
    },
    {
        id: 'basic',
        name: 'Basic',
        name_ta: 'அடிப்படை',
        price: 24900,         // ₹249
        yearlyPrice: 199900,  // ₹1,999/year
        displayPrice: '₹249',
        displayYearlyPrice: '₹1,999',
        popular: true,
        features: [
            '20 posts per month',
            'All templates',
            'Facebook + Instagram',
            'Post scheduling',
            'Priority support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        name_ta: 'தொழில்முறை',
        price: 44900,          // ₹449
        yearlyPrice: 359900,   // ₹3,599/year
        displayPrice: '₹449',
        displayYearlyPrice: '₹3,599',
        features: [
            'Unlimited posts',
            'All templates + custom',
            'All platforms',
            'Advanced scheduling',
            'Analytics dashboard',
            'Priority support',
        ],
    },
    {
        id: 'party',
        name: 'Party Office',
        name_ta: 'கட்சி அலுவலகம்',
        price: 79900,          // ₹799
        yearlyPrice: 639900,   // ₹6,399/year
        displayPrice: '₹799',
        displayYearlyPrice: '₹6,399',
        features: [
            'Unlimited everything',
            'Multi-user access',
            'Custom branding',
            'Bulk scheduling',
            'Analytics + reports',
            'Dedicated support',
            'API access',
        ],
    },
];

export function getPlanById(planId: string): SubscriptionPlan | undefined {
    return PLANS.find((p) => p.id === planId);
}

// Razorpay order creation (server-side only)
export async function createRazorpayOrder(
    amount: number,
    currency: string = 'INR',
    receipt: string,
    notes: Record<string, string> = {},
) {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials not configured');
    }

    const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        },
        body: JSON.stringify({
            amount,
            currency,
            receipt,
            notes,
        }),
    });

    const data = await res.json();

    if (data.error) {
        throw new Error(data.error.description || 'Failed to create order');
    }

    return data;
}

// Verify Razorpay payment signature (server-side)
export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
): boolean {
    const crypto = require('crypto');
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) return false;

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

    return expectedSignature === signature;
}

// Razorpay subscription creation
export async function createRazorpaySubscription(
    planId: string,
    totalCount: number = 12,
    customerEmail: string,
    customerName: string,
) {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials not configured');
    }

    const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        },
        body: JSON.stringify({
            plan_id: planId,
            total_count: totalCount,
            quantity: 1,
            notes: {
                customer_email: customerEmail,
                customer_name: customerName,
            },
        }),
    });

    const data = await res.json();

    if (data.error) {
        throw new Error(data.error.description || 'Failed to create subscription');
    }

    return data;
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string) {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials not configured');
    }

    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        },
    });

    return res.json();
}

// Razorpay checkout options builder (client-side)
export function buildCheckoutOptions(
    order: { id: string; amount: number; currency: string },
    plan: SubscriptionPlan,
    billingCycle: 'monthly' | 'yearly',
    userEmail: string,
    userName: string,
    onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void,
    onClose: () => void,
) {
    return {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'VCK Social Media',
        description: `${plan.name} Plan - ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}`,
        order_id: order.id,
        prefill: {
            name: userName,
            email: userEmail,
        },
        theme: {
            color: '#1a237e',
        },
        handler: onSuccess,
        modal: {
            ondismiss: onClose,
        },
        notes: {
            plan_id: plan.id,
            billing_cycle: billingCycle,
        },
    };
}
