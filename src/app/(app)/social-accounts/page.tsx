'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getMetaOAuthURL } from '@/lib/meta-api';
import {
    Link2, Unlink, Facebook, Instagram, Shield,
    CheckCircle, XCircle, RefreshCw, ExternalLink, Globe,
    AlertTriangle, Loader2,
} from 'lucide-react';

interface ConnectedPage {
    id: string;
    name: string;
    access_token: string;
    category: string;
    instagram_id: string | null;
}

interface ConnectionData {
    user_token: string;
    expires_in: number;
    meta_user_id: string;
    meta_user_name: string;
    pages: ConnectedPage[];
}

export default function SocialAccountsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <SocialAccountsContent />
        </Suspense>
    );
}

function SocialAccountsContent() {
    const searchParams = useSearchParams();
    const [connection, setConnection] = useState<ConnectionData | null>(null);
    const [connecting, setConnecting] = useState(false);

    // Load saved connection from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('vck_meta_connection');
        if (saved) {
            try {
                setConnection(JSON.parse(saved));
            } catch { /* ignore */ }
        }
    }, []);

    // Handle OAuth callback data
    useEffect(() => {
        const connected = searchParams.get('connected');
        const data = searchParams.get('data');
        const error = searchParams.get('error');

        if (error) {
            toast.error(`Connection failed: ${error}`);
            return;
        }

        if (connected === 'true' && data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(data));
                setConnection(parsed);
                localStorage.setItem('vck_meta_connection', JSON.stringify(parsed));
                toast.success('Meta account connected successfully!');
                // Clean URL
                window.history.replaceState({}, '', '/social-accounts');
            } catch {
                toast.error('Failed to process connection data');
            }
        }
    }, [searchParams]);

    const handleConnect = () => {
        setConnecting(true);
        const appId = process.env.NEXT_PUBLIC_META_APP_ID;
        if (!appId) {
            toast.error('Meta App ID not configured. Add NEXT_PUBLIC_META_APP_ID to .env.local');
            setConnecting(false);
            return;
        }
        window.location.href = getMetaOAuthURL();
    };

    const handleDisconnect = () => {
        setConnection(null);
        localStorage.removeItem('vck_meta_connection');
        toast.success('Meta account disconnected');
    };

    const isConnected = !!connection;
    const fbPages = connection?.pages || [];
    const igAccounts = fbPages.filter((p) => p.instagram_id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    Social Accounts
                </h1>
                <p className="text-muted-foreground mt-1">
                    Connect your Facebook and Instagram accounts to publish posts directly.
                </p>
            </div>

            {/* Connection Status */}
            <Card className={`border-2 transition-colors ${isConnected ? 'border-green-500/30 bg-green-50/5' : 'border-border/50'}`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-500/10' : 'bg-muted'}`}>
                                {isConnected ? (
                                    <CheckCircle className="h-7 w-7 text-green-500" />
                                ) : (
                                    <XCircle className="h-7 w-7 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {isConnected ? `Connected as ${connection.meta_user_name}` : 'Not Connected'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isConnected
                                        ? `${fbPages.length} page(s) • ${igAccounts.length} Instagram account(s)`
                                        : 'Connect your Meta account to start publishing'}
                                </p>
                            </div>
                        </div>
                        <div>
                            {isConnected ? (
                                <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                                    <Unlink className="h-4 w-4 mr-1.5" />
                                    Disconnect
                                </Button>
                            ) : (
                                <Button onClick={handleConnect} disabled={connecting}>
                                    <Link2 className="h-4 w-4 mr-1.5" />
                                    {connecting ? 'Connecting...' : 'Connect with Meta'}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* How it works */}
            {!isConnected && (
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            How it works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    step: '1',
                                    title: 'Connect',
                                    desc: 'Click "Connect with Meta" and log in to your Facebook account.',
                                },
                                {
                                    step: '2',
                                    title: 'Select Pages',
                                    desc: 'Choose which Facebook Pages and Instagram accounts to connect.',
                                },
                                {
                                    step: '3',
                                    title: 'Publish',
                                    desc: 'Create posts using templates and publish directly to your accounts.',
                                },
                            ].map((item) => (
                                <div key={item.step} className="text-center p-4 rounded-lg bg-muted/30">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">
                                        {item.step}
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                <strong>Note:</strong> You need a Facebook Page to publish posts. Personal profiles are not supported by Meta&apos;s API. If you don&apos;t have a Page, create one at{' '}
                                <a href="https://www.facebook.com/pages/create" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                    facebook.com/pages/create
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Connected Pages */}
            {isConnected && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {fbPages.map((page) => (
                            <Card key={page.id} className="border-border/50">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Facebook className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold truncate">{page.name}</h4>
                                            <p className="text-xs text-muted-foreground mb-2">{page.category}</p>
                                            <div className="flex gap-2">
                                                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                                                    <Facebook className="h-3 w-3 mr-1" /> Facebook
                                                </Badge>
                                                {page.instagram_id && (
                                                    <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20">
                                                        <Instagram className="h-3 w-3 mr-1" /> Instagram
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-green-600 bg-green-500/10 shrink-0">
                                            <CheckCircle className="h-3 w-3 mr-1" />Active
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={handleConnect}>
                            <RefreshCw className="h-4 w-4 mr-1.5" />
                            Reconnect
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open('https://www.facebook.com/settings?tab=business_tools', '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-1.5" />
                            Manage Permissions
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
