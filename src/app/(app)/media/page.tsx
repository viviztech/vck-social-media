'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n';
import {
    Upload,
    Image,
    Trash2,
    Plus,
    FileImage,
    Eye,
    X,
    CloudUpload,
} from 'lucide-react';

interface MediaFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    createdAt: Date;
}

export default function MediaPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const handleFiles = useCallback((fileList: FileList) => {
        const newFiles: MediaFile[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 10MB)`);
                continue;
            }
            const url = URL.createObjectURL(file);
            newFiles.push({
                id: crypto.randomUUID(),
                name: file.name,
                size: file.size,
                type: file.type,
                url,
                createdAt: new Date(),
            });
        }
        if (newFiles.length > 0) {
            setFiles((prev) => [...newFiles, ...prev]);
            toast.success(`${newFiles.length} file(s) added`);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const file = prev.find((f) => f.id === id);
            if (file) URL.revokeObjectURL(file.url);
            return prev.filter((f) => f.id !== id);
        });
        toast.success('File removed');
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Image className="h-6 w-6 text-primary" />
                        {t('media.title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('media.subtitle')}
                    </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('media.upload')}
                </Button>
            </div>

            {/* Upload Zone */}
            <Card
                className={`border-2 border-dashed transition-all cursor-pointer ${dragActive
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border/50 hover:border-primary/30'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className={`p-4 rounded-2xl mb-4 transition-colors ${dragActive ? 'bg-primary/10' : 'bg-muted'}`}>
                        <CloudUpload className={`h-10 w-10 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                        {dragActive ? 'Drop your files here!' : 'Drag & drop photos here'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        or click to browse • PNG, JPG up to 10MB each
                    </p>
                    <Badge variant="secondary">
                        <Upload className="h-3 w-3 mr-1" />
                        Supports multiple files
                    </Badge>
                </CardContent>
            </Card>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
            />

            {/* File Grid */}
            {files.length > 0 && (
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <FileImage className="h-5 w-5 text-primary" />
                                Uploaded Photos ({files.length})
                            </span>
                        </CardTitle>
                        <CardDescription>These photos will be available when creating templates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
                                >
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 inset-x-0 p-2">
                                            <p className="text-white text-xs truncate font-medium">{file.name}</p>
                                            <p className="text-white/60 text-xs">{formatSize(file.size)}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                                                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-colors"
                                                aria-label="Preview"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                                className="p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500/80 backdrop-blur-sm text-white transition-colors"
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {files.length === 0 && (
                <div className="text-center py-12">
                    <Image className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-1">{t('media.no_media')}</h3>
                    <p className="text-sm text-muted-foreground/70">{t('media.no_media_hint')}</p>
                </div>
            )}

            {/* Preview Modal */}
            {previewFile && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setPreviewFile(null)}
                >
                    <div className="relative max-w-3xl max-h-[90vh]">
                        <button
                            onClick={() => setPreviewFile(null)}
                            className="absolute -top-3 -right-3 p-2 rounded-full bg-white text-black shadow-xl hover:bg-gray-100 z-10"
                            aria-label="Close preview"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <img
                            src={previewFile.url}
                            alt={previewFile.name}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="mt-3 text-center">
                            <p className="text-white text-sm font-medium">{previewFile.name}</p>
                            <p className="text-white/50 text-xs">{formatSize(previewFile.size)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
