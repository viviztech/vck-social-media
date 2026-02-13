'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users, FileText, CreditCard, TrendingUp,
    ArrowUpRight, ArrowDownRight, Eye, Download,
    UserPlus, Activity, Globe, Calendar,
} from 'lucide-react';

// Mock admin stats (replace with Supabase queries in production)
const mockStats = {
    totalUsers: 1247,
    newUsersToday: 23,
    userGrowth: 12.5,
    totalPosts: 8934,
    postsToday: 156,
    postGrowth: 8.3,
    activeSubscriptions: 892,
    revenue: 247800,
    revenueGrowth: 15.2,
    socialConnections: 734,
};

const recentActivities = [
    { id: 1, user: 'Muthu Kumar', action: 'Published post to Facebook', time: '2 min ago', type: 'post' },
    { id: 2, user: 'Priya Lakshmi', action: 'Subscribed to Pro plan', time: '15 min ago', type: 'subscription' },
    { id: 3, user: 'Karthik Raja', action: 'Connected Instagram account', time: '32 min ago', type: 'social' },
    { id: 4, user: 'Deepa Sundar', action: 'Registered new account', time: '1 hour ago', type: 'user' },
    { id: 5, user: 'Senthil Vel', action: 'Created campaign poster', time: '1 hour ago', type: 'post' },
    { id: 6, user: 'Kavitha Rajan', action: 'Upgraded to Party Office plan', time: '2 hours ago', type: 'subscription' },
    { id: 7, user: 'Manoj Kumar', action: 'Scheduled 5 posts', time: '3 hours ago', type: 'post' },
    { id: 8, user: 'Revathi Devi', action: 'Downloaded birthday template', time: '4 hours ago', type: 'post' },
];

const topTemplates = [
    { name: 'Festival Greeting', uses: 2341, growth: 12 },
    { name: 'Campaign Poster', uses: 1892, growth: 24 },
    { name: 'Birthday Greeting', uses: 1567, growth: 8 },
    { name: 'Event Announcement', uses: 1234, growth: -3 },
    { name: 'Achievement Post', uses: 987, growth: 18 },
];

export default function AdminDashboard() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

    const stats = [
        {
            title: 'Total Users',
            value: mockStats.totalUsers.toLocaleString(),
            change: `+${mockStats.newUsersToday} today`,
            growth: mockStats.userGrowth,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Total Posts',
            value: mockStats.totalPosts.toLocaleString(),
            change: `+${mockStats.postsToday} today`,
            growth: mockStats.postGrowth,
            icon: FileText,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Active Subscriptions',
            value: mockStats.activeSubscriptions.toLocaleString(),
            change: '71% conversion',
            growth: mockStats.revenueGrowth,
            icon: CreditCard,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
        {
            title: 'Monthly Revenue',
            value: `₹${(mockStats.revenue / 100).toLocaleString()}`,
            change: '+15.2% vs last month',
            growth: mockStats.revenueGrowth,
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Period Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Welcome back, here&apos;s your overview</p>
                </div>
                <div className="flex bg-muted/50 rounded-lg p-1">
                    {(['today', 'week', 'month'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === p ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-border/50 hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <div className="flex items-center gap-1">
                                            {stat.growth > 0 ? (
                                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                                            )}
                                            <span className={`text-xs font-medium ${stat.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stat.growth}%
                                            </span>
                                            <span className="text-xs text-muted-foreground">{stat.change}</span>
                                        </div>
                                    </div>
                                    <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Row — Visual bars */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Posts Chart */}
                <Card className="border-border/50 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Post Activity (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 h-40">
                            {[45, 62, 38, 78, 55, 92, 67].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-md transition-all hover:from-primary hover:to-primary/60"
                                        style={{ height: `${val}%` }}
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Templates */}
                <Card className="border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                            Top Templates
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topTemplates.map((tmpl, i) => (
                            <div key={tmpl.name} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{tmpl.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary/60 rounded-full"
                                                style={{ width: `${(tmpl.uses / topTemplates[0].uses) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{tmpl.uses}</span>
                                    </div>
                                </div>
                                <Badge className={`text-[10px] ${tmpl.growth > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                    {tmpl.growth > 0 ? '+' : ''}{tmpl.growth}%
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'post' ? 'bg-blue-500/10' :
                                        activity.type === 'subscription' ? 'bg-purple-500/10' :
                                            activity.type === 'social' ? 'bg-green-500/10' : 'bg-orange-500/10'
                                    }`}>
                                    {activity.type === 'post' ? <FileText className="h-3.5 w-3.5 text-blue-500" /> :
                                        activity.type === 'subscription' ? <CreditCard className="h-3.5 w-3.5 text-purple-500" /> :
                                            activity.type === 'social' ? <Globe className="h-3.5 w-3.5 text-green-500" /> :
                                                <UserPlus className="h-3.5 w-3.5 text-orange-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats Footer */}
            <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-lg font-bold">{mockStats.socialConnections}</p>
                            <p className="text-xs text-muted-foreground">Social Connections</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Download className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-lg font-bold">12,456</p>
                            <p className="text-xs text-muted-foreground">Total Downloads</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Activity className="h-5 w-5 text-purple-500" />
                        <div>
                            <p className="text-lg font-bold">98.7%</p>
                            <p className="text-xs text-muted-foreground">Uptime</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
