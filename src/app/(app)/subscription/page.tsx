'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/lib/i18n';
import { PLANS, buildCheckoutOptions, SubscriptionPlan } from '@/lib/razorpay';
import {
    Crown, Check, Star, Zap, Shield, CreditCard,
    Calendar, ArrowRight, Loader2, Sparkles,
    ChevronDown, ChevronUp, Clock, Receipt,
    CheckCircle, XCircle,
} from 'lucide-react';

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

interface PaymentRecord {
    id: string;
    plan: string;
    amount: string;
    date: string;
    status: 'success' | 'failed' | 'pending';
}

export default function SubscriptionPage() {
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [loading, setLoading] = useState<string | null>(null);
    const [activePlan, setActivePlan] = useState<string | null>(null);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [showFaq, setShowFaq] = useState<string | null>(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.getElementById('razorpay-script')) {
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            document.head.appendChild(script);
        } else {
            setRazorpayLoaded(true);
        }
    }, []);

    // Load active plan from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('vck_active_plan');
        if (saved) setActivePlan(saved);

        const savedPayments = localStorage.getItem('vck_payments');
        if (savedPayments) {
            try { setPayments(JSON.parse(savedPayments)); } catch { /* ignore */ }
        }
    }, []);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        setLoading(plan.id);

        try {
            // Create order via API
            const res = await fetch('/api/razorpay/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan_id: plan.id,
                    billing_cycle: billingCycle,
                    user_email: profile?.email || '',
                    user_name: profile?.name || '',
                }),
            });

            const orderData = await res.json();

            if (!res.ok) {
                // For MVP without Razorpay keys, simulate the flow
                toast.info('Razorpay not configured yet — simulating payment...');
                await new Promise(r => setTimeout(r, 2000));

                // Simulate success
                const paymentRecord: PaymentRecord = {
                    id: `pay_sim_${Date.now()}`,
                    plan: plan.name,
                    amount: billingCycle === 'yearly' ? plan.displayYearlyPrice : plan.displayPrice,
                    date: new Date().toISOString(),
                    status: 'success',
                };

                const newPayments = [paymentRecord, ...payments];
                setPayments(newPayments);
                localStorage.setItem('vck_payments', JSON.stringify(newPayments));
                setActivePlan(plan.id);
                localStorage.setItem('vck_active_plan', plan.id);
                toast.success(`${plan.name} plan activated! 🎉`);
                setLoading(null);
                return;
            }

            // Open Razorpay checkout
            if (!razorpayLoaded || !window.Razorpay) {
                toast.error('Payment system loading. Please try again.');
                setLoading(null);
                return;
            }

            const options = buildCheckoutOptions(
                orderData,
                plan,
                billingCycle,
                profile?.email || '',
                profile?.name || '',
                async (response) => {
                    // Verify payment
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            plan_id: plan.id,
                            billing_cycle: billingCycle,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        const paymentRecord: PaymentRecord = {
                            id: response.razorpay_payment_id,
                            plan: plan.name,
                            amount: billingCycle === 'yearly' ? plan.displayYearlyPrice : plan.displayPrice,
                            date: new Date().toISOString(),
                            status: 'success',
                        };

                        const newPayments = [paymentRecord, ...payments];
                        setPayments(newPayments);
                        localStorage.setItem('vck_payments', JSON.stringify(newPayments));
                        setActivePlan(plan.id);
                        localStorage.setItem('vck_active_plan', plan.id);
                        toast.success(`${plan.name} plan activated! 🎉`);
                    } else {
                        toast.error('Payment verification failed');
                    }
                    setLoading(null);
                },
                () => {
                    setLoading(null);
                    toast.info('Payment cancelled');
                },
            );

            const rzp = new window.Razorpay(options as unknown as Record<string, unknown>);
            rzp.open();
        } catch (err) {
            toast.error('Payment failed: ' + (err as Error).message);
            setLoading(null);
        }
    };

    const planIcons = [Zap, Star, Crown, Shield];
    const savings = (plan: SubscriptionPlan) => {
        const yearly = plan.yearlyPrice;
        const monthlyTotal = plan.price * 12;
        return Math.round(((monthlyTotal - yearly) / monthlyTotal) * 100);
    };

    const faqs = [
        { q: 'Can I change my plan later?', a: 'Yes! You can upgrade or downgrade anytime. The new pricing takes effect from the next billing cycle.' },
        { q: 'What payment methods are accepted?', a: 'We support UPI, credit/debit cards, net banking, and popular wallets via Razorpay.' },
        { q: 'Is there a free trial?', a: 'The Starter plan at ₹99/month is our most affordable option. We don\'t offer a free trial but you can cancel anytime.' },
        { q: 'Do you offer refunds?', a: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with the service.' },
        { q: 'How does yearly billing work?', a: 'Yearly plans are billed once per year at a discounted rate. You save 33% compared to monthly billing.' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Special Launch Pricing
                    </Badge>
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a237e] to-[#c62828] bg-clip-text text-transparent">
                    {t('subscription.title')}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {t('subscription.subtitle')}
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {t('subscription.yearly')}
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-[10px]">
                        Save 33%
                    </Badge>
                </button>
            </div>

            {/* Active Subscription Banner */}
            {activePlan && (
                <Card className="border-2 border-green-500/30 bg-green-50/5 max-w-xl mx-auto">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-green-600">
                                Active: {PLANS.find(p => p.id === activePlan)?.name} Plan
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Your subscription is active. Manage or upgrade below.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Plans Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {PLANS.map((plan, idx) => {
                    const Icon = planIcons[idx];
                    const isActive = activePlan === plan.id;
                    const isPopular = plan.popular;

                    return (
                        <Card
                            key={plan.id}
                            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPopular
                                ? 'border-2 border-primary shadow-lg ring-1 ring-primary/10'
                                : isActive
                                    ? 'border-2 border-green-500/50'
                                    : 'border-border/50 hover:border-primary/30'
                                }`}
                        >
                            {isPopular && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                    POPULAR
                                </div>
                            )}

                            <CardHeader className="pb-3 text-center">
                                <div className={`h-12 w-12 rounded-xl mx-auto flex items-center justify-center mb-2 ${isPopular ? 'bg-primary/10' : 'bg-muted/50'
                                    }`}>
                                    <Icon className={`h-6 w-6 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <CardTitle className="text-lg">{plan.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">{plan.name_ta}</p>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Price */}
                                <div className="text-center">
                                    <div className="text-3xl font-bold">
                                        {billingCycle === 'yearly' ? plan.displayYearlyPrice : plan.displayPrice}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        per {billingCycle === 'yearly' ? 'year' : 'month'}
                                    </p>
                                    {billingCycle === 'yearly' && (
                                        <Badge className="mt-1 bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
                                            Save {savings(plan)}%
                                        </Badge>
                                    )}
                                </div>

                                <Separator />

                                {/* Features */}
                                <ul className="space-y-2">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Button
                                    className={`w-full transition-all ${isActive
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : isPopular
                                            ? ''
                                            : 'variant-outline'
                                        }`}
                                    variant={isActive ? 'default' : isPopular ? 'default' : 'outline'}
                                    onClick={() => !isActive && handleSubscribe(plan)}
                                    disabled={loading === plan.id || isActive}
                                >
                                    {loading === plan.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : isActive ? (
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                    ) : (
                                        <CreditCard className="h-4 w-4 mr-2" />
                                    )}
                                    {isActive ? t('subscription.current_plan') : loading === plan.id ? t('common.loading') : t('subscription.subscribe_now')}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Payment History */}
            {payments.length > 0 && (
                <Card className="border-border/50 max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-primary" />
                            {t('subscription.payment_history')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                                >
                                    <div className="flex items-center gap-3">
                                        {payment.status === 'success' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium">{payment.plan} Plan</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(payment.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">{payment.amount}</p>
                                        <Badge
                                            className={`text-[10px] ${payment.status === 'success'
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-red-500/10 text-red-600'
                                                }`}
                                        >
                                            {payment.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* FAQ */}
            <div className="max-w-2xl mx-auto space-y-3">
                <h2 className="text-xl font-bold text-center mb-4">{t('subscription.faq_title')}</h2>
                {faqs.map((faq) => (
                    <Card
                        key={faq.q}
                        className="border-border/50 cursor-pointer"
                        onClick={() => setShowFaq(showFaq === faq.q ? null : faq.q)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{faq.q}</p>
                                {showFaq === faq.q ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                            </div>
                            {showFaq === faq.q && (
                                <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Trust indicators */}
            <div className="text-center pb-4">
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5" /> Secure Payments
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Cancel Anytime
                    </span>
                    <span className="flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" /> UPI / Cards / NetBanking
                    </span>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-2">
                    Powered by Razorpay • PCI DSS Compliant
                </p>
            </div>
        </div>
    );
}
