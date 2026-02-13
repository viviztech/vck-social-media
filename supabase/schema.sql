-- ============================================
-- VCK Social Media — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO '';

-- ============================================
-- 1. PROFILES TABLE (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    designation TEXT DEFAULT '',
    constituency TEXT DEFAULT '',
    party_role TEXT DEFAULT 'member',
    district TEXT DEFAULT '',
    state TEXT DEFAULT 'Tamil Nadu',
    profile_photo_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'coordinator', 'admin')),
    language_preference TEXT DEFAULT 'ta',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    amount INTEGER NOT NULL, -- in paise
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions"
    ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions"
    ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- 3. SOCIAL ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('meta', 'facebook', 'instagram')),
    access_token TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ,
    platform_user_id TEXT,
    platform_user_name TEXT,
    pages JSONB DEFAULT '[]'::jsonb, -- Array of {id, name, access_token, category, instagram_id}
    is_connected BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social accounts"
    ON social_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own social accounts"
    ON social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own social accounts"
    ON social_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own social accounts"
    ON social_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_social_accounts_user ON social_accounts(user_id);

-- ============================================
-- 4. POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    caption TEXT DEFAULT '',
    image_url TEXT,
    platforms TEXT[] DEFAULT '{}', -- {'facebook', 'instagram'}
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    custom_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
    ON posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts"
    ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts"
    ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts"
    ON posts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'scheduled';

-- ============================================
-- 5. POST PLATFORMS TABLE (publish tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS post_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram')),
    platform_post_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
    error_message TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE post_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post platforms"
    ON post_platforms FOR SELECT
    USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid()));
CREATE POLICY "Users can insert own post platforms"
    ON post_platforms FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid()));

CREATE INDEX idx_post_platforms_post ON post_platforms(post_id);

-- ============================================
-- 6. MEDIA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own media"
    ON media FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own media"
    ON media FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own media"
    ON media FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_media_user ON media(user_id);

-- ============================================
-- 7. PAYMENT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL, -- in paise
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    billing_cycle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments"
    ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_payments_user ON payments(user_id);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER social_accounts_updated_at
    BEFORE UPDATE ON social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
