'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Send,
  Users,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/types';

const features = [
  {
    icon: Palette,
    title: 'Professional Templates',
    description: 'Party-branded templates for festivals, campaigns, events, and more — ready in seconds.',
  },
  {
    icon: Send,
    title: 'One-Click Publishing',
    description: 'Post directly to Facebook and Instagram pages with a single click.',
  },
  {
    icon: Users,
    title: 'Party Member Profiles',
    description: 'Upload your photo once — it auto-fills into every template you create.',
  },
  {
    icon: Zap,
    title: 'Schedule Posts',
    description: 'Plan your content calendar. Schedule posts for optimal engagement times.',
  },
  {
    icon: Shield,
    title: 'Consistent Branding',
    description: 'Every post carries VCK\'s identity with party logos, colors, and fonts.',
  },
  {
    icon: Globe,
    title: 'Multi-language',
    description: 'Create posts in Tamil, English, and Hindi — reach every constituency.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 vck-gradient opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VCK Social Media</h1>
              <p className="text-xs text-white/60">விடுதலை சிறுத்தைகள் கட்சி</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-[#1a237e] hover:bg-white/90 shadow-xl font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-28 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
            🎉 1 Million+ Party Members Trust Us
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Professional Social Media
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              For Every VCK Member
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70 mb-10">
            Create stunning party-branded posts in seconds. Upload your photo, pick a template,
            and publish directly to Facebook and Instagram — no design skills needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#1a237e] hover:bg-white/90 text-lg px-8 py-6 shadow-2xl font-semibold">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 text-lg px-8 py-6">
                See Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10L+', label: 'Members' },
              { value: '50L+', label: 'Posts Created' },
              { value: '4.8★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 120" className="w-full h-16 sm:h-24">
            <path
              fill="var(--background)"
              d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-[#1a237e] to-[#c62828] bg-clip-text text-transparent">
                Shine Online
              </span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From template selection to social media publishing — we handle everything so you can focus on serving your community.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h3 className="text-3xl sm:text-4xl font-bold mb-16">
            3 Simple Steps to{' '}
            <span className="bg-gradient-to-r from-[#1a237e] to-[#c62828] bg-clip-text text-transparent">
              Go Viral
            </span>
          </h3>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Your Photo', desc: 'Add your profile photo and party details once' },
              { step: '02', title: 'Pick a Template', desc: 'Choose from 100+ party-branded designs' },
              { step: '03', title: 'Publish Everywhere', desc: 'Post to Facebook & Instagram with one click' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-primary/10 mb-4">{item.step}</div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Plans for Every{' '}
              <span className="bg-gradient-to-r from-[#1a237e] to-[#c62828] bg-clip-text text-transparent">
                Party Worker
              </span>
            </h3>
            <p className="text-muted-foreground">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.is_popular
                    ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'border-border/50 hover:border-primary/30'
                  }`}
              >
                {plan.is_popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Star className="h-3 w-3" /> Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-1">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    {plan.original_price > plan.price && (
                      <span className="text-sm text-muted-foreground line-through">₹{plan.original_price}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-6">
                    {plan.duration === 'monthly' ? 'per month' : plan.duration === 'quarterly' ? 'per 3 months' : plan.duration === 'half_yearly' ? 'per 6 months' : 'per year'}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button
                      className={`w-full ${plan.is_popular ? '' : 'variant-outline'}`}
                      variant={plan.is_popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="vck-gradient py-12 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="text-lg font-bold text-white">VCK Social Media</span>
          </div>
          <p className="text-white/50 text-sm mb-2">
            விடுதலை சிறுத்தைகள் கட்சி — Viduthalai Chiruthaigal Katchi
          </p>
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} VCK Social Media Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
