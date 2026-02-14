// ============================================
// VCK Social Media — WhatsApp Sharing Utilities
// ============================================

import { isNativePlatform } from './mobile';

/**
 * Generate a formatted WhatsApp caption from post data
 */
export function generateWhatsAppCaption(
    caption: string,
    templateName?: string,
): string {
    const lines: string[] = [];

    if (caption) {
        lines.push(caption);
    }

    lines.push('');
    lines.push('📱 Created with VCK Social Media');
    if (templateName) {
        lines.push(`🎨 Template: ${templateName}`);
    }
    lines.push('#VCK #விசிக #ViduthalaChiruthaigalKatchi');

    return lines.join('\n');
}

/**
 * Share text + optional image to WhatsApp on web (opens wa.me deeplink)
 */
export function shareToWhatsAppWeb(text: string): void {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

/**
 * Share text + optional image to WhatsApp on mobile via native share
 * Uses Capacitor Share plugin with direct WhatsApp package intent on Android
 */
export async function shareToWhatsAppMobile(
    text: string,
    imageDataUrl?: string,
): Promise<{ shared: boolean }> {
    if (!isNativePlatform()) {
        // Fallback to web
        shareToWhatsAppWeb(text);
        return { shared: true };
    }

    try {
        const { Share } = await import('@capacitor/share');

        if (imageDataUrl) {
            // Save image to temp file first
            const { Filesystem, Directory } = await import('@capacitor/filesystem');
            const base64Data = imageDataUrl.split(',')[1];
            const fileName = `vck-wa-${Date.now()}.png`;

            const savedFile = await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Cache,
            });

            await Share.share({
                title: 'VCK Social Media',
                text,
                url: savedFile.uri,
                dialogTitle: 'Share to WhatsApp',
            });
        } else {
            await Share.share({
                title: 'VCK Social Media',
                text,
                dialogTitle: 'Share to WhatsApp',
            });
        }

        return { shared: true };
    } catch (err) {
        console.warn('WhatsApp share error:', err);
        return { shared: false };
    }
}

/**
 * Main share function — detects platform and uses appropriate method
 */
export async function shareToWhatsApp(
    caption: string,
    templateName?: string,
    imageDataUrl?: string,
): Promise<{ shared: boolean }> {
    const text = generateWhatsAppCaption(caption, templateName);

    if (isNativePlatform()) {
        return shareToWhatsAppMobile(text, imageDataUrl);
    } else {
        shareToWhatsAppWeb(text);
        return { shared: true };
    }
}
