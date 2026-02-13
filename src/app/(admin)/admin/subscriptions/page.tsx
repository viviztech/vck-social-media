'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    CreditCard, TrendingUp, Users, Search,
    IndianRupee, ArrowUpRight, CheckCircle, XCircle, Clock,
    Download, ChevronLeft, ChevronRight, Eye, RefreshCw,
} from 'lucide-react';

// Mock subscription data
const mockSubscriptions = [
    { id: '1', user: 'Muthu Kumar', email: 'muthu@vck.org', plan: 'Pro', billing: 'yearly', amount: '₹3,599', status: 'active', startDate: '2026-01-01', expiresAt: '2027-01-01', paymentId: 'pay_ABC123' },
    { id: '2', user: 'Priya Lakshmi', email: 'priya@vck.org', plan: 'Basic', billing: 'monthly', amount: '₹249', status: 'active', startDate: '2026-02-01', expiresAt: '2026-03-01', paymentId: 'pay_DEF456' },
    { id: '3', user: 'Senthil Vel', email: 'senthil@vck.org', plan: 'Party Office', billing: 'yearly', amount: '₹6,399', status: 'active', startDate: '2025-12-15', expiresAt: '2026-12-15', paymentId: 'pay_GHI789' },
    { id: '4', user: 'Deepa Sundar', email: 'deepa@yahoo.com', plan: 'Pro', billing: 'monthly', amount: '₹449', status: 'active', startDate: '2026-02-10', expiresAt: '2026-03-10', paymentId: 'pay_JKL012' },
    { id: '5', user: 'Karthik Raja', email: 'karthik@gmail.com', plan: 'Starter', billing: 'monthly', amount: '₹99', status: 'cancelled', startDate: '2026-01-15', expiresAt: '2026-02-15', paymentId: 'pay_MNO345' },
    { id: '6', user: 'Kavitha Rajan', email: 'kavitha@gmail.com', plan: 'Basic', billing: 'yearly', amount: '₹1,999', status: 'expired', startDate: '2025-02-01', expiresAt: '2026-02-01', paymentId: 'pay_PQR678' },
    { id: '7', user: 'Manoj Kumar', email: 'manoj@outlook.com', plan: 'Starter', billing: 'monthly', amount: '₹99', status: 'active', startDate: '2026-02-12', expiresAt: '2026-03-12', paymentId: 'pay_STU901' },
];

const revenueByPlan = [
    { plan: 'Starter', count: 234, revenue: 23166, color: 'bg-blue-500' },
    { plan: 'Basic', count: 412, revenue: 102588, color: 'bg-green-500' },
    { plan: 'Pro', count: 189, revenue: 84861, color: 'bg-purple-500' },
    { plan: 'Party Office', count: 57, revenue: 45543, color: 'bg-orange-500' },
];

export default function SubscriptionsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredSubs = mockSubscriptions.filter(s => {
        const matchSearch = !search ||
            s.user.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalRevenue = revenueByPlan.reduce((acc, p) => acc + p.revenue, 0);
    const totalSubscribers = revenueByPlan.reduce((acc, p) => acc + p.count, 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500/10 text-green-600 text-[10px]"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
            case 'cancelled': return <Badge className="bg-red-500/10 text-red-600 text-[10px]"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
            case 'expired': return <Badge className="bg-gray-500/10 text-gray-600 text-[10px]"><Clock className="h-3 w-3 mr-1" />Expired</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Revenue Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-border/50 sm:col-span-1">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <IndianRupee className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                                <p className="text-2xl font-bold">₹{(totalRevenue / 100).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">+15.2%</span>
                            <span className="text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 sm:col-span-1">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Subscribers</p>
                                <p className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">+8.7%</span>
                            <span className="text-muted-foreground">growth rate</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 sm:col-span-1">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Avg Revenue / User</p>
                                <p className="text-2xl font-bold">₹{Math.round(totalRevenue / totalSubscribers / 100)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">+3.1%</span>
                            <span className="text-muted-foreground">vs last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue by Plan */}
            <Card className="border-border/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {revenueByPlan.map((plan) => (
                            <div key={plan.plan} className="flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${plan.color} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{plan.plan}</span>
                                        <span className="text-xs text-muted-foreground">{plan.count} users • ₹{(plan.revenue / 100).toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${plan.color} rounded-full transition-all`}
                                            style={{ width: `${(plan.revenue / totalRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-border/50">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by user or email..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="expired">Expired</option>
                        </select>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card className="border-border/50">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">User</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Plan</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Billing</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Expires</th>
                                    <th className="text-center p-3 text-xs font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubs.map((sub) => (
                                    <tr key={sub.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                    {sub.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{sub.user}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="outline" className="text-[10px]">{sub.plan}</Badge>
                                        </td>
                                        <td className="p-3 hidden sm:table-cell">
                                            <span className="text-xs capitalize">{sub.billing}</span>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-sm font-medium">{sub.amount}</span>
                                        </td>
                                        <td className="p-3">{getStatusBadge(sub.status)}</td>
                                        <td className="p-3 hidden md:table-cell">
                                            <span className="text-xs text-muted-foreground">{sub.expiresAt}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View"><Eye className="h-3.5 w-3.5" /></Button>
                                                {sub.status === 'active' && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-500" title="Cancel">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {sub.status === 'expired' && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500" title="Renew">
                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between p-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">Showing {filteredSubs.length} of {mockSubscriptions.length} subscriptions</p>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-xs px-2">Page 1 of 1</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
