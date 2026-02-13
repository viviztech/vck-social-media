'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    ArrowLeft, Download, Share2, Send, Eye, Upload,
    Loader2, Palette, RotateCcw, Smartphone, Monitor, Square,
} from 'lucide-react';

export default function TemplateEditor() {
    const params = useParams();
    const router = useRouter();
    const { profile } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [template, setTemplate] = useState<TemplateDefinition | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
    const [previewScale, setPreviewScale] = useState(0.5);
    const [downloading, setDownloading] = useState(false);

    // Load template
    useEffect(() => {
        const id = params.id as string;
        const tmpl = getTemplateById(id);
        if (!tmpl) {
            toast.error('Template not found');
            router.push('/templates');
            return;
        }
        setTemplate(tmpl);

        // Pre-fill from profile
        const defaults: Record<string, string> = {};
        for (const field of tmpl.fields) {
            if (field.key === 'name' && profile?.name) defaults.name = profile.name;
            else if (field.key === 'designation' && profile?.designation) defaults.designation = profile.designation;
            else if (field.key === 'constituency' && profile?.constituency) defaults.constituency = profile.constituency;
            else defaults[field.key] = field.default;
        }
        setFormData(defaults);
    }, [params.id, profile, router]);

    // Render canvas
    const renderCanvas = useCallback(() => {
        if (!template || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = template.width * previewScale;
        canvas.height = template.height * previewScale;

        ctx.save();
        ctx.scale(previewScale, previewScale);
        ctx.clearRect(0, 0, template.width, template.height);
        template.render(ctx, formData, images);
        ctx.restore();
    }, [template, formData, images, previewScale]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    const updateField = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = async (key: string, file: File) => {
        try {
            const img = await loadImageFromFile(file);
            setImages((prev) => ({ ...prev, [key]: img }));
            toast.success('Photo loaded!');
        } catch {
            toast.error('Failed to load image');
        }
    };

    const handleDownload = () => {
        if (!template) return;
        setDownloading(true);

        // Render at full resolution
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = template.width;
        fullCanvas.height = template.height;
        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) { setDownloading(false); return; }

        template.render(fullCtx, formData, images);

        const link = document.createElement('a');
        link.download = `vck-${template.id}-${Date.now()}.png`;
        link.href = fullCanvas.toDataURL('image/png');
        link.click();

        setDownloading(false);
        toast.success('Image downloaded!');
    };

    const handleReset = () => {
        if (!template) return;
        const defaults: Record<string, string> = {};
        for (const field of template.fields) {
            if (field.key === 'name' && profile?.name) defaults.name = profile.name;
            else if (field.key === 'designation' && profile?.designation) defaults.designation = profile.designation;
            else defaults[field.key] = field.default;
        }
        setFormData(defaults);
        setImages({});
        toast.info('Fields reset');
    };

    if (!template) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/templates')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Palette className="h-6 w-6 text-primary" />
                            {template.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">{template.name_ta} • {template.aspect_ratio}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-1" /> Reset
                    </Button>
                    <Button size="sm" onClick={handleDownload} disabled={downloading}>
                        {downloading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                        Download
                    </Button>
                </div>
            </div>

            {/* Editor Layout */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Left: Form Fields */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Customize Your Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {template.fields.map((field) => (
                                <div key={field.key} className="space-y-1.5">
                                    <Label htmlFor={`field-${field.key}`} className="text-sm">{field.label}</Label>
                                    {field.type === 'text' && (
                                        <Input
                                            id={`field-${field.key}`}
                                            value={formData[field.key] || ''}
                                            onChange={(e) => updateField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                    {field.type === 'textarea' && (
                                        <Textarea
                                            id={`field-${field.key}`}
                                            value={formData[field.key] || ''}
                                            onChange={(e) => updateField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            rows={3}
                                        />
                                    )}
                                    {field.type === 'image' && (
                                        <div>
                                            <label
                                                htmlFor={`file-${field.key}`}
                                                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border/50 hover:border-primary/30 cursor-pointer transition-colors bg-muted/30"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                                                    {images[field.key] ? '✅ Photo loaded — click to change' : 'Upload photo'}
                                                </span>
                                            </label>
                                            <input
                                                id={`file-${field.key}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(field.key, file);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-border/50">
                        <CardContent className="p-4 space-y-3">
                            <Button className="w-full" onClick={handleDownload} disabled={downloading}>
                                <Download className="h-4 w-4 mr-2" />
                                Download Image (PNG)
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => toast.info('Social media posting coming in Phase 3!')}>
                                <Send className="h-4 w-4 mr-2" />
                                Post to Social Media
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => {
                                if (!template) return;
                                const fullCanvas = document.createElement('canvas');
                                fullCanvas.width = template.width;
                                fullCanvas.height = template.height;
                                const fullCtx = fullCanvas.getContext('2d');
                                if (!fullCtx) return;
                                template.render(fullCtx, formData, images);
                                fullCanvas.toBlob((blob) => {
                                    if (!blob) return;
                                    const item = new ClipboardItem({ 'image/png': blob });
                                    navigator.clipboard.write([item]).then(() => {
                                        toast.success('Image copied to clipboard!');
                                    }).catch(() => {
                                        toast.error('Copy failed — try downloading instead');
                                    });
                                });
                            }}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Copy to Clipboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Live Preview */}
                <div className="lg:col-span-3">
                    <Card className="border-border/50 sticky top-20">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                Live Preview
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant={previewScale === 0.35 ? 'default' : 'ghost'}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setPreviewScale(0.35)}
                                    title="Mobile preview"
                                >
                                    <Smartphone className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant={previewScale === 0.5 ? 'default' : 'ghost'}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setPreviewScale(0.5)}
                                    title="Desktop preview"
                                >
                                    <Monitor className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant={previewScale === 1 ? 'default' : 'ghost'}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setPreviewScale(1)}
                                    title="Full size"
                                >
                                    <Square className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center overflow-auto p-4 bg-muted/20 rounded-b-xl">
                            <div className="inline-block shadow-2xl rounded-lg overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    className="block max-w-full h-auto"
                                    style={{
                                        width: template.width * previewScale,
                                        height: template.height * previewScale,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
