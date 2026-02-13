'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search, FileText, CheckCircle, XCircle, Clock,
    Eye, Trash2, Flag, Filter, Image,
    Facebook, Instagram, Calendar, MessageSquare,
} from 'lucide-react';

// Mock posts data
const mockPosts = [
    { id: '1', user: 'Muthu Kumar', template: 'Festival Greeting', caption: 'Happy Pongal to everyone! Let\'s celebrate our Tamil heritage together. 🎉 #Pongal2026 #VCK', platforms: ['facebook', 'instagram'], status: 'published', scheduled: null, created: '2026-02-13 18:30', image: '🖼️' },
    { id: '2', user: 'Priya Lakshmi', template: 'Campaign Poster', caption: 'Join us for the rally this Sunday at Marina Beach. Together we stand for justice! #VCK #Rally', platforms: ['facebook'], status: 'published', scheduled: null, created: '2026-02-13 16:15', image: '🖼️' },
    { id: '3', user: 'Karthik Raja', template: 'Birthday Greeting', caption: 'Happy birthday to our beloved leader! Wishing you many more years of service.', platforms: ['instagram'], status: 'scheduled', scheduled: '2026-02-14 09:00', created: '2026-02-13 14:00', image: '🖼️' },
    { id: '4', user: 'Senthil Vel', template: 'Event Announcement', caption: 'District meeting this Friday at 6 PM. All coordinators must attend. Important party decisions ahead.', platforms: ['facebook', 'instagram'], status: 'draft', scheduled: null, created: '2026-02-13 12:00', image: '🖼️' },
    { id: '5', user: 'Kavitha Rajan', template: 'Achievement Post', caption: 'Proud moment! Our ward won the cleanest ward award for the 3rd consecutive year.', platforms: ['facebook'], status: 'flagged', scheduled: null, created: '2026-02-13 10:30', image: '🖼️' },
    { id: '6', user: 'Deepa Sundar', template: 'Condolence Message', caption: 'We express our deepest condolences for the loss. May the soul rest in peace.', platforms: ['facebook', 'instagram'], status: 'published', scheduled: null, created: '2026-02-12 20:00', image: '🖼️' },
    { id: '7', user: 'Manoj Kumar', template: 'Announcement Banner', caption: 'New welfare scheme announced! Register now at your nearest VCK office.', platforms: ['facebook'], status: 'pending', scheduled: null, created: '2026-02-12 15:00', image: '🖼️' },
    { id: '8', user: 'Revathi Devi', template: 'Story Template', caption: 'Daily update from the constituency office. We are here to serve you!', platforms: ['instagram'], status: 'rejected', scheduled: null, created: '2026-02-12 11:00', image: '🖼️' },
];

export default function ContentPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [platformFilter, setPlatformFilter] = useState<string>('all');

    const filteredPosts = mockPosts.filter(p => {
        const matchSearch = !search ||
            p.user.toLowerCase().includes(search.toLowerCase()) ||
            p.caption.toLowerCase().includes(search.toLowerCase()) ||
            p.template.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || p.platforms.includes(platformFilter);
        return matchSearch && matchStatus && matchPlatform;
    });

    const stats = {
        total: mockPosts.length,
        published: mockPosts.filter(p => p.status === 'published').length,
        scheduled: mockPosts.filter(p => p.status === 'scheduled').length,
        flagged: mockPosts.filter(p => p.status === 'flagged' || p.status === 'pending').length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published': return <Badge className="bg-green-500/10 text-green-600 text-[10px]"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
            case 'scheduled': return <Badge className="bg-blue-500/10 text-blue-600 text-[10px]"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
            case 'draft': return <Badge className="bg-gray-500/10 text-gray-600 text-[10px]">Draft</Badge>;
            case 'flagged': return <Badge className="bg-orange-500/10 text-orange-600 text-[10px]"><Flag className="h-3 w-3 mr-1" />Flagged</Badge>;
            case 'pending': return <Badge className="bg-yellow-500/10 text-yellow-600 text-[10px]"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case 'rejected': return <Badge className="bg-red-500/10 text-red-600 text-[10px]"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-4">
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Posts</p></div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div><p className="text-xl font-bold">{stats.published}</p><p className="text-xs text-muted-foreground">Published</p></div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div><p className="text-xl font-bold">{stats.scheduled}</p><p className="text-xs text-muted-foreground">Scheduled</p></div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Flag className="h-5 w-5 text-orange-500" />
                        <div><p className="text-xl font-bold">{stats.flagged}</p><p className="text-xs text-muted-foreground">Needs Review</p></div>
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
                                placeholder="Search posts by user, caption, or template..."
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
                            <option value="published">Published</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="flagged">Flagged</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                        >
                            <option value="all">All Platforms</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-3">
                {filteredPosts.map((post) => (
                    <Card key={post.id} className="border-border/50 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Image Preview */}
                                <div className="h-20 w-20 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center shrink-0 text-3xl">
                                    {post.image}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium">{post.user}</p>
                                            <p className="text-xs text-muted-foreground">{post.template} • {post.created}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {getStatusBadge(post.status)}
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {post.platforms.includes('facebook') && (
                                                <Badge variant="outline" className="text-[10px] gap-1">
                                                    <Facebook className="h-3 w-3 text-blue-600" /> Facebook
                                                </Badge>
                                            )}
                                            {post.platforms.includes('instagram') && (
                                                <Badge variant="outline" className="text-[10px] gap-1">
                                                    <Instagram className="h-3 w-3 text-pink-600" /> Instagram
                                                </Badge>
                                            )}
                                            {post.scheduled && (
                                                <Badge variant="outline" className="text-[10px] gap-1">
                                                    <Calendar className="h-3 w-3" /> {post.scheduled}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                <Eye className="h-3 w-3 mr-1" /> View
                                            </Button>
                                            {(post.status === 'pending' || post.status === 'flagged') && (
                                                <>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600">
                                                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600">
                                                        <XCircle className="h-3 w-3 mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <Card className="border-border/50">
                    <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-lg font-medium">No posts found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
