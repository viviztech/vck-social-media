'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Palette,
    Search,
    Star,
    Sparkles,
    PartyPopper,
    Cake,
    Megaphone,
    Calendar,
    Trophy,
    Heart,
    Newspaper,
    LayoutGrid,
    Eye,
    ArrowRight,
} from 'lucide-react';

interface DemoTemplate {
    id: number;
    name: string;
    category: string;
    aspect: string;
    is_premium: boolean;
    color1: string;
    color2: string;
    icon: string;
    language: string;
}

const DEMO_TEMPLATES: DemoTemplate[] = [
    { id: 1, name: 'Pongal Wishes', category: 'festival', aspect: '1:1', is_premium: false, color1: '#f9a825', color2: '#ff8f00', icon: '🎉', language: 'Tamil' },
    { id: 2, name: 'Republic Day', category: 'festival', aspect: '1:1', is_premium: false, color1: '#1a237e', color2: '#283593', icon: '🇮🇳', language: 'Tamil' },
    { id: 3, name: 'Birthday Greeting', category: 'birthday', aspect: '1:1', is_premium: false, color1: '#e91e63', color2: '#ad1457', icon: '🎂', language: 'Tamil' },
    { id: 4, name: 'Campaign Poster', category: 'campaign', aspect: '4:5', is_premium: true, color1: '#1a237e', color2: '#c62828', icon: '📢', language: 'Tamil' },
    { id: 5, name: 'Party Meeting', category: 'event', aspect: '16:9', is_premium: false, color1: '#1a237e', color2: '#0d47a1', icon: '📋', language: 'Tamil' },
    { id: 6, name: 'Achievement Post', category: 'achievement', aspect: '1:1', is_premium: true, color1: '#f57f17', color2: '#e65100', icon: '🏆', language: 'Tamil' },
    { id: 7, name: 'Condolence Message', category: 'condolence', aspect: '1:1', is_premium: false, color1: '#37474f', color2: '#263238', icon: '🕯️', language: 'Tamil' },
    { id: 8, name: 'Announcement Banner', category: 'announcement', aspect: '16:9', is_premium: false, color1: '#1a237e', color2: '#c62828', icon: '📰', language: 'Tamil' },
    { id: 9, name: 'Thiruvalluvar Day', category: 'festival', aspect: '1:1', is_premium: false, color1: '#4527a0', color2: '#6a1b9a', icon: '📖', language: 'Tamil' },
    { id: 10, name: 'Women\'s Day', category: 'festival', aspect: '1:1', is_premium: false, color1: '#880e4f', color2: '#c2185b', icon: '💪', language: 'Tamil' },
    { id: 11, name: 'Election Campaign', category: 'campaign', aspect: '9:16', is_premium: true, color1: '#1a237e', color2: '#c62828', icon: '🗳️', language: 'Tamil' },
    { id: 12, name: 'Youth Rally', category: 'event', aspect: '4:5', is_premium: false, color1: '#0d47a1', color2: '#1565c0', icon: '✊', language: 'Tamil' },
];

const categories = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'festival', label: 'Festival', icon: PartyPopper },
    { id: 'birthday', label: 'Birthday', icon: Cake },
    { id: 'campaign', label: 'Campaign', icon: Megaphone },
    { id: 'event', label: 'Event', icon: Calendar },
    { id: 'achievement', label: 'Achievement', icon: Trophy },
    { id: 'condolence', label: 'Condolence', icon: Heart },
    { id: 'announcement', label: 'News', icon: Newspaper },
];

export default function TemplatesPage() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered = DEMO_TEMPLATES.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Palette className="h-6 w-6 text-primary" />
                        Template Gallery
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Choose a party-branded template and create your post in seconds.
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={activeCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveCategory(cat.id)}
                        className="shrink-0"
                    >
                        <cat.icon className="h-4 w-4 mr-1.5" />
                        {cat.label}
                    </Button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((template) => (
                    <Card
                        key={template.id}
                        className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                        <div
                            className="relative aspect-square flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${template.color1}, ${template.color2})`,
                            }}
                        >
                            {/* Template Preview */}
                            <div className="text-center text-white p-6">
                                <div className="text-5xl mb-3">{template.icon}</div>
                                <h4 className="text-lg font-bold mb-1">{template.name}</h4>
                                <div className="w-16 h-0.5 bg-white/40 mx-auto mb-2" />
                                <p className="text-white/70 text-sm">விடுதலை சிறுத்தைகள் கட்சி</p>
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40" />
                                    <div className="text-left">
                                        <p className="text-xs font-semibold">Your Name</p>
                                        <p className="text-[10px] text-white/60">Designation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="shadow-xl">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Preview
                                    </Button>
                                    <Button size="sm" className="shadow-xl">
                                        Use
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-1.5">
                                {template.is_premium && (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs shadow-lg">
                                        <Star className="h-3 w-3 mr-1" /> Premium
                                    </Badge>
                                )}
                            </div>
                            <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="text-xs bg-black/30 text-white border-0 backdrop-blur-sm">
                                    {template.aspect}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm">{template.name}</h4>
                                    <p className="text-xs text-muted-foreground capitalize">{template.category} • {template.language}</p>
                                </div>
                                <Sparkles className="h-4 w-4 text-primary/50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <Palette className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">No templates found</h3>
                    <p className="text-sm text-muted-foreground/70">Try a different search or category</p>
                </div>
            )}
        </div>
    );
}
