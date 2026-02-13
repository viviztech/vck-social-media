'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search, Filter, MoreVertical, UserPlus, Download,
    Shield, ShieldCheck, ShieldX, Mail, Phone,
    ChevronLeft, ChevronRight, Eye, Ban, Edit,
    Users, UserCheck, UserX, Clock,
} from 'lucide-react';

// Mock user data
const mockUsers = [
    { id: '1', name: 'Muthu Kumar', email: 'muthu@vck.org', phone: '+91 98765 43210', role: 'admin', district: 'Chennai', constituency: 'Mylapore', status: 'active', plan: 'Pro', posts: 124, joined: '2025-12-01' },
    { id: '2', name: 'Priya Lakshmi', email: 'priya@vck.org', phone: '+91 98765 43211', role: 'coordinator', district: 'Madurai', constituency: 'Central', status: 'active', plan: 'Basic', posts: 87, joined: '2026-01-05' },
    { id: '3', name: 'Karthik Raja', email: 'karthik@gmail.com', phone: '+91 98765 43212', role: 'member', district: 'Salem', constituency: 'West', status: 'active', plan: 'Starter', posts: 34, joined: '2026-01-15' },
    { id: '4', name: 'Deepa Sundar', email: 'deepa@yahoo.com', phone: '+91 98765 43213', role: 'member', district: 'Trichy', constituency: 'North', status: 'active', plan: 'Pro', posts: 56, joined: '2026-01-20' },
    { id: '5', name: 'Senthil Vel', email: 'senthil@vck.org', phone: '+91 98765 43214', role: 'coordinator', district: 'Coimbatore', constituency: 'South', status: 'active', plan: 'Party Office', posts: 201, joined: '2025-11-15' },
    { id: '6', name: 'Kavitha Rajan', email: 'kavitha@gmail.com', phone: '+91 98765 43215', role: 'member', district: 'Vellore', constituency: 'Central', status: 'suspended', plan: 'Basic', posts: 12, joined: '2026-02-01' },
    { id: '7', name: 'Manoj Kumar', email: 'manoj@outlook.com', phone: '+91 98765 43216', role: 'member', district: 'Erode', constituency: 'East', status: 'active', plan: 'Starter', posts: 8, joined: '2026-02-10' },
    { id: '8', name: 'Revathi Devi', email: 'revathi@vck.org', phone: '+91 98765 43217', role: 'member', district: 'Thanjavur', constituency: 'West', status: 'inactive', plan: null, posts: 0, joined: '2026-02-12' },
];

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const filteredUsers = mockUsers.filter(u => {
        const matchSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.district.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        const matchStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const stats = {
        total: mockUsers.length,
        active: mockUsers.filter(u => u.status === 'active').length,
        suspended: mockUsers.filter(u => u.status === 'suspended').length,
        admins: mockUsers.filter(u => u.role === 'admin' || u.role === 'coordinator').length,
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge className="bg-red-500/10 text-red-600 text-[10px]"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
            case 'coordinator': return <Badge className="bg-purple-500/10 text-purple-600 text-[10px]"><Shield className="h-3 w-3 mr-1" />Coordinator</Badge>;
            default: return <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">Member</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500/10 text-green-600 text-[10px]">Active</Badge>;
            case 'suspended': return <Badge className="bg-red-500/10 text-red-600 text-[10px]">Suspended</Badge>;
            default: return <Badge className="bg-gray-500/10 text-gray-600 text-[10px]">Inactive</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid gap-3 sm:grid-cols-4">
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Users</p></div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-green-500" />
                        <div><p className="text-xl font-bold">{stats.active}</p><p className="text-xs text-muted-foreground">Active</p></div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <UserX className="h-5 w-5 text-red-500" />
                        <div><p className="text-xl font-bold">{stats.suspended}</p><p className="text-xs text-muted-foreground">Suspended</p></div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-purple-500" />
                        <div><p className="text-xl font-bold">{stats.admins}</p><p className="text-xs text-muted-foreground">Staff</p></div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or district..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="member">Member</option>
                        </select>
                        <select
                            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-border/50">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">User</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Contact</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Role</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden md:table-cell">District</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Plan</th>
                                    <th className="text-center p-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Posts</th>
                                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="text-center p-3 text-xs font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 hidden sm:table-cell">
                                            <p className="text-xs">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                                        </td>
                                        <td className="p-3">{getRoleBadge(user.role)}</td>
                                        <td className="p-3 hidden md:table-cell">
                                            <p className="text-sm">{user.district}</p>
                                            <p className="text-xs text-muted-foreground">{user.constituency}</p>
                                        </td>
                                        <td className="p-3 hidden lg:table-cell">
                                            {user.plan ? (
                                                <Badge variant="outline" className="text-[10px]">{user.plan}</Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center hidden lg:table-cell">
                                            <span className="text-sm font-medium">{user.posts}</span>
                                        </td>
                                        <td className="p-3">{getStatusBadge(user.status)}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit Role">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" title="Suspend">
                                                    <Ban className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">Showing {filteredUsers.length} of {mockUsers.length} users</p>
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
