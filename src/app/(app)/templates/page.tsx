'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TEMPLATES } from '@/lib/templates-data';
import { useTranslation } from '@/lib/i18n';
import {
    Palette, Search, Star, Sparkles, PartyPopper, Cake,
    Megaphone, Calendar, Trophy, Heart, Newspaper,
    LayoutGrid, ArrowRight, Eye,
} from 'lucide-react';

// Mini canvas thumbnail renderer
function TemplateThumb({ template }: { template: typeof TEMPLATES[0] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const scale = 250 / template.width;
        canvas.width = 250;
        canvas.height = template.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.save();
        ctx.scale(scale, scale);
        template.render(ctx, {
            name: 'Your Name',
            designation: 'Designation',
            festival: template.fields.find(f => f.key === 'festival')?.default || '',
            message: template.fields.find(f => f.key === 'message')?.default || '',
            birthday_person: 'Friend',
            slogan: template.fields.find(f => f.key === 'slogan')?.default || '',
            title: template.fields.find(f => f.key === 'title')?.default || template.name_ta,
            date: '01/01/2026',
            venue: 'Chennai',
            achievement: 'Achievement details',
            deceased: 'Name',
            subtitle: 'Subtitle',
            details: 'Details here',
            constituency: 'Constituency',
        }, {});
        ctx.restore();
    }, [template]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
        />
    );
}

export default function TemplatesPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: t('common.all'), icon: LayoutGrid },
        { id: 'festival', label: t('templates.festival'), icon: PartyPopper },
        { id: 'birthday', label: t('templates.birthday'), icon: Cake },
        { id: 'campaign', label: t('templates.campaign'), icon: Megaphone },
        { id: 'event', label: t('templates.event'), icon: Calendar },
        { id: 'achievement', label: t('templates.achievement'), icon: Trophy },
        { id: 'condolence', label: t('templates.condolence'), icon: Heart },
        { id: 'announcement', label: t('templates.announcement'), icon: Newspaper },
        { id: 'general', label: t('templates.general'), icon: Sparkles },
    ];

    const categoryColors: Record<string, [string, string]> = {
        festival: ['#f9a825', '#ff8f00'],
        birthday: ['#e91e63', '#880e4f'],
        campaign: ['#1a237e', '#c62828'],
        event: ['#1a237e', '#0d47a1'],
        achievement: ['#0d47a1', '#004d40'],
        condolence: ['#1a1a2e', '#16213e'],
        announcement: ['#1a237e', '#c62828'],
        general: ['#1a237e', '#283593'],
    };

    const filtered = TEMPLATES.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.name_ta.includes(search);
        const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Palette className="h-6 w-6 text-primary" />
                    {t('templates.title')}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t('templates.subtitle')}
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('templates.search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
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
                        onClick={() => router.push(`/templates/${template.id}`)}
                    >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                            <TemplateThumb template={template} />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-2">
                                    <Button size="sm" className="shadow-xl">
                                        <Palette className="h-4 w-4 mr-1" />
                                        {t('templates.customize')}
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-1.5">
                                {template.is_premium && (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs shadow-lg">
                                        <Star className="h-3 w-3 mr-1" /> {t('common.premium')}
                                    </Badge>
                                )}
                            </div>
                            <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="text-xs bg-black/30 text-white border-0 backdrop-blur-sm">
                                    {template.aspect_ratio}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm">{template.name}</h4>
                                    <p className="text-xs text-muted-foreground">{template.name_ta} • {template.category}</p>
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
                    <h3 className="text-lg font-semibold text-muted-foreground">{t('templates.no_templates')}</h3>
                    <p className="text-sm text-muted-foreground/70">{t('templates.no_templates_hint')}</p>
                </div>
            )}
        </div>
    );
}
