-- ==============================================================================
-- MUSTAFA PORTFOLIO & BLOG - SUPABASE VERİTABANI & DEPOLAMA ŞEMASI
-- ==============================================================================

-- 1. Eklentileri etkinleştir (UUID üretimi için)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HİKAYELER / YAZILAR TABLOSU (stories)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    pdf_url TEXT,
    tags TEXT[] DEFAULT '{}',
    reading_time INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Var olan tablolar için pdf_url kolonu güvencesi
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- 3. SANAT ESERLERİ TABLOSU (artworks)
CREATE TABLE IF NOT EXISTS public.artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    high_res_url TEXT,
    medium TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    aspect_ratio TEXT DEFAULT 'portrait',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Var olan tablolar için pdf_url kolonu güvencesi
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- 4. YORUMLAR TABLOSU (comments)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    story_title TEXT NOT NULL,
    story_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT DEFAULT 'reader',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- İndeksler (Sorgu performansı için)
CREATE INDEX IF NOT EXISTS idx_stories_slug ON public.stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON public.stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON public.artworks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON public.comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ==============================================================================

-- RLS'yi aktif et
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Tek Yönetici Kuralı Kontrol Fonksiyonu
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'email') = 'mustafabite2357@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── HİKAYELER POLİTİKALARI ──────────────────────────────────────────────────
-- Herkes okuyabilir (Misafirler ve kullanıcılar)
CREATE POLICY "Stories are publicly readable" 
    ON public.stories FOR SELECT 
    USING (true);

-- Yalnızca Admin ekleyebilir, güncelleyebilir ve silebilir
CREATE POLICY "Only admin can insert stories" 
    ON public.stories FOR INSERT 
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admin can update stories" 
    ON public.stories FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Only admin can delete stories" 
    ON public.stories FOR DELETE 
    USING (public.is_admin());

-- ─── SANAT ESERLERİ POLİTİKALARI ──────────────────────────────────────────────
-- Herkes okuyabilir
CREATE POLICY "Artworks are publicly readable" 
    ON public.artworks FOR SELECT 
    USING (true);

-- Yalnızca Admin ekleyebilir, güncelleyebilir ve silebilir
CREATE POLICY "Only admin can insert artworks" 
    ON public.artworks FOR INSERT 
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admin can update artworks" 
    ON public.artworks FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Only admin can delete artworks" 
    ON public.artworks FOR DELETE 
    USING (public.is_admin());

-- ─── YORUMLAR POLİTİKALARI ───────────────────────────────────────────────────
-- Herkes yorumları okuyabilir
CREATE POLICY "Comments are publicly readable" 
    ON public.comments FOR SELECT 
    USING (true);

-- Oturum açmış herhangi bir okuyucu yorum ekleyebilir
CREATE POLICY "Authenticated users can post comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Yalnızca yorumun sahibi kendi yorumunu düzenleyebilir
CREATE POLICY "Users can update their own comments" 
    ON public.comments FOR UPDATE 
    USING (auth.uid() = user_id);

-- Yorumun sahibi VEYA Yönetici silebilir (Moderasyon)
CREATE POLICY "Users can delete own comments or admin can delete any" 
    ON public.comments FOR DELETE 
    USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- 6. SUPABASE STORAGE (MEDYA KOVASI) YAPILANDIRMASI
-- ==============================================================================
-- 'portfolio-media' adında halka açık bir depolama alanı oluşturun:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Depolama Politikaları:
-- 1. Herkes görselleri görebilir
CREATE POLICY "Media is publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

-- 2. Yalnızca Admin görsel yükleyebilir
CREATE POLICY "Only admin can upload media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'mustafabite2357@gmail.com');

-- 3. Yalnızca Admin görsel silebilir
CREATE POLICY "Only admin can delete media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'mustafabite2357@gmail.com');
