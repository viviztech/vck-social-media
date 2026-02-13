'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n';
import {
    Send, Clock, CheckCircle, XCircle, ExternalLink,
    Image as ImageIcon, MoreVertical, FileText,
} from 'lucide-react';
import { useState } from 'react';

export default function PostsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Send className="h-6 w-6 text-primary" />
                        {t('posts.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">{t('posts.subtitle')}</p>
                </div>
                <Button asChild>
                    <a href="/templates"><ImageIcon className="mr-2 h-4 w-4" />{t('nav.create_post')}</a>
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">{t('posts.all_posts')}</TabsTrigger>
                    <TabsTrigger value="published">{t('posts.published')}</TabsTrigger>
                    <TabsTrigger value="scheduled">{t('posts.scheduled')}</TabsTrigger>
                    <TabsTrigger value="draft">{t('posts.drafts')}</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="p-4 rounded-2xl bg-muted mb-4">
                                <Send className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('posts.no_posts')}</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                {t('posts.no_posts_hint')}
                            </p>
                            <Button asChild>
                                <a href="/templates">{t('posts.browse_templates')} <ExternalLink className="ml-2 h-4 w-4" /></a>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
