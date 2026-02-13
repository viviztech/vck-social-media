# VCK Social Media — Feature Reference

> **Version:** 0.1.0 | **Framework:** Next.js 16 + React 19 | **Language:** TypeScript  
> **Repository:** [github.com/viviztech/vck-social-media](https://github.com/viviztech/vck-social-media)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Pages & Routes](#pages--routes)
5. [Template Engine](#template-engine)
6. [Meta Social Integration](#meta-social-integration)
7. [Razorpay Billing](#razorpay-billing)
8. [Admin Panel](#admin-panel)
9. [Capacitor Mobile](#capacitor-mobile)
10. [Database Schema](#database-schema)
11. [Authentication](#authentication)
12. [API Routes](#api-routes)
13. [Utility Libraries](#utility-libraries)
14. [Environment Variables](#environment-variables)
15. [Scripts & Commands](#scripts--commands)
16. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     VCK Social Media App                     │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│   Frontend   │   Backend    │   Database   │     Mobile      │
│  Next.js 16  │  API Routes  │  Supabase    │   Capacitor     │
│  React 19    │  (Next.js)   │  PostgreSQL  │   Android/iOS   │
│  Tailwind 4  │              │  RLS Enabled │                 │
├──────────────┼──────────────┼──────────────┼─────────────────┤
│   shadcn/ui  │  Meta API    │  7 Tables    │  Native Share   │
│  Lucide Icons│  Razorpay    │  RLS Policies│  Camera/Gallery │
│  Canvas2D    │              │  Triggers    │  StatusBar      │
└──────────────┴──────────────┴──────────────┴─────────────────┘
```

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **UI Library** | React | 19.2.3 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Components** | shadcn/ui + Radix UI | Latest |
| **Icons** | Lucide React | 0.563.0 |
| **Auth & DB** | Supabase (SSR) | 2.95.3 |
| **Payments** | Razorpay | Client SDK |
| **Social** | Meta Graph API | v18.0 |
| **Mobile** | Capacitor | 8.1.0 |
| **Theming** | next-themes | 0.4.6 |
| **Toasts** | Sonner | 2.0.7 |
| **Dates** | date-fns | 4.1.0 |
| **Canvas** | Canvas2D + html2canvas | 1.4.1 |

---

## Project Structure

```
vck-social-media/
├── src/
│   ├── app/
│   │   ├── (admin)/admin/          # Admin panel (6 pages)
│   │   │   ├── layout.tsx          # Sidebar layout + role guard
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── users/page.tsx      # User management
│   │   │   ├── content/page.tsx    # Content moderation
│   │   │   ├── subscriptions/      # Subscription management
│   │   │   ├── analytics/page.tsx  # Platform analytics
│   │   │   └── settings/page.tsx   # App settings
│   │   ├── (app)/                  # Main app (8 pages)
│   │   │   ├── layout.tsx          # App layout + navbar
│   │   │   ├── dashboard/          # User dashboard
│   │   │   ├── templates/          # Template gallery + editor
│   │   │   ├── create-post/        # Post creation
│   │   │   ├── posts/              # Post history
│   │   │   ├── media/              # Media library
│   │   │   ├── social-accounts/    # Meta connections
│   │   │   ├── subscription/       # Plans & billing
│   │   │   └── profile/            # User profile
│   │   ├── (auth)/                 # Auth pages
│   │   │   ├── login/              # Login page
│   │   │   └── register/           # Registration page
│   │   ├── api/                    # API routes
│   │   │   ├── meta/callback/      # OAuth callback
│   │   │   ├── meta/publish/       # Post publishing
│   │   │   ├── razorpay/checkout/  # Payment orders
│   │   │   └── razorpay/verify/    # Payment verification
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Design system
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   └── navbar.tsx              # App navigation bar
│   └── lib/
│       ├── auth-context.tsx        # Auth provider + hooks
│       ├── database.ts             # Supabase CRUD operations
│       ├── meta-api.ts             # Meta Graph API utilities
│       ├── mobile.ts               # Capacitor native utilities
│       ├── razorpay.ts             # Payment utilities
│       ├── supabase.ts             # Supabase client
│       ├── supabase-config.ts      # Supabase credentials
│       ├── template-renderer.ts    # Canvas2D rendering engine
│       ├── templates-data.ts       # 8 template definitions
│       ├── types.ts                # TypeScript interfaces
│       └── utils.ts                # Utility helpers (cn)
├── supabase/
│   └── schema.sql                  # Database schema (7 tables)
├── android/                        # Capacitor Android project
├── capacitor.config.ts             # Capacitor configuration
├── vercel.json                     # Vercel deployment config
└── .env.local.example              # Environment template
```

---

## Pages & Routes

### 🏠 Public Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Landing page with hero, features, templates preview, pricing, FAQ |
| `/login` | `app/(auth)/login/page.tsx` | Email + password login with Supabase Auth |
| `/register` | `app/(auth)/register/page.tsx` | Registration with name, email, phone, password |

### 📱 App Pages (Authenticated)

| Route | File | Description |
|---|---|---|
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Overview with stats cards, recent posts, quick actions |
| `/templates` | `app/(app)/templates/page.tsx` | Template gallery with category filters, search, grid view |
| `/templates/[id]` | `app/(app)/templates/[id]/page.tsx` | Live template editor with Canvas2D preview |
| `/create-post` | `app/(app)/create-post/page.tsx` | Post creator with template, caption, platform selection, scheduling |
| `/posts` | `app/(app)/posts/page.tsx` | Post history with status filters (draft, scheduled, published) |
| `/media` | `app/(app)/media/page.tsx` | Media library for uploaded photos and generated images |
| `/social-accounts` | `app/(app)/social-accounts/page.tsx` | Connect/disconnect Meta accounts (Facebook + Instagram) |
| `/subscription` | `app/(app)/subscription/page.tsx` | Subscription plans, billing cycle toggle, payment history |
| `/profile` | `app/(app)/profile/page.tsx` | Edit name, phone, designation, constituency, photo |

### 🛡️ Admin Pages (Admin/Coordinator Only)

| Route | File | Description |
|---|---|---|
| `/admin` | `app/(admin)/admin/page.tsx` | Dashboard with KPI cards, activity chart, top templates, feed |
| `/admin/users` | `app/(admin)/admin/users/page.tsx` | User table with search, role/status filters, ban/edit actions |
| `/admin/content` | `app/(admin)/admin/content/page.tsx` | Post moderation with approve/reject, flagged content review |
| `/admin/subscriptions` | `app/(admin)/admin/subscriptions/page.tsx` | Revenue cards, plan breakdown, subscription table |
| `/admin/analytics` | `app/(admin)/admin/analytics/page.tsx` | Platform stats, daily charts, districts, devices, peak hours |
| `/admin/settings` | `app/(admin)/admin/settings/page.tsx` | General, API keys, notifications, security settings |

---

## Template Engine

### Available Templates (8)

| Template | ID | Category | Aspect Ratio |
|---|---|---|---|
| Festival Greeting | `festival-greeting` | Festival | 1:1 |
| Birthday Greeting | `birthday-greeting` | Birthday | 1:1 |
| Campaign Poster | `campaign-poster` | Campaign | 4:5 |
| Event Announcement | `event-announcement` | Event | 16:9 |
| Story Template | `story-template` | General | 9:16 |
| Achievement Post | `achievement-post` | Achievement | 1:1 |
| Condolence Message | `condolence-message` | Condolence | 1:1 |
| Announcement Banner | `announcement-banner` | Announcement | 16:9 |

### Template Editor Features

- **Canvas2D Live Preview** — Real-time rendering on HTML Canvas
- **Editable Fields** — Name, designation, custom text, party info
- **Photo Upload** — Upload personal photo with positioning
- **Color Customization** — Background, text, accent colors
- **Multi-Resolution Export** — Download as PNG (1080p / 4K)
- **Responsive Previews** — Mobile, desktop, and square canvas views

### Key Files

| File | Purpose |
|---|---|
| `lib/templates-data.ts` | 8 template definitions with layers, colors, fields |
| `lib/template-renderer.ts` | Canvas2D rendering engine + image loading utilities |
| `app/(app)/templates/[id]/editor.tsx` | Interactive template editor (client component) |

---

## Meta Social Integration

### OAuth Flow

```
User clicks "Connect Meta"
  → Redirect to Meta OAuth consent screen
  → User grants permissions (pages_read, publish_pages, instagram_basic)
  → Meta redirects to /api/meta/callback
  → Server exchanges code for access token
  → Fetches user pages + Instagram Business Accounts
  → Stores connection in Supabase social_accounts table
```

### Supported Actions

| Action | Platform | Status |
|---|---|---|
| Connect account via OAuth | Meta | ✅ Ready |
| Publish text + image post | Facebook Page | ✅ Ready |
| Publish photo post | Instagram Business | ✅ Ready |
| Schedule post | Facebook Page | ✅ Ready |
| Disconnect account | Meta | ✅ Ready |

### Key Files

| File | Purpose |
|---|---|
| `lib/meta-api.ts` | OAuth URL, token exchange, page listing, publish/schedule functions |
| `api/meta/callback/route.ts` | OAuth callback handler |
| `api/meta/publish/route.ts` | Publishing endpoint (immediate + scheduled) |
| `app/(app)/social-accounts/page.tsx` | Connection management UI |

### Required Meta Permissions

- `pages_manage_posts` — Publish to Facebook Pages
- `pages_read_engagement` — Read page info
- `instagram_basic` — Access Instagram Business profile
- `instagram_content_publish` — Publish to Instagram

---

## Razorpay Billing

### Subscription Plans

| Plan | Monthly Price | Yearly Price | Key Features |
|---|---|---|---|
| **Starter** | ₹99 | ₹899/yr | 30 posts/month, basic templates |
| **Basic** | ₹249 | ₹1,999/yr | 100 posts, all templates, FB + IG |
| **Pro** | ₹449 | ₹3,599/yr | Unlimited, scheduling, analytics |
| **Party Office** | ₹799 | ₹6,399/yr | Unlimited, team management, priority support |

### Payment Flow

```
User selects plan → Click "Subscribe"
  → POST /api/razorpay/checkout (creates Razorpay order)
  → Razorpay checkout modal opens
  → User completes payment (UPI/Card/Netbanking)
  → POST /api/razorpay/verify (verifies HMAC-SHA256 signature)
  → Subscription activated in Supabase
```

### Key Files

| File | Purpose |
|---|---|
| `lib/razorpay.ts` | Plan definitions, order creation, signature verification |
| `api/razorpay/checkout/route.ts` | Creates Razorpay orders |
| `api/razorpay/verify/route.ts` | Webhook for payment verification |
| `app/(app)/subscription/page.tsx` | Plans UI, checkout, payment history |

---

## Admin Panel

### Access Control

- **Roles:** `member`, `coordinator`, `admin`
- **Admin access:** Only `admin` and `coordinator` roles can access `/admin/*`
- **Guard:** Client-side role check in `admin/layout.tsx`; non-admin users see "Access Denied"
- **Navbar:** Admin link appears only for authorized roles

### Admin Dashboard Features

| Section | Details |
|---|---|
| KPI Cards | Total users, posts, active subscriptions, monthly revenue |
| Post Activity | 7-day bar chart |
| Top Templates | Ranked usage with progress bars |
| Recent Activity | Live feed with user actions (posts, signups, subscriptions) |
| Quick Stats | Social connections, downloads, uptime |

### User Management

- Search by name, email, or district
- Filter by role (admin/coordinator/member) and status (active/suspended/inactive)
- Actions: View profile, Edit role, Suspend/Ban user
- CSV export

### Content Moderation

- Post cards with image preview, caption, platform badges
- Filter by status (published, scheduled, draft, pending, flagged, rejected)
- Filter by platform (Facebook/Instagram)
- Actions: View, Approve, Reject, Delete

### Subscription Management

- Revenue KPI cards (monthly revenue, total subscribers, avg revenue/user)
- Revenue breakdown by plan with visual progress bars
- Subscription table with search, status filter, cancel/renew actions

### Analytics

- Platform engagement rates (Facebook/Instagram)
- Daily posts bar chart (14 days)
- Template usage ranking
- Top districts by users and posts
- Device usage breakdown (Android/iOS/Desktop)
- Peak hours heatmap (24 hours)

### Settings (4 Tabs)

| Tab | Controls |
|---|---|
| **General** | App name, support email, language, logo, content moderation toggles |
| **API Keys** | Supabase, Meta, Razorpay credentials with connection status |
| **Notifications** | Toggle alerts for registrations, subscriptions, payments, flagged content |
| **Security** | 2FA, IP whitelist, session timeout, data export, reset statistics |

---

## Capacitor Mobile

### Configuration

| Property | Value |
|---|---|
| App ID | `com.vck.socialmedia` |
| App Name | `VCK Social Media` |
| Web Directory | `out` (static export) |
| Android Scheme | `https` |

### Plugins Installed

| Plugin | Purpose |
|---|---|
| `@capacitor/status-bar` | Custom status bar color (#1a237e) |
| `@capacitor/splash-screen` | Branded splash screen with spinner |
| `@capacitor/share` | Native share sheet for posts |
| `@capacitor/camera` | Photo capture/gallery picker |
| `@capacitor/filesystem` | Save images to device gallery |

### Mobile Utility Functions (`lib/mobile.ts`)

| Function | Description |
|---|---|
| `isNativePlatform()` | Check if running on Android/iOS |
| `getPlatform()` | Returns `'ios'`, `'android'`, or `'web'` |
| `initMobileApp()` | Initialize status bar + hide splash screen |
| `sharePost()` | Native share with text + optional image |
| `saveToGallery()` | Save image to device gallery |
| `pickImage()` | Open camera or gallery for image selection |
| `getApiBaseUrl()` | Returns remote API URL for native, relative for web |

### Build Commands

```bash
# Static export for mobile
npm run build:mobile

# Sync web assets to native projects
npm run cap:sync

# Open in Android Studio
npm run cap:android

# Open in Xcode
npm run cap:ios
```

---

## Database Schema

### Tables (7)

| Table | Purpose | Key Fields |
|---|---|---|
| `profiles` | User profiles (extends Supabase Auth) | name, email, phone, role, district, constituency |
| `subscriptions` | Active/past subscriptions | plan_id, billing_cycle, status, razorpay_order_id |
| `social_accounts` | Connected social platforms | platform, access_token, pages (JSONB), is_connected |
| `posts` | Created/scheduled posts | template_id, caption, platforms[], status, scheduled_at |
| `post_platforms` | Per-platform publish tracking | platform, platform_post_id, engagement stats |
| `media` | Uploaded files | file_url, file_name, file_type, file_size |
| `payments` | Payment transaction history | amount, razorpay_payment_id, status |

### Row Level Security (RLS)

All tables have RLS enabled. Users can only read/write their own data.

```sql
-- Example policy
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);
```

### Schema File

Run `supabase/schema.sql` in the Supabase SQL Editor to create all tables, policies, indexes, and triggers.

---

## Authentication

### Provider

Supabase Auth (email + password)

### Auth Flow

```
Register → supabase.auth.signUp() → Creates auth user + profiles row
Login    → supabase.auth.signInWithPassword()
Logout   → supabase.auth.signOut()
```

### Auth Context (`lib/auth-context.tsx`)

| Hook / Function | Description |
|---|---|
| `useAuth()` | Access user, session, profile, loading state |
| `signUp(email, password, name, phone)` | Register + create profile |
| `signIn(email, password)` | Login |
| `signOut()` | Logout + clear state |
| `updateProfile(data)` | Update profile fields |
| `refreshProfile()` | Re-fetch profile from DB |

### User Roles

| Role | Access |
|---|---|
| `member` | All app pages, limited features per plan |
| `coordinator` | All app pages + Admin panel |
| `admin` | Full access to everything |

---

## API Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/meta/callback` | Meta OAuth redirect handler |
| `POST` | `/api/meta/publish` | Publish/schedule posts to Facebook/Instagram |
| `POST` | `/api/razorpay/checkout` | Create Razorpay payment order |
| `POST` | `/api/razorpay/verify` | Verify payment signature (webhook) |

> **Note:** API routes are excluded from mobile static builds. The mobile app calls a remote backend via `getApiBaseUrl()`.

---

## Utility Libraries

| File | Exports | Description |
|---|---|---|
| `database.ts` | `getActiveSubscription`, `createSubscription`, `cancelSubscription`, `getSocialAccount`, `upsertSocialAccount`, `disconnectSocialAccount`, `getUserPosts`, `createPost`, `updatePostStatus`, `deletePost`, `getPaymentHistory`, `createPayment`, `getUserMedia`, `addMedia`, `deleteMedia`, `getDashboardStats` | Full Supabase CRUD |
| `meta-api.ts` | `getMetaOAuthUrl`, `exchangeCodeForToken`, `getUserPages`, `getInstagramBusinessAccount`, `publishToFacebook`, `publishToInstagram`, `scheduleOnFacebook` | Meta Graph API |
| `razorpay.ts` | `PLANS`, `getPlanById`, `createRazorpayOrder`, `verifyRazorpaySignature`, `getCheckoutOptions` | Payment utilities |
| `mobile.ts` | `isNativePlatform`, `getPlatform`, `initMobileApp`, `sharePost`, `saveToGallery`, `pickImage`, `getApiBaseUrl` | Capacitor wrappers |
| `template-renderer.ts` | `renderTemplate`, `loadImageFromFile` | Canvas2D rendering |
| `templates-data.ts` | `TEMPLATES`, `getTemplateById`, `getTemplatesByCategory` | Template definitions |
| `types.ts` | `UserProfile`, `Template`, `Post`, `SocialAccount`, `Subscription`, `MediaItem`, `SubscriptionPlan`, `SUBSCRIPTION_PLANS` | TypeScript types |
| `auth-context.tsx` | `AuthProvider`, `useAuth` | Auth state management |

---

## Environment Variables

Create `.env.local` from `.env.local.example`:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay (Required for billing)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Meta API (Required for social publishing)
NEXT_PUBLIC_META_APP_ID=your-meta-app-id
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
```

| Variable | Public | Required | Source |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | ✅ | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | ✅ | Same as above |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | For billing | [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | No | For billing | Same as above |
| `NEXT_PUBLIC_META_APP_ID` | Yes | For social | [Meta Developers](https://developers.facebook.com/apps) |
| `META_APP_ID` | No | For social | Same as above |
| `META_APP_SECRET` | No | For social | Same as above |

---

## Scripts & Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Production web build |
| `npm run build:mobile` | Static export for Capacitor (excludes API routes) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run cap:sync` | Sync web assets to Android/iOS |
| `npm run cap:android` | Open Android Studio |
| `npm run cap:ios` | Open Xcode |

---

## Deployment Guide

### Web Deployment (Vercel)

```bash
# 1. Push to GitHub (already done)
git push origin main

# 2. Import on Vercel
# Go to vercel.com → Import repo → viviztech/vck-social-media

# 3. Set environment variables in Vercel dashboard
# Add all vars from .env.local.example

# 4. Deploy (automatic on push)
```

### Database Setup (Supabase)

```bash
# 1. Create project at supabase.com
# 2. Go to SQL Editor
# 3. Paste contents of supabase/schema.sql
# 4. Click "Run"
# 5. Copy URL + anon key to .env.local
```

### Mobile Build (Android)

```bash
# 1. Static export
npm run build:mobile

# 2. Sync to native project
npm run cap:sync

# 3. Open in Android Studio
npm run cap:android

# 4. Build APK in Android Studio
# Build → Build Bundle(s) / APK(s) → Build APK
```

### Meta App Setup

```
1. Go to developers.facebook.com → Create App
2. Select "Business" type
3. Add products: Facebook Login, Instagram Graph API
4. Set OAuth redirect URI: https://your-domain.com/api/meta/callback
5. Copy App ID + Secret to .env.local
6. Submit for review (pages_manage_posts, instagram_content_publish)
```

### Razorpay Setup

```
1. Sign up at dashboard.razorpay.com
2. Go to Settings → API Keys → Generate Key
3. Copy Key ID + Secret to .env.local
4. For production: activate your Razorpay account
```

---

## Design System

### Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| Primary | `hsl(235, 65%, 30%)` | `hsl(235, 65%, 60%)` | Buttons, links, accents |
| VCK Red | `#c62828` | `#ef5350` | Party branding, alerts |
| VCK Blue | `#1a237e` | `#5c6bc0` | Headers, navigation |

### Typography

- **Font:** System UI stack (no external fonts)
- **Sizes:** xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px)

### Components (shadcn/ui)

Button, Card, Input, Label, Textarea, Badge, Separator, Avatar, DropdownMenu, Sheet, Tabs, Dialog, Tooltip

---

*Last updated: February 13, 2026*
