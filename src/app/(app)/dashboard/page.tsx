'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';
import {
    LayoutDashboard,
    Palette,
    Send,
    Image,
    TrendingUp,
    Calendar,
    Plus,
    ArrowRight,
    FileText,
    Users,
    Clock,
} from 'lucide-react';

export default function DashboardPage() {
    const { profile } = useAuth();
    const { t } = useTranslation();

    const quickActions = [
        { href: '/templates', icon: Palette, label: t('dashboard.browse_templates'), color: 'bg-blue-500/10 text-blue-600' },
        { href: '/media', icon: Image, label: t('dashboard.upload_photo'), color: 'bg-green-500/10 text-green-600' },
        { href: '/posts', icon: Send, label: t('dashboard.view_posts'), color: 'bg-purple-500/10 text-purple-600' },
        { href: '/profile', icon: FileText, label: t('dashboard.edit_profile'), color: 'bg-orange-500/10 text-orange-600' },
    ];

    const recentTemplates = [
        { id: 1, name: 'Pongal Wishes 2026', category: t('templates.festival'), color: 'bg-yellow-500' },
        { id: 2, name: 'Party Meeting Poster', category: t('templates.event'), color: 'bg-blue-500' },
        { id: 3, name: 'Birthday Greeting', category: t('templates.birthday'), color: 'bg-pink-500' },
        { id: 4, name: 'Campaign Banner', category: t('templates.campaign'), color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl vck-gradient p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-60" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {t('dashboard.welcome', { name: profile?.name || 'Member' })}
                            </h1>
                            <p className="text-white/70 max-w-md">
                                {t('dashboard.welcome_subtitle')}
                            </p>
                        </div>
                        <Link href="/templates">
                            <Button className="bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('nav.create_post')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: t('dashboard.total_posts'), value: '0', change: t('dashboard.get_started'), icon: Send, color: 'text-blue-500' },
                    { title: t('dashboard.published'), value: '0', change: t('dashboard.this_month'), icon: TrendingUp, color: 'text-green-500' },
                    { title: t('dashboard.scheduled'), value: '0', change: t('dashboard.upcoming'), icon: Calendar, color: 'text-purple-500' },
                    { title: t('dashboard.media_files'), value: '0', change: t('dashboard.photos_uploaded'), icon: Image, color: 'text-orange-500' },
                ].map((stat) => (
                    <Card key={stat.title} className="border-border/50 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                            </div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions + Recent Templates */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Quick Actions */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            {t('dashboard.quick_actions')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link key={action.href} href={action.href}>
                                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                                        <div className={`p-2.5 rounded-lg ${action.color}`}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                            {action.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Templates */}
                <Card className="border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Palette className="h-5 w-5 text-primary" />
                            {t('dashboard.popular_templates')}
                        </CardTitle>
                        <Link href="/templates" className="text-sm text-primary hover:underline flex items-center gap-1">
                            {t('common.view_all')} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentTemplates.map((template) => (
                                <Link key={template.id} href="/templates">
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className={`h-10 w-10 rounded-lg ${template.color} flex items-center justify-center`}>
                                            <Palette className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{template.name}</p>
                                            <p className="text-xs text-muted-foreground">{template.category}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Social Accounts Status */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-primary" />
                        {t('dashboard.connected_accounts')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                            <div className="p-3 rounded-xl bg-blue-600/10">
                                <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Facebook</p>
                                <p className="text-xs text-muted-foreground">{t('common.not_connected')}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />{t('common.setup')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                            <div className="p-3 rounded-xl bg-pink-600/10">
                                <svg className="h-6 w-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Instagram</p>
                                <p className="text-xs text-muted-foreground">{t('common.not_connected')}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />{t('common.setup')}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
