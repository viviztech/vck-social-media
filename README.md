<div align="center">

# 🏛️ VCK Social Media

### **Empowering Political Leaders with Professional Social Media Management**

*One platform. Every constituency. Instant reach.*

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

---

</div>

## 🎯 The Problem

Political party workers at the **constituency and district level** face a daily challenge:

> *"I need to post a festival greeting, a campaign update, and an event announcement — all branded correctly — but I don't have a designer, and I can't use Canva for every post."*

- ❌ No design skills → Posts look unprofessional
- ❌ Inconsistent branding → Every post looks different
- ❌ Manual posting → Copy-paste across Facebook and Instagram
- ❌ No scheduling → Missing key moments like festivals and rallies
- ❌ No oversight → Party HQ has zero visibility on grassroots activity

---

## 💡 The Solution

**VCK Social Media** is an all-in-one platform that turns party workers into social media professionals — **in seconds, not hours.**

| Before | After |
|---|---|
| Open Canva → Find template → Edit → Download → Open Facebook → Upload → Write caption → Post → Repeat for Instagram | **Pick template → Auto-fill name & photo → Post to FB + IG in one click** |
| ⏱️ 30+ minutes per post | ⏱️ **Under 60 seconds** |

---

## ✨ Key Features

### 🎨 Smart Template Engine
> **8 professionally designed templates** that auto-fill with user details

- Festival Greetings • Birthday Wishes • Campaign Posters • Event Announcements
- Achievement Posts • Condolence Messages • Announcement Banners • Stories
- **Canvas2D live editor** with real-time preview
- Upload photo → name, designation, party logo auto-placed
- Export as **1080p or 4K PNG** — print-ready quality

### 📲 One-Click Social Publishing
> **Post to Facebook + Instagram simultaneously** from a single screen

- Connect Meta accounts via secure **OAuth 2.0**
- Publish immediately or **schedule for later**
- Track post status (draft → scheduled → published)
- Platform-specific formatting handled automatically

### 💳 Flexible Subscription Plans
> **Starting at just ₹99/month** — affordable for every party worker

| Plan | Monthly | Yearly | Highlights |
|---|---|---|---|
| **Starter** | ₹99 | ₹899 | 30 posts/month, basic templates |
| **Basic** | ₹249 | ₹1,999 | 100 posts, all templates, FB + IG |
| **Pro** | ₹449 | ₹3,599 | Unlimited posts, scheduling, analytics |
| **Party Office** | ₹799 | ₹6,399 | Team management, priority support |

Powered by **Razorpay** — UPI, cards, netbanking, wallets.

### 🛡️ Admin Command Center
> **Complete visibility and control** for party leadership

- **User Management** — Search, filter by district/role, suspend/promote
- **Content Moderation** — Approve/reject posts before they go live
- **Revenue Dashboard** — Subscription metrics, plan breakdowns, payment history
- **Analytics** — District-wise activity, template usage, device stats, peak hours
- **Settings** — API keys, notifications, security (2FA, IP whitelist)

### 📱 Mobile App (Android & iOS)
> **Native mobile experience** via Capacitor

- Share posts using native share sheet
- Camera/gallery integration for photos
- Save generated images to device gallery
- Custom status bar and splash screen with party branding
- Works offline for template editing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Web App  │  │ Android  │  │      iOS          │  │
│  │ Next.js  │  │ Capacitor│  │   Capacitor       │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       └──────────────┼────────────────┘              │
├──────────────────────┼──────────────────────────────┤
│               API Layer (Next.js)                    │
│  ┌──────────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Meta OAuth   │ │ Razorpay │ │  Supabase Auth   │ │
│  │ Publishing   │ │ Checkout │ │  Database CRUD   │ │
│  └──────────────┘ └──────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────────┤
│                  Data Layer                          │
│  ┌─────────────────────────────────────────────────┐│
│  │            Supabase (PostgreSQL)                ││
│  │  profiles │ subscriptions │ social_accounts     ││
│  │  posts    │ post_platforms│ media │ payments    ││
│  │  ──────── Row Level Security on all tables ─────││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript | Fastest React framework, type safety |
| **Styling** | Tailwind CSS 4, shadcn/ui | Utility-first, beautiful components |
| **Auth & DB** | Supabase | Open-source Firebase alternative, PostgreSQL |
| **Payments** | Razorpay | India's #1 payment gateway, UPI support |
| **Social** | Meta Graph API | Official API for Facebook + Instagram |
| **Mobile** | Capacitor 8 | Native iOS/Android from one codebase |
| **Canvas** | Canvas2D, html2canvas | Client-side image generation, zero server cost |
| **Icons** | Lucide React | Consistent, lightweight icon set |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Setup

```bash
# Clone the repo
git clone https://github.com/viviztech/vck-social-media.git
cd vck-social-media

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Create database tables
# → Copy supabase/schema.sql into Supabase SQL Editor and run

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Mobile Build

```bash
npm run build:mobile    # Static export
npm run cap:sync        # Sync to native
npm run cap:android     # Open Android Studio → Build APK
```

---

## 📊 Project Metrics

| Metric | Count |
|---|---|
| **Total Pages** | 22+ |
| **App Pages** | 9 (dashboard, templates, editor, posts, media, social, subscription, profile, create-post) |
| **Admin Pages** | 6 (dashboard, users, content, subscriptions, analytics, settings) |
| **API Routes** | 4 (Meta OAuth, Meta publish, Razorpay checkout, Razorpay verify) |
| **Templates** | 8 (festival, birthday, campaign, event, story, achievement, condolence, announcement) |
| **Database Tables** | 7 (profiles, subscriptions, social_accounts, posts, post_platforms, media, payments) |
| **Utility Modules** | 11 (auth, database, meta-api, razorpay, mobile, templates, renderer, types, etc.) |
| **Subscription Plans** | 4 (Starter, Basic, Pro, Party Office) |

---

## 📁 Project Structure

```
vck-social-media/
├── src/app/
│   ├── (admin)/admin/       → 🛡️ Admin panel (6 pages)
│   ├── (app)/               → 📱 Main app (9 pages)
│   ├── (auth)/              → 🔐 Login & Register
│   ├── api/                 → ⚡ API routes (Meta + Razorpay)
│   └── page.tsx             → 🏠 Landing page
├── src/lib/                 → 🔧 Utility modules (11 files)
├── src/components/          → 🧩 UI components (shadcn/ui + navbar)
├── supabase/schema.sql      → 🗄️ Database schema
├── capacitor.config.ts      → 📱 Mobile config
├── vercel.json              → ☁️ Deployment config
└── FEATURES.md              → 📚 Detailed feature reference
```

---

## 🗺️ Roadmap

| Phase | Status | Description |
|---|---|---|
| Foundation & UI | ✅ Complete | Auth, dashboard, layouts, landing page |
| Template Engine | ✅ Complete | 8 templates, Canvas2D editor, PNG export |
| Meta Integration | ✅ Complete | OAuth, FB/IG publishing, scheduling |
| Razorpay Billing | ✅ Complete | 4 plans, checkout, payment verification |
| Capacitor Mobile | ✅ Complete | Android, native share/camera/gallery |
| Database & Deploy | ✅ Complete | Supabase schema, Vercel config |
| Admin Panel | ✅ Complete | Users, content, subscriptions, analytics, settings |
| Multi-language | 🔜 Planned | Full Tamil UI support |
| Bulk Scheduling | 🔜 Planned | Queue and auto-publish posts |
| Push Notifications | 🔜 Planned | Scheduled post reminders |
| WhatsApp Sharing | 🔜 Planned | Direct share to WhatsApp groups |
| Play Store Launch | 🔜 Planned | Android app on Google Play |

---

## 🤝 Target Users

| User Type | How They Use It |
|---|---|
| **Ward Members** | Post festival greetings, birthday wishes with their photo |
| **Constituency Coordinators** | Campaign posters, event announcements, achievement posts |
| **District Leaders** | Manage multiple coordinators, approve content before publishing |
| **State-Level Admins** | Analytics dashboard, revenue tracking, content moderation |

---

## 🔒 Security

- ✅ **Supabase Auth** — JWT-based authentication
- ✅ **Row Level Security** — Users can only access their own data
- ✅ **Role-Based Access** — Admin panel restricted to admin/coordinator
- ✅ **HMAC-SHA256** — Razorpay payment signature verification
- ✅ **OAuth 2.0** — Secure Meta account connection
- ✅ **Environment Variables** — All secrets stored server-side

---

## 📄 Documentation

| Document | Description |
|---|---|
| [FEATURES.md](./FEATURES.md) | Complete feature reference with API details, schemas, and deployment guides |
| [.env.local.example](./.env.local.example) | Environment variable template |
| [supabase/schema.sql](./supabase/schema.sql) | Database schema (copy to Supabase SQL Editor) |

---

## 📜 License

This project is proprietary software built for **VCK (Viduthalai Chiruthaigal Katchi)** party operations.

---

<div align="center">

**Built with ❤️ for Tamil Nadu's grassroots leaders**

*Empowering every constituency worker to become a social media professional*

🏛️ **VCK Social Media** — Professional posts. Zero design skills needed.

</div>
