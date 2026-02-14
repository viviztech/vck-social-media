# VCK Social Media — Task Tracker

## Phase 1: Foundation
- [x] Create Next.js project with TypeScript + Tailwind
- [x] Install dependencies (shadcn/ui, Supabase client, etc.)
- [x] Set up Supabase configuration and client
- [x] Build Auth pages (Login, Register)
- [x] Build Profile page (photo, details, party info)
- [x] Build Media upload functionality
- [x] Build Dashboard with stats and quick actions
- [x] Build Templates gallery with categories
- [x] Build Posts page with tabs
- [x] Build Subscription plans page
- [/] Verify build compiles

## Phase 2: Template Engine
- [x] Template editor with live preview
- [x] Client-side image generation (Canvas2D)
- [x] Template data models and rendering engine

## Phase 3: Social Integration (Meta only)
- [x] Meta OAuth connect flow
- [x] API routes for Meta Graph API
- [x] Post creation & publishing
- [x] Post scheduling
- [x] Social accounts management page

## Phase 4: Billing
- [x] Razorpay utility & plan definitions
- [x] Checkout API route
- [x] Webhook handler for payment verification
- [x] Enhanced subscription page with Razorpay checkout
- [x] Payment history

## Phase 5: Mobile (Capacitor)
- [x] Install Capacitor core + CLI
- [x] Configure static export for Next.js
- [x] Add Android & iOS platforms
- [x] Configure capacitor.config.ts
- [x] Add mobile status bar & splash screen plugins
- [x] Build and verify

## Phase 6: Supabase Database & Deployment
- [x] Supabase SQL schema (profiles, subscriptions, social_accounts, posts)
- [x] Database utility functions (CRUD operations)
- [x] Migrate auth context to use Supabase
- [x] Migrate subscription page to use Supabase
- [x] Migrate social accounts to use Supabase
- [x] Vercel deployment config

## Phase 7: Admin Panel
- [x] Admin layout with sidebar navigation
- [x] Admin dashboard with stats & charts
- [x] User management (list, search, role change, ban)
- [x] Content moderation (posts list, approve/reject)
- [x] Subscription management (overview, revenue)
- [x] Admin middleware/guard

## Phase 8: Multi-Language (Tamil UI)
- [x] Create i18n translation system (context + hook)
- [x] English dictionary (~200 keys)
- [x] Tamil dictionary (~200 keys)
- [x] Integrate translations into all app pages
- [x] Language toggle on navbar and profile page
- [x] Build verified & pushed to GitHub

## Phase 9: Bulk Scheduling
- [x] Bulk schedule page with calendar view
- [x] "Add to Queue" in create-post
- [x] Database functions for scheduled posts
- [x] Cron job API to auto-publish
- [x] Vercel cron config
- [x] Schedule nav link in navbar

## Phase 10: WhatsApp Sharing
- [x] WhatsApp share utility (web + mobile)
- [x] WhatsApp button in create-post
- [x] Re-share from posts page
- [x] Native WhatsApp intent on Android

## Phase 11: Push Notifications
- [x] Install FCM + Capacitor Push plugin
- [x] Device token registration
- [x] Server-side push API route
- [x] Notification preferences UI
- [x] Scheduled post reminders (API ready)

## Phase 12: Play Store Preparation
- [/] App icons and splash screen assets (Pending User Input)
- [x] Build config (signing via env vars)
- [x] GitHub Actions CI/CD workflow
- [x] Store listing assets and descriptions (Draft created)
