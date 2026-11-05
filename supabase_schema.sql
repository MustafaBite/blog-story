-- ==============================================================================
-- MUSTAFA PORTFOLIO & BLOG - SUPABASE VERİTABANI & DEPOLAMA ŞEMASI
-- ==============================================================================

-- 1. Eklentileri etkinleştir (UUID üretimi için)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. KULLANICI PROFİLLERİ TABLOSU (profiles)
-- auth.users ile 1:1 senkronize çalışır ve 1000+ kullanıcıda kilitlenmeyi önler
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'reader' CHECK (role IN ('admin', 'reader')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Profiles İndeksleri (Sorgu & Senkronizasyon Performansı için)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. HİKAYELER / YAZILAR TABLOSU (stories)
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

-- 4. SANAT ESERLERİ TABLOSU (artworks)
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

-- 5. YORUMLAR TABLOSU (comments)
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

-- İndeksler (Sorgu performansı ve anlık yoğunluk için)
CREATE INDEX IF NOT EXISTS idx_stories_slug ON public.stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON public.stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON public.artworks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON public.comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ==============================================================================

-- RLS'yi aktif et
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
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

-- ─── PROFİLLER POLİTİKALARI ───────────────────────────────────────────────────
-- Herkes profilleri okuyabilir (Yorumlardaki isim ve avatarlar için)
CREATE POLICY "Profiles are publicly readable" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Kullanıcılar yalnızca kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Kullanıcılar kendi profilini ekleyebilir
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Yönetici tüm profilleri yönetebilir
CREATE POLICY "Admin can manage all profiles" 
    ON public.profiles FOR ALL 
    USING (public.is_admin());

-- ─── HİKAYELER POLİTİKALARI ──────────────────────────────────────────────────
CREATE POLICY "Stories are publicly readable" 
    ON public.stories FOR SELECT 
    USING (true);

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
CREATE POLICY "Artworks are publicly readable" 
    ON public.artworks FOR SELECT 
    USING (true);

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
CREATE POLICY "Comments are publicly readable" 
    ON public.comments FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can post comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own comments" 
    ON public.comments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments or admin can delete any" 
    ON public.comments FOR DELETE 
    USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- 7. AUTH SENKRONİZASYON TRIGGER'I (auth.users -> public.profiles)
-- ==============================================================================
-- Kullanıcı auth.users tablosuna eklendiği an otomatik olarak public.profiles'a da yazılır.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'display_name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::text
        ),
        CASE 
            WHEN LOWER(NEW.email) = 'mustafabite2357@gmail.com' THEN 'admin'
            ELSE 'reader'
        END,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- 1000+ eşzamanlı istekte trigger hatası çıksa dahi auth.users kaydının kesilmesini önler
        RAISE WARNING 'handle_new_user trigger hatası: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Trigger'ı bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Var olan auth.users kayıtlarını profiles tablosuna geriye dönük aktar (Backfill)
INSERT INTO public.profiles (id, email, display_name, avatar_url, role, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'display_name', SPLIT_PART(email, '@', 1)),
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || id::text,
    CASE WHEN LOWER(email) = 'mustafabite2357@gmail.com' THEN 'admin' ELSE 'reader' END,
    created_at,
    NOW()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 8. SUPABASE STORAGE (MEDYA KOVASI) YAPILANDIRMASI
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media is publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Only admin can upload media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'mustafabite2357@gmail.com');

CREATE POLICY "Only admin can delete media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'mustafabite2357@gmail.com');

-- ==============================================================================
-- 9. SUPABASE REALTIME (CANLI ÇOKLU CİHAZ EŞZAMANLAMA) YAPILANDIRMASI
-- ==============================================================================
-- Mobil, masaüstü veya farklı tarayıcılar arasında anında senkronizasyon için
-- tabloları supabase_realtime yayınına ekleyin:
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.artworks;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

