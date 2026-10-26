// ─── Kullanıcı Rolleri & Modeli ─────────────────────────────────────────
export type UserRole = "admin" | "reader" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "reader";
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

// ─── Yorum Modeli ────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  storyId: string;
  storyTitle: string;
  storySlug: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorRole: "admin" | "reader";
  content: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}

// ─── Hikaye / Yazı Modeli ────────────────────────────────────────────────
export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Zengin metin / HTML
  coverImage: string;
  tags: string[];
  publishedAt: string; // ISO 8601
  readingTime: number; // dakika
  featured?: boolean;
  pdfUrl?: string; // İsteğe bağlı ekli PDF dosyası
}

// ─── Sanat Eseri Modeli ──────────────────────────────────────────────────
export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  highResUrl: string;
  tags: string[];
  createdAt: string; // ISO 8601
  medium: string; // Kullanılan teknik / araç
  featured?: boolean;
  aspectRatio?: "portrait" | "landscape" | "square";
}

// ─── Tema ────────────────────────────────────────────────────────────────
export type Theme = "dark" | "light";
