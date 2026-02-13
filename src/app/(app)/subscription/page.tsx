'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SUBSCRIPTION_PLANS } from '@/lib/types';
import { toast } from 'sonner';
import {
    CreditCard, Star, CheckCircle, ArrowRight, Crown,
    Sparkles, Shield, Zap,
} from 'lucide-react';

export default function SubscriptionPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSubscribe = (planId: string) => {
        setSelectedPlan(planId);
        toast.info('Razorpay integration will be connected with your account. Coming soon!');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <CreditCard className="h-7 w-7 text-primary" />
                    Subscription Plans
                </h1>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                    Choose a plan that fits your needs. All plans include party-branded templates and Meta publishing.
                </p>
            </div>

            {/* Current Plan Badge */}
            <div className="flex justify-center">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                    You&apos;re on the <strong className="ml-1">Free Trial</strong> — 5 posts remaining
                </Badge>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {SUBSCRIPTION_PLANS.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${plan.is_popular
                                ? 'border-primary shadow-lg shadow-primary/10 scale-[1.03]'
                                : selectedPlan === plan.id
                                    ? 'border-primary/50 shadow-md'
                                    : 'border-border/50 hover:border-primary/30'
                            }`}
                        onClick={() => setSelectedPlan(plan.id)}
                    >
                        {plan.is_popular && (
                            <div className="absolute top-0 inset-x-0 h-1 vck-gradient" />
                        )}
                        {plan.is_popular && (
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-primary text-primary-foreground text-xs shadow-lg">
                                    <Star className="h-3 w-3 mr-1" /> Popular
                                </Badge>
                            </div>
                        )}
                        <CardContent className="p-6 pt-8">
                            <div className="mb-4">
                                {plan.duration === 'annual' ? (
                                    <Crown className="h-8 w-8 text-yellow-500 mb-3" />
                                ) : plan.duration === 'half_yearly' ? (
                                    <Shield className="h-8 w-8 text-purple-500 mb-3" />
                                ) : plan.duration === 'quarterly' ? (
                                    <Zap className="h-8 w-8 text-blue-500 mb-3" />
                                ) : (
                                    <Sparkles className="h-8 w-8 text-green-500 mb-3" />
                                )}
                                <h3 className="text-lg font-bold">{plan.name}</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-black">₹{plan.price}</span>
                            </div>
                            {plan.original_price > plan.price && (
                                <p className="text-sm text-muted-foreground mb-1">
                                    <span className="line-through">₹{plan.original_price}</span>
                                    <Badge variant="secondary" className="ml-2 text-xs text-green-600">
                                        Save {Math.round((1 - plan.price / plan.original_price) * 100)}%
                                    </Badge>
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mb-6">
                                {plan.duration === 'monthly' ? 'per month' : plan.duration === 'quarterly' ? 'per 3 months' : plan.duration === 'half_yearly' ? 'per 6 months' : 'per year'}
                            </p>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className="w-full"
                                variant={plan.is_popular ? 'default' : 'outline'}
                                onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id); }}
                            >
                                Subscribe
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FAQ */}
            <Card className="border-border/50 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-lg text-center">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.' },
                        { q: 'What payment methods are accepted?', a: 'We accept UPI, debit/credit cards, net banking, and popular wallets via Razorpay.' },
                        { q: 'Is there a free trial?', a: 'Yes! Every new account gets 7 days free trial with 5 posts included.' },
                        { q: 'Can I upgrade my plan?', a: 'Absolutely. You can upgrade anytime and the price difference will be prorated.' },
                    ].map((faq) => (
                        <div key={faq.q} className="border-b border-border/50 pb-4 last:border-0">
                            <h4 className="font-semibold text-sm mb-1">{faq.q}</h4>
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
