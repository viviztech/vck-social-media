'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
    Settings, Globe, Bell, Shield, Palette,
    Save, RefreshCw, Key, Mail, Smartphone,
    Database, Upload, Download, AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'api' | 'notifications' | 'security'>('general');

    const tabs = [
        { id: 'general' as const, label: 'General', icon: Settings },
        { id: 'api' as const, label: 'API Keys', icon: Key },
        { id: 'notifications' as const, label: 'Notifications', icon: Bell },
        { id: 'security' as const, label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your admin panel configuration</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-sm">Application Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">App Name</Label>
                                    <Input placeholder="VCK Social Media" defaultValue="VCK Social Media" className="text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Support Email</Label>
                                    <Input placeholder="support@vck.org" defaultValue="support@vck.org" className="text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Default Language</Label>
                                    <select className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm">
                                        <option value="ta">தமிழ் (Tamil)</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Posts per Page</Label>
                                    <Input type="number" defaultValue="20" className="text-sm" />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label className="text-xs">Party Logo URL</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="https://..." className="text-sm flex-1" />
                                    <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1" /> Upload</Button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm"><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-sm">Content Moderation</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Require Approval</p>
                                    <p className="text-xs text-muted-foreground">New posts need admin approval before publishing</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4 rounded" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Auto-flag Sensitive Content</p>
                                    <p className="text-xs text-muted-foreground">Automatically flag posts with sensitive keywords</p>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Allow Member Scheduling</p>
                                    <p className="text-xs text-muted-foreground">Let regular members schedule posts</p>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-sm">Supabase Configuration</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Supabase URL</Label>
                                <Input type="password" placeholder="https://xxxx.supabase.co" className="text-sm font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Anon Key</Label>
                                <Input type="password" placeholder="eyJ..." className="text-sm font-mono" />
                            </div>
                            <Badge className="bg-green-500/10 text-green-600 text-[10px]">Connected</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-sm">Meta API (Facebook / Instagram)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">App ID</Label>
                                    <Input type="password" placeholder="123456789" className="text-sm font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">App Secret</Label>
                                    <Input type="password" placeholder="abc..." className="text-sm font-mono" />
                                </div>
                            </div>
                            <Badge className="bg-yellow-500/10 text-yellow-600 text-[10px]">Not Configured</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-sm">Razorpay (Payments)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Key ID</Label>
                                    <Input type="password" placeholder="rzp_live_..." className="text-sm font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Key Secret</Label>
                                    <Input type="password" placeholder="..." className="text-sm font-mono" />
                                </div>
                            </div>
                            <Badge className="bg-yellow-500/10 text-yellow-600 text-[10px]">Not Configured</Badge>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button size="sm"><Save className="h-4 w-4 mr-1" /> Save API Keys</Button>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <Card className="border-border/50">
                    <CardHeader><CardTitle className="text-sm">Notification Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { label: 'New User Registration', desc: 'Get notified when a new user signs up', checked: true },
                            { label: 'New Subscription', desc: 'Get notified about new plan purchases', checked: true },
                            { label: 'Failed Payments', desc: 'Alert when payment fails', checked: true },
                            { label: 'Flagged Content', desc: 'Get notified about flagged posts', checked: true },
                            { label: 'Daily Summary', desc: 'Receive daily stats summary email', checked: false },
                            { label: 'Weekly Report', desc: 'Receive weekly analytics report', checked: true },
                        ].map((n, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <p className="text-sm font-medium">{n.label}</p>
                                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                                    </div>
                                    <input type="checkbox" defaultChecked={n.checked} className="h-4 w-4 rounded" />
                                </div>
                                {i < 5 && <Separator className="mt-3" />}
                            </div>
                        ))}
                        <div className="flex justify-end pt-2">
                            <Button size="sm"><Save className="h-4 w-4 mr-1" /> Save Preferences</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-sm">Access Control</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                                    <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">IP Whitelist</p>
                                    <p className="text-xs text-muted-foreground">Restrict admin access to specific IPs</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4 rounded" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Session Timeout</p>
                                    <p className="text-xs text-muted-foreground">Auto-logout inactive admins</p>
                                </div>
                                <select className="h-8 rounded-lg border border-border bg-background px-2 text-xs">
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>4 hours</option>
                                    <option>24 hours</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 border-red-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 text-red-500">
                                <AlertTriangle className="h-4 w-4" />
                                Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Export All Data</p>
                                    <p className="text-xs text-muted-foreground">Download all users, posts, and subscription data</p>
                                </div>
                                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Reset Statistics</p>
                                    <p className="text-xs text-muted-foreground">Clear all analytics data (irreversible)</p>
                                </div>
                                <Button variant="destructive" size="sm"><RefreshCw className="h-4 w-4 mr-1" /> Reset</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
