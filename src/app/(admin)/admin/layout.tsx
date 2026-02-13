'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard, Users, FileText, CreditCard,
    Settings, Shield, ChevronLeft, ChevronRight,
    LogOut, Menu, X, BarChart3, Bell,
} from 'lucide-react';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Admin guard — check role
    const isAdmin = profile?.role === 'admin' || profile?.role === 'coordinator';

    if (!isAdmin && profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Shield className="h-16 w-16 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground">You don&apos;t have admin privileges</p>
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen bg-card border-r border-border/50 z-50 transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'
                    } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo */}
                <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} border-b border-border/30`}>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1a237e] to-[#c62828] flex items-center justify-center shrink-0">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    {!collapsed && (
                        <div>
                            <h2 className="text-sm font-bold">VCK Admin</h2>
                            <p className="text-[10px] text-muted-foreground">Management Panel</p>
                        </div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {adminNavItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="h-4.5 w-4.5 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-2 border-t border-border/30 space-y-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all ${collapsed ? 'justify-center' : ''}`}
                    >
                        <ChevronLeft className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>Back to App</span>}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-muted/50"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <h1 className="text-lg font-semibold">
                            {adminNavItems.find(i => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href)))?.label || 'Admin'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg hover:bg-muted/50 relative">
                            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {profile?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-medium">{profile?.name || 'Admin'}</p>
                                <p className="text-[10px] text-muted-foreground">{profile?.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
