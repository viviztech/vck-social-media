'use client';

import { useRef, useEffect, useCallback } from 'react';
import { TemplateDefinition } from './templates-data';

interface UseTemplateRendererProps {
    template: TemplateDefinition | null;
    data: Record<string, string>;
    images: Record<string, HTMLImageElement>;
    scale?: number;
}

export function useTemplateRenderer({ template, data, images, scale = 1 }: UseTemplateRendererProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const render = useCallback(() => {
        if (!template || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = template.width * scale;
        canvas.height = template.height * scale;

        ctx.save();
        ctx.scale(scale, scale);

        // Clear and render
        ctx.clearRect(0, 0, template.width, template.height);
        template.render(ctx, data, images);

        ctx.restore();
    }, [template, data, images, scale]);

    useEffect(() => {
        render();
    }, [render]);

    const downloadImage = useCallback((filename?: string) => {
        if (!canvasRef.current || !template) return;

        // Render at full resolution for download
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = template.width;
        fullCanvas.height = template.height;
        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) return;

        template.render(fullCtx, data, images);

        const link = document.createElement('a');
        link.download = filename || `vck-${template.id}-${Date.now()}.png`;
        link.href = fullCanvas.toDataURL('image/png');
        link.click();
    }, [template, data, images]);

    const getImageDataURL = useCallback((): string | null => {
        if (!canvasRef.current || !template) return null;

        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = template.width;
        fullCanvas.height = template.height;
        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) return null;

        template.render(fullCtx, data, images);
        return fullCanvas.toDataURL('image/png');
    }, [template, data, images]);

    return { canvasRef, render, downloadImage, getImageDataURL };
}

// Utility: load image from URL or file
export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Utility: load image from File object
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
