'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3, TrendingUp, Users, FileText,
    Globe, ArrowUpRight, ArrowDownRight, Eye,
    Download, Clock, Calendar, Smartphone, Monitor,
} from 'lucide-react';

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    // Mock analytics data
    const platformStats = [
        { platform: 'Facebook', posts: 4523, engagement: 12.4, growth: 8.2, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-500/10' },
        { platform: 'Instagram', posts: 3211, engagement: 18.7, growth: 15.1, icon: Globe, color: 'text-pink-600', bg: 'bg-pink-500/10' },
    ];

    const templateUsage = [
        { name: 'Festival Greeting', uses: 2341, percentage: 26.2 },
        { name: 'Campaign Poster', uses: 1892, percentage: 21.2 },
        { name: 'Birthday Greeting', uses: 1567, percentage: 17.5 },
        { name: 'Event Announcement', uses: 1234, percentage: 13.8 },
        { name: 'Achievement Post', uses: 987, percentage: 11.0 },
        { name: 'Condolence Message', uses: 456, percentage: 5.1 },
        { name: 'Announcement Banner', uses: 312, percentage: 3.5 },
        { name: 'Story Template', uses: 145, percentage: 1.6 },
    ];

    const dailyPosts = [
        { day: '1', posts: 42 }, { day: '2', posts: 38 }, { day: '3', posts: 55 },
        { day: '4', posts: 47 }, { day: '5', posts: 62 }, { day: '6', posts: 51 },
        { day: '7', posts: 68 }, { day: '8', posts: 44 }, { day: '9', posts: 73 },
        { day: '10', posts: 59 }, { day: '11', posts: 82 }, { day: '12', posts: 65 },
        { day: '13', posts: 91 }, { day: '14', posts: 78 },
    ];

    const maxPosts = Math.max(...dailyPosts.map(d => d.posts));

    const districtStats = [
        { district: 'Chennai', users: 312, posts: 2134 },
        { district: 'Madurai', users: 187, posts: 1456 },
        { district: 'Coimbatore', users: 156, posts: 1234 },
        { district: 'Salem', users: 134, posts: 987 },
        { district: 'Trichy', users: 112, posts: 876 },
        { district: 'Vellore', users: 98, posts: 654 },
        { district: 'Erode', users: 87, posts: 543 },
        { district: 'Thanjavur', users: 76, posts: 432 },
    ];

    const deviceStats = [
        { device: 'Mobile (Android)', percentage: 62, icon: Smartphone },
        { device: 'Mobile (iOS)', percentage: 18, icon: Smartphone },
        { device: 'Desktop', percentage: 20, icon: Monitor },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Analytics</h2>
                    <p className="text-sm text-muted-foreground">Platform usage and engagement metrics</p>
                </div>
                <div className="flex bg-muted/50 rounded-lg p-1">
                    {(['7d', '30d', '90d'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === p ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
                {platformStats.map((p) => {
                    const Icon = p.icon;
                    return (
                        <Card key={p.platform} className="border-border/50">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-10 w-10 rounded-xl ${p.bg} flex items-center justify-center`}>
                                        <Icon className={`h-5 w-5 ${p.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{p.platform}</p>
                                        <p className="text-xs text-muted-foreground">{p.posts.toLocaleString()} posts</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Engagement Rate</p>
                                        <p className="text-lg font-bold">{p.engagement}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Growth</p>
                                        <div className="flex items-center gap-1">
                                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                                            <p className="text-lg font-bold text-green-500">+{p.growth}%</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Posts Chart */}
            <Card className="border-border/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Daily Posts (Last 14 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-1.5 h-48">
                        {dailyPosts.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[9px] text-muted-foreground">{d.posts}</span>
                                <div
                                    className="w-full bg-gradient-to-t from-primary/80 to-primary/30 rounded-t-sm transition-all hover:from-primary hover:to-primary/50 cursor-pointer"
                                    style={{ height: `${(d.posts / maxPosts) * 100}%` }}
                                    title={`Day ${d.day}: ${d.posts} posts`}
                                />
                                <span className="text-[9px] text-muted-foreground">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Template Usage + District + Device */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Template Usage */}
                <Card className="border-border/50 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Template Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                        {templateUsage.map((t, i) => (
                            <div key={t.name} className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground w-3">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-xs font-medium truncate">{t.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{t.percentage}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary/60 rounded-full"
                                            style={{ width: `${t.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* District Stats */}
                <Card className="border-border/50 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Top Districts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                        {districtStats.map((d, i) => (
                            <div key={d.district} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground w-3">{i + 1}</span>
                                    <div>
                                        <p className="text-xs font-medium">{d.district}</p>
                                        <p className="text-[10px] text-muted-foreground">{d.users} users</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[10px]">{d.posts} posts</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Device Stats */}
                <Card className="border-border/50 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Device Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {deviceStats.map((d) => {
                            const Icon = d.icon;
                            return (
                                <div key={d.device} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs font-medium">{d.device}</span>
                                        </div>
                                        <span className="text-sm font-bold">{d.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary/60 rounded-full transition-all"
                                            style={{ width: `${d.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-2 border-t border-border/30">
                            <p className="text-xs text-muted-foreground mb-2">Peak Hours</p>
                            <div className="flex gap-1">
                                {[2, 3, 5, 8, 12, 15, 18, 22, 28, 35, 42, 38, 45, 52, 48, 55, 62, 58, 45, 32, 25, 18, 10, 5].map((v, i) => (
                                    <div key={i} className="flex-1">
                                        <div
                                            className="bg-primary/40 rounded-sm hover:bg-primary/60 transition-colors"
                                            style={{ height: `${v / 62 * 40}px` }}
                                            title={`${i}:00 - ${v} posts`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[8px] text-muted-foreground">12 AM</span>
                                <span className="text-[8px] text-muted-foreground">12 PM</span>
                                <span className="text-[8px] text-muted-foreground">11 PM</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
