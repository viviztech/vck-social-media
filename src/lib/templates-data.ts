import { TemplateCategory } from './types';

// ============================================
// VCK Social Media — Template Data & Definitions
// ============================================

export interface TemplateField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'color' | 'image';
    default: string;
    placeholder?: string;
}

export interface TemplateDefinition {
    id: string;
    name: string;
    name_ta: string;
    category: TemplateCategory;
    aspect_ratio: '1:1' | '4:5' | '9:16' | '16:9';
    width: number;
    height: number;
    is_premium: boolean;
    language: string;
    fields: TemplateField[];
    render: (ctx: CanvasRenderingContext2D, data: Record<string, string>, images: Record<string, HTMLImageElement>) => void;
}

// Helper: draw rounded rect
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Helper: draw circular image
function drawCircularImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, radius: number) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, radius * 2, radius * 2);
    ctx.restore();
}

// Helper: draw text with word wrap
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), x, currentY);
            line = word + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, currentY);
}

// Helper: create gradient background
function drawVCKGradient(ctx: CanvasRenderingContext2D, w: number, h: number, angle: number = 135) {
    const rad = (angle * Math.PI) / 180;
    const x1 = w / 2 - Math.cos(rad) * w;
    const y1 = h / 2 - Math.sin(rad) * h;
    const x2 = w / 2 + Math.cos(rad) * w;
    const y2 = h / 2 + Math.sin(rad) * h;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, '#1a237e');
    grad.addColorStop(0.6, '#283593');
    grad.addColorStop(1, '#c62828');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
}

// Helper: draw decorative dots
function drawDots(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 0; x < w; x += 30) {
        for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Helper: draw VCK branding bar
function drawBrandBar(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Bottom bar
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, h - 60, w, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('விடுதலை சிறுத்தைகள் கட்சி | VCK', w / 2, h - 28);
    // Top accent line
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(0, 0, w, 4);
}

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export const TEMPLATES: TemplateDefinition[] = [
    // --- 1. Festival Greeting (1:1) ---
    {
        id: 'festival-greeting',
        name: 'Festival Greeting',
        name_ta: 'திருவிழா வாழ்த்துகள்',
        category: 'festival',
        aspect_ratio: '1:1',
        width: 1080,
        height: 1080,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'name', label: 'Your Name', type: 'text', default: '', placeholder: 'Enter your name' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Your title' },
            { key: 'festival', label: 'Festival Name', type: 'text', default: 'பொங்கல் நல்வாழ்த்துகள்', placeholder: 'Festival greeting' },
            { key: 'message', label: 'Message', type: 'textarea', default: 'இனிய திருநாள் வாழ்த்துகள்!', placeholder: 'Your message' },
            { key: 'photo', label: 'Your Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            drawVCKGradient(ctx, w, h);
            drawDots(ctx, w, h);

            // Decorative circle
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(w / 2, h / 2 - 50, 300, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(w / 2, h / 2 - 50, 320, 0, Math.PI * 2); ctx.stroke();

            // Festival title
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 64px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.festival || 'திருவிழா வாழ்த்துகள்', w / 2, 200);

            // Decorative line
            ctx.strokeStyle = '#f9a825';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(w / 2 - 120, 230); ctx.lineTo(w / 2 + 120, 230); ctx.stroke();

            // Message
            ctx.fillStyle = '#ffffff';
            ctx.font = '32px Arial, sans-serif';
            wrapText(ctx, data.message || '', w / 2, 310, 700, 45);

            // Photo
            if (images.photo) {
                drawCircularImage(ctx, images.photo, w / 2 - 90, 480, 90);
                // Border
                ctx.strokeStyle = '#f9a825';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(w / 2, 570, 92, 0, Math.PI * 2); ctx.stroke();
            }

            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.name || 'Your Name', w / 2, 720);

            // Designation
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText(data.designation || 'Designation', w / 2, 760);

            drawBrandBar(ctx, w, h);
        },
    },

    // --- 2. Birthday Greeting (1:1) ---
    {
        id: 'birthday-greeting',
        name: 'Birthday Greeting',
        name_ta: 'பிறந்தநாள் வாழ்த்துகள்',
        category: 'birthday',
        aspect_ratio: '1:1',
        width: 1080,
        height: 1080,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'name', label: 'Your Name', type: 'text', default: '', placeholder: 'Who is wishing' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Your title' },
            { key: 'birthday_person', label: 'Birthday Person', type: 'text', default: '', placeholder: 'Name of the person' },
            { key: 'message', label: 'Message', type: 'textarea', default: 'இனிய பிறந்தநாள் வாழ்த்துகள்!', placeholder: 'Birthday message' },
            { key: 'photo', label: 'Your Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            // Pink-blue gradient for birthday
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#1a237e');
            grad.addColorStop(0.5, '#4a148c');
            grad.addColorStop(1, '#880e4f');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            drawDots(ctx, w, h);

            // Emoji
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎂', w / 2, 150);

            // Title
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 56px Arial, sans-serif';
            ctx.fillText('பிறந்தநாள் வாழ்த்துகள்', w / 2, 260);

            // Birthday person
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 44px Arial, sans-serif';
            ctx.fillText(data.birthday_person || 'Name', w / 2, 350);

            // Decorative line
            ctx.strokeStyle = '#f9a825';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(w / 2 - 100, 375); ctx.lineTo(w / 2 + 100, 375); ctx.stroke();

            // Message
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.font = '28px Arial, sans-serif';
            wrapText(ctx, data.message || '', w / 2, 440, 700, 40);

            // Photo
            if (images.photo) {
                drawCircularImage(ctx, images.photo, w / 2 - 75, 580, 75);
                ctx.strokeStyle = '#f9a825';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(w / 2, 655, 77, 0, Math.PI * 2); ctx.stroke();
            }

            // Wisher
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px Arial, sans-serif';
            ctx.fillText(data.name || 'Your Name', w / 2, 790);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '22px Arial, sans-serif';
            ctx.fillText(data.designation || 'Designation', w / 2, 825);

            drawBrandBar(ctx, w, h);
        },
    },

    // --- 3. Campaign Poster (4:5) ---
    {
        id: 'campaign-poster',
        name: 'Campaign Poster',
        name_ta: 'பிரச்சார போஸ்டர்',
        category: 'campaign',
        aspect_ratio: '4:5',
        width: 1080,
        height: 1350,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'name', label: 'Candidate Name', type: 'text', default: '', placeholder: 'Candidate name' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Position' },
            { key: 'constituency', label: 'Constituency', type: 'text', default: '', placeholder: 'Your constituency' },
            { key: 'slogan', label: 'Campaign Slogan', type: 'textarea', default: 'சமூக நீதிக்காக போராடுவோம்!', placeholder: 'Your slogan' },
            { key: 'photo', label: 'Your Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            drawVCKGradient(ctx, w, h, 180);
            drawDots(ctx, w, h);

            // Top accent
            ctx.fillStyle = '#f9a825';
            ctx.fillRect(0, 0, w, 6);

            // Party name
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('விடுதலை சிறுத்தைகள் கட்சி', w / 2, 70);

            // Photo - large rectangle
            if (images.photo) {
                const imgW = 400, imgH = 500;
                const imgX = (w - imgW) / 2, imgY = 120;
                roundRect(ctx, imgX - 4, imgY - 4, imgW + 8, imgH + 8, 16);
                ctx.fillStyle = '#f9a825';
                ctx.fill();
                ctx.save();
                roundRect(ctx, imgX, imgY, imgW, imgH, 12);
                ctx.clip();
                ctx.drawImage(images.photo, imgX, imgY, imgW, imgH);
                ctx.restore();
            }

            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 52px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.name || 'Candidate Name', w / 2, 710);

            // Designation
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.fillText(data.designation || 'Designation', w / 2, 760);

            // Constituency
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '26px Arial, sans-serif';
            ctx.fillText(data.constituency || 'Constituency', w / 2, 800);

            // Divider
            ctx.strokeStyle = '#f9a825';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(w / 2 - 150, 830); ctx.lineTo(w / 2 + 150, 830); ctx.stroke();

            // Slogan
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 38px Arial, sans-serif';
            wrapText(ctx, data.slogan || '', w / 2, 900, 800, 50);

            // Bottom bar
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, h - 80, w, 80);
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.fillText('VCK | விடுதலை சிறுத்தைகள் கட்சி', w / 2, h - 38);
        },
    },

    // --- 4. Event Announcement (16:9) ---
    {
        id: 'event-announcement',
        name: 'Event Announcement',
        name_ta: 'நிகழ்ச்சி அறிவிப்பு',
        category: 'event',
        aspect_ratio: '16:9',
        width: 1920,
        height: 1080,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'title', label: 'Event Title', type: 'text', default: '', placeholder: 'Event name' },
            { key: 'date', label: 'Date & Time', type: 'text', default: '', placeholder: 'DD/MM/YYYY - 10:00 AM' },
            { key: 'venue', label: 'Venue', type: 'text', default: '', placeholder: 'Location' },
            { key: 'name', label: 'Organizer', type: 'text', default: '', placeholder: 'Your name' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Your title' },
            { key: 'photo', label: 'Your Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            drawVCKGradient(ctx, w, h, 120);
            drawDots(ctx, w, h);

            // Left decorative band
            ctx.fillStyle = '#f9a825';
            ctx.fillRect(0, 0, 8, h);

            // Party header
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('விடுதலை சிறுத்தைகள் கட்சி', 50, 60);

            // Event title
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 72px Arial, sans-serif';
            ctx.textAlign = 'left';
            wrapText(ctx, data.title || 'Event Title', 50, 200, 1100, 85);

            // Date
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial, sans-serif';
            ctx.fillText('📅 ' + (data.date || 'Date'), 50, 440);

            // Venue
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = '32px Arial, sans-serif';
            ctx.fillText('📍 ' + (data.venue || 'Venue'), 50, 500);

            // Right side - photo
            if (images.photo) {
                drawCircularImage(ctx, images.photo, w - 350, 180, 130);
                ctx.strokeStyle = '#f9a825';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(w - 220, 310, 133, 0, Math.PI * 2); ctx.stroke();
            }

            // Organizer info
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px Arial, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(data.name || 'Organizer', w - 50, 510);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText(data.designation || 'Designation', w - 50, 550);

            // Bottom bar
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, h - 70, w, 70);
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('VCK | Viduthalai Chiruthaigal Katchi', w / 2, h - 30);
        },
    },

    // --- 5. Story Template (9:16) ---
    {
        id: 'story-template',
        name: 'Story Post',
        name_ta: 'ஸ்டோரி போஸ்ட்',
        category: 'general',
        aspect_ratio: '9:16',
        width: 1080,
        height: 1920,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'name', label: 'Your Name', type: 'text', default: '', placeholder: 'Your name' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Your title' },
            { key: 'message', label: 'Message', type: 'textarea', default: '', placeholder: 'Your message' },
            { key: 'photo', label: 'Your Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            drawVCKGradient(ctx, w, h, 160);
            drawDots(ctx, w, h);

            // Top decorative
            ctx.fillStyle = '#f9a825';
            ctx.fillRect(0, 0, w, 6);

            // Party name
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('விடுதலை சிறுத்தைகள் கட்சி', w / 2, 80);

            // Large photo
            if (images.photo) {
                const imgSize = 350;
                drawCircularImage(ctx, images.photo, (w - imgSize) / 2, 200, imgSize / 2);
                ctx.strokeStyle = '#f9a825';
                ctx.lineWidth = 5;
                ctx.beginPath(); ctx.arc(w / 2, 200 + imgSize / 2, imgSize / 2 + 4, 0, Math.PI * 2); ctx.stroke();
            }

            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.name || 'Your Name', w / 2, 650);

            // Designation
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.fillText(data.designation || 'Designation', w / 2, 700);

            // Divider
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(w / 2 - 120, 740); ctx.lineTo(w / 2 + 120, 740); ctx.stroke();

            // Message
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.font = '34px Arial, sans-serif';
            wrapText(ctx, data.message || 'Your message here', w / 2, 820, 800, 48);

            // Bottom branding
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, h - 100, w, 100);
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('VCK | விடுதலை சிறுத்தைகள் கட்சி', w / 2, h - 45);
        },
    },

    // --- 6. Achievement Post (1:1) ---
    {
        id: 'achievement-post',
        name: 'Achievement Post',
        name_ta: 'சாதனை பதிவு',
        category: 'achievement',
        aspect_ratio: '1:1',
        width: 1080,
        height: 1080,
        is_premium: true,
        language: 'Tamil',
        fields: [
            { key: 'name', label: 'Name', type: 'text', default: '', placeholder: 'Achiever name' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Title' },
            { key: 'achievement', label: 'Achievement', type: 'textarea', default: '', placeholder: 'Describe the achievement' },
            { key: 'photo', label: 'Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#1a237e');
            grad.addColorStop(0.4, '#0d47a1');
            grad.addColorStop(1, '#004d40');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            drawDots(ctx, w, h);

            // Trophy icon
            ctx.font = '90px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏆', w / 2, 150);

            // Title
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.fillText('சாதனை', w / 2, 240);

            // Photo
            if (images.photo) {
                drawCircularImage(ctx, images.photo, w / 2 - 100, 300, 100);
                ctx.strokeStyle = '#f9a825';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(w / 2, 400, 103, 0, Math.PI * 2); ctx.stroke();
            }

            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 40px Arial, sans-serif';
            ctx.fillText(data.name || 'Name', w / 2, 560);

            ctx.fillStyle = '#f9a825';
            ctx.font = '26px Arial, sans-serif';
            ctx.fillText(data.designation || 'Designation', w / 2, 600);

            // Achievement text
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.font = '28px Arial, sans-serif';
            wrapText(ctx, data.achievement || 'Achievement description', w / 2, 680, 750, 40);

            drawBrandBar(ctx, w, h);
        },
    },

    // --- 7. Condolence Message (1:1) ---
    {
        id: 'condolence-message',
        name: 'Condolence Message',
        name_ta: 'இரங்கல் செய்தி',
        category: 'condolence',
        aspect_ratio: '1:1',
        width: 1080,
        height: 1080,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'name', label: 'Your Name', type: 'text', default: '', placeholder: 'Who is expressing condolence' },
            { key: 'designation', label: 'Designation', type: 'text', default: '', placeholder: 'Your title' },
            { key: 'deceased', label: 'Deceased Name', type: 'text', default: '', placeholder: 'Name of the deceased' },
            { key: 'message', label: 'Message', type: 'textarea', default: 'அவர் ஆத்மா சாந்தியடைய வேண்டுகிறோம்.', placeholder: 'Condolence message' },
            { key: 'photo', label: 'Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#1a1a2e');
            grad.addColorStop(1, '#16213e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Somber accent
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            for (let y = 0; y < h; y += 40) {
                ctx.fillRect(0, y, w, 1);
            }

            // Candle
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🕯️', w / 2, 120);

            // Title
            ctx.fillStyle = '#e0e0e0';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.fillText('இரங்கல் செய்தி', w / 2, 210);

            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(w / 2 - 100, 235); ctx.lineTo(w / 2 + 100, 235); ctx.stroke();

            // Deceased name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 44px Arial, sans-serif';
            ctx.fillText(data.deceased || 'Name', w / 2, 320);

            // Photo
            if (images.photo) {
                drawCircularImage(ctx, images.photo, w / 2 - 80, 370, 80);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(w / 2, 450, 83, 0, Math.PI * 2); ctx.stroke();
            }

            // Message
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.font = '28px Arial, sans-serif';
            wrapText(ctx, data.message || '', w / 2, 600, 700, 40);

            // Wisher
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.fillText(data.name || 'Your Name', w / 2, 800);
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '22px Arial, sans-serif';
            ctx.fillText(data.designation || '', w / 2, 835);

            // Bottom
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(0, h - 50, w, 50);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '16px Arial, sans-serif';
            ctx.fillText('VCK | விடுதலை சிறுத்தைகள் கட்சி', w / 2, h - 20);
        },
    },

    // --- 8. Announcement Banner (16:9) ---
    {
        id: 'announcement-banner',
        name: 'Announcement Banner',
        name_ta: 'அறிவிப்பு பேனர்',
        category: 'announcement',
        aspect_ratio: '16:9',
        width: 1920,
        height: 1080,
        is_premium: false,
        language: 'Tamil',
        fields: [
            { key: 'title', label: 'Title', type: 'text', default: '', placeholder: 'Announcement title' },
            { key: 'subtitle', label: 'Subtitle', type: 'text', default: '', placeholder: 'Subtitle' },
            { key: 'details', label: 'Details', type: 'textarea', default: '', placeholder: 'Announcement details' },
            { key: 'name', label: 'Issued By', type: 'text', default: '', placeholder: 'Your name' },
            { key: 'photo', label: 'Photo', type: 'image', default: '' },
        ],
        render(ctx, data, images) {
            const { width: w, height: h } = this;
            drawVCKGradient(ctx, w, h, 90);

            // Left accent
            ctx.fillStyle = '#f9a825';
            ctx.fillRect(0, 0, 10, h);

            // Megaphone
            ctx.font = '80px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('📢', 50, 130);

            // Title
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 68px Arial, sans-serif';
            ctx.textAlign = 'left';
            wrapText(ctx, data.title || 'அறிவிப்பு', 50, 250, 1300, 80);

            // Subtitle
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial, sans-serif';
            ctx.fillText(data.subtitle || '', 50, 440);

            // Details
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = '28px Arial, sans-serif';
            wrapText(ctx, data.details || '', 50, 520, 1200, 40);

            // Right side photo
            if (images.photo) {
                drawCircularImage(ctx, images.photo, w - 320, 200, 120);
                ctx.strokeStyle = '#f9a825';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(w - 200, 320, 123, 0, Math.PI * 2); ctx.stroke();
            }

            // Issued by
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(data.name || '', w - 50, 520);

            // Bottom
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, h - 60, w, 60);
            ctx.fillStyle = '#f9a825';
            ctx.font = 'bold 20px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('VCK | விடுதலை சிறுத்தைகள் கட்சி', w / 2, h - 25);
        },
    },
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
    return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
    if (category === 'all') return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === category);
}
