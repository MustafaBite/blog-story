import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Story, Artwork, Comment } from "../types";
import { initialStories } from "../data/stories";
import { initialArtworks } from "../data/artworks";
import { initialComments } from "../data/comments";
import { useAuth } from "./AuthContext";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface DataContextType {
  stories: Story[];
  artworks: Artwork[];
  comments: Comment[];
  isLoading: boolean;
  isCloudConnected: boolean;
  // Story İşlemleri
  addStory: (story: Omit<Story, "id">) => Promise<Story | null>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<boolean>;
  deleteStory: (id: string) => Promise<boolean>;
  getStoryBySlug: (slug: string) => Story | undefined;
  getFeaturedStories: () => Story[];
  getAllStoryTags: () => string[];
  // Eser İşlemleri
  addArtwork: (artwork: Omit<Artwork, "id">) => Promise<Artwork | null>;
  updateArtwork: (id: string, updates: Partial<Artwork>) => Promise<boolean>;
  deleteArtwork: (id: string) => Promise<boolean>;
  getFeaturedArtworks: () => Artwork[];
  getAllArtworkTags: () => string[];
  // Yorum İşlemleri
  addComment: (
    storyId: string,
    storyTitle: string,
    storySlug: string,
    content: string
  ) => Promise<Comment | null>;
  updateComment: (commentId: string, content: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
  getStoryComments: (storyId: string) => Comment[];
  getUserComments: (userId: string) => Comment[];
  seedInitialDataToSupabase: () => Promise<boolean>;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Supabase DB <-> Frontend Model Dönüştürücüleri
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStoryFromDb(row: any): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    tags: row.tags || [],
    readingTime: row.reading_time || 5,
    featured: Boolean(row.featured),
    publishedAt: row.published_at || row.created_at,
    pdfUrl: row.pdf_url || undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtworkFromDb(row: any): Artwork {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    highResUrl: row.high_res_url || row.image_url,
    medium: row.medium,
    tags: row.tags || [],
    aspectRatio: row.aspect_ratio || "portrait",
    featured: Boolean(row.featured),
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCommentFromDb(row: any): Comment {
  return {
    id: row.id,
    storyId: row.story_id,
    storyTitle: row.story_title,
    storySlug: row.story_slug,
    authorId: row.user_id,
    authorName: row.user_name,
    authorEmail: row.user_email,
    authorRole: row.user_role || "reader",
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // ─── State Tanımları (Fallback: localStorage veya initial) ────────────
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem("app_stories");
    return saved ? JSON.parse(saved) : initialStories;
  });

  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    const saved = localStorage.getItem("app_artworks");
    return saved ? JSON.parse(saved) : initialArtworks;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem("app_comments");
    return saved ? JSON.parse(saved) : initialComments;
  });

  // ─── Supabase'den Verileri Çekme ──────────────────────────────────────
  const fetchAllFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 1. Hikayeler
      const { data: dbStories, error: storyErr } = await supabase
        .from("stories")
        .select("*")
        .order("published_at", { ascending: false });

      if (!storyErr && dbStories && dbStories.length > 0) {
        setStories(dbStories.map(mapStoryFromDb));
      }

      // 2. Eserler
      const { data: dbArtworks, error: artErr } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!artErr && dbArtworks && dbArtworks.length > 0) {
        setArtworks(dbArtworks.map(mapArtworkFromDb));
      }

      // 3. Yorumlar
      const { data: dbComments, error: comErr } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!comErr && dbComments && dbComments.length > 0) {
        setComments(dbComments.map(mapCommentFromDb));
      }
    } catch (err) {
      console.warn("Supabase veri çekme hatası (yerel veriler kullanılıyor):", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFromSupabase();
  }, [fetchAllFromSupabase]);

  // Yerel depolama senkronizasyonu
  useEffect(() => {
    localStorage.setItem("app_stories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem("app_artworks", JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem("app_comments", JSON.stringify(comments));
  }, [comments]);

  // ─── Başlangıç Verilerini Supabase'e Otomatik Yükleme Fonksiyonu ───────
  const seedInitialDataToSupabase = async (): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      // Hikayeleri ekle
      const storiesPayload = initialStories.map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        content: s.content,
        cover_image: s.coverImage,
        tags: s.tags,
        reading_time: s.readingTime,
        featured: Boolean(s.featured),
        published_at: s.publishedAt,
      }));
      await supabase.from("stories").upsert(storiesPayload, { onConflict: "slug" });

      // Eserleri ekle
      const artworksPayload = initialArtworks.map((a) => ({
        title: a.title,
        description: a.description,
        image_url: a.imageUrl,
        high_res_url: a.highResUrl,
        medium: a.medium,
        tags: a.tags,
        aspect_ratio: a.aspectRatio || "portrait",
        featured: Boolean(a.featured),
        created_at: a.createdAt,
      }));
      await supabase.from("artworks").insert(artworksPayload);

      await fetchAllFromSupabase();
      return true;
    } catch (e) {
      console.error("Tohumlama hatası:", e);
      return false;
    }
  };

  // ─── Hikaye İşlemleri (CRUD) ──────────────────────────────────────────
  const addStory = async (storyData: Omit<Story, "id">): Promise<Story | null> => {
    const tempId = "story-" + Date.now();
    const newStory: Story = { ...storyData, id: tempId };

    // Optimistic UI
    setStories((prev) => [newStory, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("stories")
          .insert({
            slug: storyData.slug,
            title: storyData.title,
            excerpt: storyData.excerpt,
            content: storyData.content,
            cover_image: storyData.coverImage,
            tags: storyData.tags,
            reading_time: storyData.readingTime,
            featured: Boolean(storyData.featured),
            published_at: storyData.publishedAt,
            pdf_url: storyData.pdfUrl || null,
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase story insert error:", error);
        } else if (data) {
          const mapped = mapStoryFromDb(data);
          setStories((prev) => prev.map((s) => (s.id === tempId ? mapped : s)));
          return mapped;
        }
      } catch (err) {
        console.error("Supabase story insert failed:", err);
      }
    }

    return newStory;
  };

  const updateStory = async (id: string, updates: Partial<Story>): Promise<boolean> => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbPayload: any = {};
        if (updates.title !== undefined) dbPayload.title = updates.title;
        if (updates.slug !== undefined) dbPayload.slug = updates.slug;
        if (updates.excerpt !== undefined) dbPayload.excerpt = updates.excerpt;
        if (updates.content !== undefined) dbPayload.content = updates.content;
        if (updates.coverImage !== undefined) dbPayload.cover_image = updates.coverImage;
        if (updates.tags !== undefined) dbPayload.tags = updates.tags;
        if (updates.readingTime !== undefined) dbPayload.reading_time = updates.readingTime;
        if (updates.featured !== undefined) dbPayload.featured = updates.featured;
        if (updates.pdfUrl !== undefined) dbPayload.pdf_url = updates.pdfUrl;

        await supabase.from("stories").update(dbPayload).eq("id", id);
      } catch (err) {
        console.error("Supabase story update error:", err);
      }
    }
    return true;
  };

  const deleteStory = async (id: string): Promise<boolean> => {
    setStories((prev) => prev.filter((s) => s.id !== id));
    setComments((prev) => prev.filter((c) => c.storyId !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("stories").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase story delete error:", err);
      }
    }
    return true;
  };

  const getStoryBySlug = (slug: string) => {
    return stories.find((s) => s.slug === slug);
  };

  const getFeaturedStories = () => {
    return stories.filter((s) => s.featured).slice(0, 3);
  };

  const getAllStoryTags = () => {
    return Array.from(new Set(stories.flatMap((s) => s.tags))).sort();
  };

  // ─── Eser İşlemleri (CRUD) ────────────────────────────────────────────
  const addArtwork = async (artData: Omit<Artwork, "id">): Promise<Artwork | null> => {
    const tempId = "art-" + Date.now();
    const newArt: Artwork = { ...artData, id: tempId };

    setArtworks((prev) => [newArt, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("artworks")
          .insert({
            title: artData.title,
            description: artData.description,
            image_url: artData.imageUrl,
            high_res_url: artData.highResUrl || artData.imageUrl,
            medium: artData.medium,
            tags: artData.tags,
            aspect_ratio: artData.aspectRatio || "portrait",
            featured: Boolean(artData.featured),
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase artwork insert error:", error);
        } else if (data) {
          const mapped = mapArtworkFromDb(data);
          setArtworks((prev) => prev.map((a) => (a.id === tempId ? mapped : a)));
          return mapped;
        }
      } catch (err) {
        console.error("Supabase artwork insert failed:", err);
      }
    }

    return newArt;
  };

  const updateArtwork = async (id: string, updates: Partial<Artwork>): Promise<boolean> => {
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbPayload: any = {};
        if (updates.title !== undefined) dbPayload.title = updates.title;
        if (updates.description !== undefined) dbPayload.description = updates.description;
        if (updates.imageUrl !== undefined) dbPayload.image_url = updates.imageUrl;
        if (updates.highResUrl !== undefined) dbPayload.high_res_url = updates.highResUrl;
        if (updates.medium !== undefined) dbPayload.medium = updates.medium;
        if (updates.tags !== undefined) dbPayload.tags = updates.tags;
        if (updates.featured !== undefined) dbPayload.featured = updates.featured;

        await supabase.from("artworks").update(dbPayload).eq("id", id);
      } catch (err) {
        console.error("Supabase artwork update error:", err);
      }
    }
    return true;
  };

  const deleteArtwork = async (id: string): Promise<boolean> => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("artworks").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase artwork delete error:", err);
      }
    }
    return true;
  };

  const getFeaturedArtworks = () => {
    return artworks.filter((a) => a.featured);
  };

  const getAllArtworkTags = () => {
    return Array.from(new Set(artworks.flatMap((a) => a.tags))).sort();
  };

  // ─── Yorum İşlemleri (CRUD) ───────────────────────────────────────────
  const addComment = async (
    storyId: string,
    storyTitle: string,
    storySlug: string,
    content: string
  ): Promise<Comment | null> => {
    if (!currentUser) return null;

    const tempId = "comment-" + Date.now();
    const newComment: Comment = {
      id: tempId,
      storyId,
      storyTitle,
      storySlug,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorEmail: currentUser.email,
      authorRole: currentUser.role,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("comments")
          .insert({
            story_id: storyId.includes("-") && storyId.length === 36 ? storyId : undefined,
            story_title: storyTitle,
            story_slug: storySlug,
            user_id: currentUser.id.includes("-") && currentUser.id.length === 36 ? currentUser.id : undefined,
            user_email: currentUser.email,
            user_name: currentUser.name,
            user_role: currentUser.role,
            content: content.trim(),
          })
          .select()
          .single();

        if (error) {
          console.warn("Supabase comment insert notice:", error.message);
        } else if (data) {
          const mapped = mapCommentFromDb(data);
          setComments((prev) => prev.map((c) => (c.id === tempId ? mapped : c)));
          return mapped;
        }
      } catch (err) {
        console.error("Supabase comment error:", err);
      }
    }

    return newComment;
  };

  const updateComment = async (commentId: string, content: string): Promise<boolean> => {
    if (!currentUser) return false;

    const target = comments.find((c) => c.id === commentId);
    if (!target) return false;

    if (target.authorId !== currentUser.id && !isAdmin) {
      return false;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              content: content.trim(),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("comments")
          .update({
            content: content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", commentId);
      } catch (err) {
        console.error("Supabase comment update error:", err);
      }
    }

    return true;
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    if (!currentUser) return false;

    const target = comments.find((c) => c.id === commentId);
    if (!target) return false;

    if (target.authorId !== currentUser.id && !isAdmin) {
      return false;
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("comments").delete().eq("id", commentId);
      } catch (err) {
        console.error("Supabase comment delete error:", err);
      }
    }

    return true;
  };

  const getStoryComments = (storyId: string) => {
    return comments
      .filter((c) => c.storyId === storyId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  const getUserComments = (userId: string) => {
    return comments
      .filter((c) => c.authorId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  const resetToDefaults = () => {
    setStories(initialStories);
    setArtworks(initialArtworks);
    setComments(initialComments);
    localStorage.removeItem("app_stories");
    localStorage.removeItem("app_artworks");
    localStorage.removeItem("app_comments");
  };

  return (
    <DataContext.Provider
      value={{
        stories,
        artworks,
        comments,
        isLoading,
        isCloudConnected: isSupabaseConfigured,
        addStory,
        updateStory,
        deleteStory,
        getStoryBySlug,
        getFeaturedStories,
        getAllStoryTags,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        getFeaturedArtworks,
        getAllArtworkTags,
        addComment,
        updateComment,
        deleteComment,
        getStoryComments,
        getUserComments,
        seedInitialDataToSupabase,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
