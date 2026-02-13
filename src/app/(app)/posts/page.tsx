'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Send, Clock, CheckCircle, XCircle, ExternalLink,
    Image as ImageIcon, MoreVertical, FileText,
} from 'lucide-react';
import { useState } from 'react';

export default function PostsPage() {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Send className="h-6 w-6 text-primary" />
                        My Posts
                    </h1>
                    <p className="text-muted-foreground mt-1">Track all your social media posts.</p>
                </div>
                <Button asChild>
                    <a href="/templates"><ImageIcon className="mr-2 h-4 w-4" />Create Post</a>
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="p-4 rounded-2xl bg-muted mb-4">
                                <Send className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Create your first post by selecting a template and customizing it with your details.
                            </p>
                            <Button asChild>
                                <a href="/templates">Browse Templates <ExternalLink className="ml-2 h-4 w-4" /></a>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
