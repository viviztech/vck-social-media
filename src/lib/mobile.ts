// ============================================
// VCK Social Media — Mobile Platform Utilities
// ============================================
// Client-side utilities for Capacitor native features

import { Capacitor } from '@capacitor/core';

// Check if running as native mobile app
export function isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
}

// Get current platform
export function getPlatform(): 'ios' | 'android' | 'web' {
    return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
}

// Initialize mobile-specific features
export async function initMobileApp() {
    if (!isNativePlatform()) return;

    try {
        // Status bar
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#1a237e' });

        // Hide splash after everything loads
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide();
    } catch (err) {
        console.warn('Mobile init error:', err);
    }
}

// Share content (image + text) via native share
export async function sharePost(title: string, text: string, imageDataUrl?: string) {
    if (!isNativePlatform()) {
        // Web fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(text);
            return { shared: true, method: 'clipboard' };
        } catch {
            return { shared: false };
        }
    }

    try {
        const { Share } = await import('@capacitor/share');

        if (imageDataUrl) {
            // Save image to temp file first
            const { Filesystem, Directory } = await import('@capacitor/filesystem');
            const base64Data = imageDataUrl.split(',')[1];
            const fileName = `vck-post-${Date.now()}.png`;

            const savedFile = await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Cache,
            });

            await Share.share({
                title,
                text,
                url: savedFile.uri,
                dialogTitle: 'Share VCK Post',
            });
        } else {
            await Share.share({
                title,
                text,
                dialogTitle: 'Share VCK Post',
            });
        }

        return { shared: true, method: 'native' };
    } catch (err) {
        console.warn('Share error:', err);
        return { shared: false };
    }
}

// Save image to device gallery
export async function saveToGallery(imageDataUrl: string, fileName?: string) {
    if (!isNativePlatform()) {
        // Web fallback: download
        const link = document.createElement('a');
        link.download = fileName || `vck-post-${Date.now()}.png`;
        link.href = imageDataUrl;
        link.click();
        return true;
    }

    try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const base64Data = imageDataUrl.split(',')[1];
        const name = fileName || `vck-post-${Date.now()}.png`;

        await Filesystem.writeFile({
            path: `Pictures/${name}`,
            data: base64Data,
            directory: Directory.Documents,
            recursive: true,
        });

        return true;
    } catch (err) {
        console.warn('Save error:', err);
        return false;
    }
}

// Pick image from camera or gallery
export async function pickImage(source: 'camera' | 'gallery' = 'gallery'): Promise<string | null> {
    if (!isNativePlatform()) {
        // Web fallback: file input
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            if (source === 'camera') input.capture = 'environment';
            input.onchange = () => {
                const file = input.files?.[0];
                if (!file) { resolve(null); return; }
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            };
            input.click();
        });
    }

    try {
        const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

        const photo = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
        });

        return photo.dataUrl || null;
    } catch (err) {
        console.warn('Camera error:', err);
        return null;
    }
}

// API base URL — for mobile, calls go to remote backend
export function getApiBaseUrl(): string {
    if (isNativePlatform()) {
        // In production, point to your deployed backend
        return process.env.NEXT_PUBLIC_API_URL || 'https://vck-social.vercel.app';
    }
    // On web, use relative URLs (same origin)
    return '';
}
