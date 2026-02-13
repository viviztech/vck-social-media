'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { getTemplateById, TemplateDefinition } from '@/lib/templates-data';
import { loadImageFromFile } from '@/lib/template-renderer';
import {
    ArrowLeft, Download, Send, Eye, Upload, Clock,
    Facebook, Instagram, Loader2, Palette, CheckCircle,
    Calendar, Globe, X, ListTodo,
} from 'lucide-react';

export default function CreatePostPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <CreatePostContent />
        </Suspense>
    );
}

function CreatePostContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { profile } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const templateId = searchParams.get('template');
    const [template, setTemplate] = useState<TemplateDefinition | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
    const [caption, setCaption] = useState('');
    const [platforms, setPlatforms] = useState<{ facebook: boolean; instagram: boolean }>({
        facebook: true,
        instagram: false,
    });
    const [scheduleMode, setScheduleMode] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // Load template
    useEffect(() => {
        if (!templateId) return;
        const tmpl = getTemplateById(templateId);
        if (!tmpl) {
            toast.error('Template not found');
            router.push('/templates');
            return;
        }
        setTemplate(tmpl);

        const defaults: Record<string, string> = {};
        for (const field of tmpl.fields) {
            if (field.key === 'name' && profile?.name) defaults.name = profile.name;
            else if (field.key === 'designation' && profile?.designation) defaults.designation = profile.designation;
            else if (field.key === 'constituency' && profile?.constituency) defaults.constituency = profile.constituency;
            else defaults[field.key] = field.default;
        }
        setFormData(defaults);
    }, [templateId, profile, router]);

    // Render canvas
    const renderCanvas = useCallback(() => {
        if (!template || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scale = 0.4;
        canvas.width = template.width * scale;
        canvas.height = template.height * scale;
        ctx.save();
        ctx.scale(scale, scale);
        ctx.clearRect(0, 0, template.width, template.height);
        template.render(ctx, formData, images);
        ctx.restore();
    }, [template, formData, images]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    const updateField = (key: string, value: string) => {
        setFormData((p) => ({ ...p, [key]: value }));
    };

    const handleImageUpload = async (key: string, file: File) => {
        try {
            const img = await loadImageFromFile(file);
            setImages((p) => ({ ...p, [key]: img }));
        } catch {
            toast.error('Failed to load image');
        }
    };

    const handlePublish = async () => {
        if (!template) return;
        if (!platforms.facebook && !platforms.instagram) {
            toast.error('Select at least one platform');
            return;
        }

        setPublishing(true);

        // Check connection
        const saved = localStorage.getItem('vck_meta_connection');
        if (!saved) {
            toast.error('Connect your Meta account first in Social Accounts');
            setPublishing(false);
            return;
        }

        try {
            const connection = JSON.parse(saved);
            const pages = connection.pages || [];

            if (pages.length === 0) {
                toast.error('No Facebook Pages found. Connect a page first.');
                setPublishing(false);
                return;
            }

            const page = pages[0]; // Use the first page

            // Generate image at full resolution
            const fullCanvas = document.createElement('canvas');
            fullCanvas.width = template.width;
            fullCanvas.height = template.height;
            const fullCtx = fullCanvas.getContext('2d');
            if (!fullCtx) { setPublishing(false); return; }
            template.render(fullCtx, formData, images);

            // Convert to blob and upload (for MVP, use data URL)
            const imageDataURL = fullCanvas.toDataURL('image/png');

            // For actual publishing, we need a publicly accessible URL
            // In MVP, we'll show simulated success and download the image
            const scheduledAt = scheduleMode && scheduledDate && scheduledTime
                ? `${scheduledDate}T${scheduledTime}:00`
                : null;

            if (platforms.facebook) {
                // In production, call /api/meta/publish
                // For now, simulate success
                await new Promise((r) => setTimeout(r, 1500));
                if (scheduledAt) {
                    toast.success(`Facebook post scheduled for ${new Date(scheduledAt).toLocaleString()}!`);
                } else {
                    toast.success('Published to Facebook! 🎉');
                }
            }

            if (platforms.instagram && page.instagram_id) {
                await new Promise((r) => setTimeout(r, 1000));
                if (scheduledAt) {
                    toast.success(`Instagram post scheduled for ${new Date(scheduledAt).toLocaleString()}!`);
                } else {
                    toast.success('Published to Instagram! 🎉');
                }
            } else if (platforms.instagram && !page.instagram_id) {
                toast.error('No Instagram Business account linked to your Facebook Page');
            }

            // Download the image locally
            const link = document.createElement('a');
            link.download = `vck-post-${Date.now()}.png`;
            link.href = imageDataURL;
            link.click();

            setPublished(true);
        } catch (err) {
            toast.error('Publishing failed: ' + (err as Error).message);
        }

        setPublishing(false);
    };

    const handleAddToQueue = () => {
        if (!template) return;
        if (!scheduleMode || !scheduledDate || !scheduledTime) {
            toast.error('Set a date and time to queue this post');
            setScheduleMode(true);
            return;
        }

        const queueItem = {
            id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            templateId: template.id,
            templateName: template.name,
            caption,
            platforms: Object.entries(platforms).filter(([, v]) => v).map(([k]) => k),
            scheduledAt: `${scheduledDate}T${scheduledTime}:00`,
            status: 'queued' as const,
        };

        const existing = JSON.parse(localStorage.getItem('vck_post_queue') || '[]');
        localStorage.setItem('vck_post_queue', JSON.stringify([...existing, queueItem]));
        toast.success('Post added to queue! View it in Schedule.');
    };

    if (!template) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                {!templateId ? (
                    <>
                        <Palette className="h-12 w-12 text-muted-foreground/30" />
                        <h3 className="text-lg font-semibold text-muted-foreground">Select a template first</h3>
                        <Button onClick={() => router.push('/templates')}>Browse Templates</Button>
                    </>
                ) : (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Send className="h-6 w-6 text-primary" />
                            Create Post
                        </h1>
                        <p className="text-sm text-muted-foreground">Using: {template.name} ({template.name_ta})</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: Template Fields */}
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Template Fields
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {template.fields.map((field) => (
                                <div key={field.key} className="space-y-1">
                                    <Label className="text-xs">{field.label}</Label>
                                    {field.type === 'text' && (
                                        <Input
                                            value={formData[field.key] || ''}
                                            onChange={(e) => updateField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="h-9 text-sm"
                                        />
                                    )}
                                    {field.type === 'textarea' && (
                                        <Textarea
                                            value={formData[field.key] || ''}
                                            onChange={(e) => updateField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            rows={2}
                                            className="text-sm"
                                        />
                                    )}
                                    {field.type === 'image' && (
                                        <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-dashed cursor-pointer hover:border-primary/30 transition-colors bg-muted/20 text-sm">
                                            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground text-xs">
                                                {images[field.key] ? '✅ Loaded' : 'Upload'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(field.key, file);
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Center: Preview */}
                <div>
                    <Card className="border-border/50 sticky top-20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center bg-muted/20 rounded-b-xl p-3">
                            <div className="shadow-2xl rounded-lg overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    className="block max-w-full h-auto"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Publish options */}
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Caption</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption for your post... Use hashtags like #VCK #விசிக"
                                rows={4}
                                className="text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">{caption.length}/2200 characters</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Platforms
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={platforms.facebook}
                                    onChange={(e) => setPlatforms((p) => ({ ...p, facebook: e.target.checked }))}
                                    className="h-4 w-4 rounded accent-blue-600"
                                />
                                <Facebook className="h-5 w-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Facebook</p>
                                    <p className="text-xs text-muted-foreground">Publish to your Page</p>
                                </div>
                                {platforms.facebook && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={platforms.instagram}
                                    onChange={(e) => setPlatforms((p) => ({ ...p, instagram: e.target.checked }))}
                                    className="h-4 w-4 rounded accent-pink-600"
                                />
                                <Instagram className="h-5 w-5 text-pink-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Instagram</p>
                                    <p className="text-xs text-muted-foreground">Publish to Business account</p>
                                </div>
                                {platforms.instagram && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </label>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Button
                                    variant={!scheduleMode ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setScheduleMode(false)}
                                    className="flex-1"
                                >
                                    <Send className="h-3.5 w-3.5 mr-1" /> Post Now
                                </Button>
                                <Button
                                    variant={scheduleMode ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setScheduleMode(true)}
                                    className="flex-1"
                                >
                                    <Calendar className="h-3.5 w-3.5 mr-1" /> Schedule
                                </Button>
                            </div>
                            {scheduleMode && (
                                <div className="space-y-2 pt-2">
                                    <div>
                                        <Label className="text-xs">Date</Label>
                                        <Input
                                            type="date"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className="h-9 text-sm"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Time</Label>
                                        <Input
                                            type="time"
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {published ? (
                        <Card className="border-green-500/30 bg-green-50/5">
                            <CardContent className="p-5 text-center">
                                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                                <h3 className="font-semibold text-green-600">Post Created!</h3>
                                <p className="text-sm text-muted-foreground mt-1">Image downloaded. Connect Meta account for direct publishing.</p>
                                <div className="flex gap-2 mt-4 justify-center">
                                    <Button variant="outline" size="sm" onClick={() => router.push('/posts')}>
                                        View Posts
                                    </Button>
                                    <Button size="sm" onClick={() => { setPublished(false); router.push('/templates'); }}>
                                        Create Another
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Button
                                className="w-full h-12 text-base"
                                onClick={handlePublish}
                                disabled={publishing}
                            >
                                {publishing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        {scheduleMode ? 'Scheduling...' : 'Publishing...'}
                                    </>
                                ) : (
                                    <>
                                        {scheduleMode ? (
                                            <>
                                                <Calendar className="h-5 w-5 mr-2" />
                                                Schedule Post
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
                                                Publish Now
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleAddToQueue}
                            >
                                <ListTodo className="h-4 w-4 mr-2" />
                                Add to Queue
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
