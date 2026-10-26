import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Shield,
  BookOpen,
  GalleryHorizontal,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  RotateCcw,
  KeyRound,
  Database,
  Upload,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { uploadMediaFile } from "../lib/storage";
import { extractStoryFromPdf } from "../lib/pdfExtractor";
import type { Story, Artwork } from "../types";

export function AdminDashboardPage() {
  const { isAdmin, openChangePasswordModal } = useAuth();
  const {
    stories,
    artworks,
    comments,
    addStory,
    updateStory,
    deleteStory,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    deleteComment,
    seedInitialDataToSupabase,
    isCloudConnected,
    resetToDefaults,
  } = useData();

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"stories" | "artworks" | "comments">(
    "stories"
  );

  // ─── Hikaye Form Modal State ───────────────────────────────────────────
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isInsertingInlineImage, setIsInsertingInlineImage] = useState(false);
  const [isUploadingArt, setIsUploadingArt] = useState(false);

  const [storyForm, setStoryForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    readingTime: 5,
    featured: false,
    pdfUrl: "",
  });

  // ─── Eser Form Modal State ─────────────────────────────────────────────
  const [isArtModalOpen, setIsArtModalOpen] = useState(false);
  const [editingArtId, setEditingArtId] = useState<string | null>(null);
  const [artForm, setArtForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    highResUrl: "",
    medium: "",
    tags: "",
    featured: false,
  });

  // Yetkisiz Erişim: Bu uyarı sayfasını tamamen kaldırıp doğrudan ana sayfaya yönlendiriyoruz
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // ─── Hikaye Form İşlemleri ─────────────────────────────────────────────
  const openNewStory = () => {
    setEditingStoryId(null);
    setPdfStatus(null);
    setStoryForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "<p>Yeni hikayenizin içeriği buraya gelecek...</p>",
      coverImage:
        "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&q=80",
      tags: "Deneme, Sanat",
      readingTime: 5,
      featured: false,
      pdfUrl: "",
    });
    setIsStoryModalOpen(true);
  };

  const openEditStory = (story: Story) => {
    setEditingStoryId(story.id);
    setPdfStatus(null);
    setStoryForm({
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      content: story.content,
      coverImage: story.coverImage,
      tags: story.tags.join(", "),
      readingTime: story.readingTime,
      featured: !!story.featured,
      pdfUrl: story.pdfUrl || "",
    });
    setIsStoryModalOpen(true);
  };

  // PDF Dosyasından Otomatik Hikaye Yükleme
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setPdfStatus({
        message: "Lütfen geçerli bir .pdf dosyası seçin.",
        type: "error",
      });
      return;
    }

    try {
      setIsUploadingPdf(true);
      setPdfStatus({
        message: "PDF dosyası yükleniyor ve metinler ayrıştırılıyor...",
        type: "info",
      });

      // 1. PDF'i depolamaya yükle
      const uploadRes = await uploadMediaFile(file, "pdfs");

      // 2. PDF içeriğinden metni çıkar
      const extracted = await extractStoryFromPdf(file);

      // Form alanlarını doldur
      setStoryForm((prev) => ({
        ...prev,
        title: prev.title.trim() && prev.title !== "Örn: Sessizliğin Mimarisi" ? prev.title : extracted.title,
        excerpt: extracted.excerpt || prev.excerpt,
        content: extracted.content || prev.content,
        readingTime: extracted.readingTime || prev.readingTime,
        tags: prev.tags.trim() ? prev.tags : extracted.tags.join(", "),
        pdfUrl: uploadRes.url,
      }));

      setPdfStatus({
        message: extracted.hasText
          ? `✓ PDF başarıyla yüklendi! "${extracted.title}" başlığı ve metinler aktarıldı.`
          : `✓ PDF başarıyla eklendi! Doküman hikayeye iliştirildi.`,
        type: "success",
      });
    } catch (err) {
      console.error("PDF yükleme hatası:", err);
      setPdfStatus({
        message: "PDF işlenirken bir hata oluştu.",
        type: "error",
      });
    } finally {
      setIsUploadingPdf(false);
      e.target.value = "";
    }
  };

  // Kapak Resmi Dosyası Yükleme
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const res = await uploadMediaFile(file, "stories");
      if (res.url) {
        setStoryForm((prev) => ({ ...prev, coverImage: res.url }));
      }
    } catch (err) {
      console.error("Kapak resmi yüklenemedi:", err);
      alert("Kapak resmi yüklenirken bir hata oluştu.");
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  // İçeriğe Görsel Ekleme
  const handleInlineImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsInsertingInlineImage(true);
      const res = await uploadMediaFile(file, "stories");
      if (res.url) {
        const figureHtml = `\n<figure class="my-8">\n  <img src="${res.url}" alt="${file.name.replace(/\.[^/.]+$/, "")}" class="w-full max-h-[500px] object-cover rounded-2xl shadow-lg border border-dark-700/60" />\n  <figcaption class="text-center text-xs text-dark-400 mt-2.5 italic">Görsel: ${file.name}</figcaption>\n</figure>\n`;
        setStoryForm((prev) => ({
          ...prev,
          content: prev.content + figureHtml,
        }));
      }
    } catch (err) {
      console.error("İçerik görseli eklenemedi:", err);
      alert("Görsel eklenirken bir hata oluştu.");
    } finally {
      setIsInsertingInlineImage(false);
      e.target.value = "";
    }
  };

  // Sanat Eseri Görseli Yükleme
  const handleArtImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isHighRes = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingArt(true);
      const res = await uploadMediaFile(file, "artworks");
      if (res.url) {
        setArtForm((prev) => ({
          ...prev,
          imageUrl: isHighRes ? prev.imageUrl || res.url : res.url,
          highResUrl: isHighRes ? res.url : prev.highResUrl || res.url,
        }));
      }
    } catch (err) {
      console.error("Eser görseli yüklenemedi:", err);
    } finally {
      setIsUploadingArt(false);
      e.target.value = "";
    }
  };

  const saveStory = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = storyForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const slug =
      storyForm.slug.trim() ||
      storyForm.title
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (editingStoryId) {
      updateStory(editingStoryId, {
        title: storyForm.title,
        slug,
        excerpt: storyForm.excerpt,
        content: storyForm.content,
        coverImage: storyForm.coverImage,
        tags: tagList,
        readingTime: Number(storyForm.readingTime),
        featured: storyForm.featured,
        pdfUrl: storyForm.pdfUrl || undefined,
      });
    } else {
      addStory({
        title: storyForm.title,
        slug,
        excerpt: storyForm.excerpt,
        content: storyForm.content,
        coverImage: storyForm.coverImage,
        tags: tagList,
        readingTime: Number(storyForm.readingTime),
        publishedAt: new Date().toISOString(),
        featured: storyForm.featured,
        pdfUrl: storyForm.pdfUrl || undefined,
      });
    }
    setIsStoryModalOpen(false);
  };

  // ─── Eser Form İşlemleri ───────────────────────────────────────────────
  const openNewArt = () => {
    setEditingArtId(null);
    setArtForm({
      title: "",
      description: "",
      imageUrl:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
      highResUrl:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1600&q=90",
      medium: "Dijital — Procreate & iPad Pro",
      tags: "Dijital Resim, Konsept",
      featured: false,
    });
    setIsArtModalOpen(true);
  };

  const openEditArt = (art: Artwork) => {
    setEditingArtId(art.id);
    setArtForm({
      title: art.title,
      description: art.description,
      imageUrl: art.imageUrl,
      highResUrl: art.highResUrl,
      medium: art.medium,
      tags: art.tags.join(", "),
      featured: !!art.featured,
    });
    setIsArtModalOpen(true);
  };

  const saveArt = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = artForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArtId) {
      updateArtwork(editingArtId, {
        title: artForm.title,
        description: artForm.description,
        imageUrl: artForm.imageUrl,
        highResUrl: artForm.highResUrl || artForm.imageUrl,
        medium: artForm.medium,
        tags: tagList,
        featured: artForm.featured,
      });
    } else {
      addArtwork({
        title: artForm.title,
        description: artForm.description,
        imageUrl: artForm.imageUrl,
        highResUrl: artForm.highResUrl || artForm.imageUrl,
        medium: artForm.medium,
        tags: tagList,
        createdAt: new Date().toISOString(),
        featured: artForm.featured,
        aspectRatio: "portrait",
      });
    }
    setIsArtModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Üst Başlık & İstatistikler */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-dark-700/60">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Yönetim & Moderasyon
            </div>

            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Bulut Bağlantısı Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-700 text-dark-300 text-xs">
                Yerel Mod
              </span>
            )}
          </div>
          <h1
            className={`font-serif text-3xl sm:text-4xl font-bold ${
              isDark ? "text-dark-50" : "text-slate-900"
            }`}
          >
            Yönetici Kontrol Paneli
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-dark-400" : "text-slate-500"
            }`}
          >
            Yazıları oluşturun, sanat galerisini güncelleyin ve okuyucu
            yorumlarını denetleyin.
          </p>
        </div>

        {/* Hızlı İstatistik Kartları */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-3 rounded-2xl border text-center min-w-[90px] ${
              isDark
                ? "bg-dark-800/80 border-dark-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="text-xl font-bold font-serif gradient-text">
              {stories.length}
            </div>
            <div className="text-[11px] text-dark-400 uppercase">Hikaye</div>
          </div>

          <div
            className={`px-4 py-3 rounded-2xl border text-center min-w-[90px] ${
              isDark
                ? "bg-dark-800/80 border-dark-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="text-xl font-bold font-serif gradient-text">
              {artworks.length}
            </div>
            <div className="text-[11px] text-dark-400 uppercase">Eser</div>
          </div>

          <div
            className={`px-4 py-3 rounded-2xl border text-center min-w-[90px] ${
              isDark
                ? "bg-dark-800/80 border-dark-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="text-xl font-bold font-serif gradient-text">
              {comments.length}
            </div>
            <div className="text-[11px] text-dark-400 uppercase">Yorum</div>
          </div>

          {/* Supabase'e Aktarma Butonu */}
          {isCloudConnected && (
            <button
              onClick={async () => {
                if (
                  window.confirm(
                    "Mevcut 6 hikaye ve 9 eseri Supabase veritabanınıza yüklemek istiyor musunuz?"
                  )
                ) {
                  setSeeding(true);
                  const ok = await seedInitialDataToSupabase();
                  setSeeding(false);
                  if (ok) {
                    setSeedSuccess(true);
                    setTimeout(() => setSeedSuccess(false), 3000);
                  }
                }
              }}
              disabled={seeding}
              title="Başlangıç Hikaye ve Eserlerini Supabase'e Aktar"
              className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border text-xs font-semibold transition-all ${
                seedSuccess
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "border-dark-700 bg-dark-800 text-brand-300 hover:bg-dark-700"
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">
                {seeding
                  ? "Yükleniyor..."
                  : seedSuccess
                  ? "Buluta Aktarıldı!"
                  : "Verileri Supabase'e Yükle"}
              </span>
            </button>
          )}

          {/* Şifre Değiştir Butonu */}
          <button
            onClick={() => openChangePasswordModal()}
            title="Yönetici Şifresini Değiştir"
            className="p-3 rounded-2xl border border-dark-700 text-dark-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-dark-800 transition-colors"
          >
            <KeyRound className="w-5 h-5" />
          </button>

          {/* Varsayılana Sıfırla Butonu */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Tüm mock verilerini varsayılana sıfırlamak istiyor musunuz?"
                )
              ) {
                resetToDefaults();
              }
            }}
            title="Verileri Fabrika Ayarlarına Döndür"
            className="p-3 rounded-2xl border border-dark-700 text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sekme Menüsü */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-dark-800/80 border border-dark-700/80">
          <button
            onClick={() => setActiveTab("stories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "stories"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "text-dark-400 hover:text-dark-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Hikayeler ({stories.length})
          </button>

          <button
            onClick={() => setActiveTab("artworks")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "artworks"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "text-dark-400 hover:text-dark-100"
            }`}
          >
            <GalleryHorizontal className="w-4 h-4" />
            Galeri & Eserler ({artworks.length})
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "comments"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "text-dark-400 hover:text-dark-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Yorum Moderasyonu ({comments.length})
          </button>
        </div>

        {/* Ekleme Aksiyon Butonu */}
        {activeTab === "stories" && (
          <button
            onClick={openNewStory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Yeni Hikaye Yaz
          </button>
        )}

        {activeTab === "artworks" && (
          <button
            onClick={openNewArt}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Yeni Eser Ekle
          </button>
        )}
      </div>

      {/* ─── 1. SEKME: HİKAYELER LİSTESİ ───────────────────────────────────── */}
      {activeTab === "stories" && (
        <div
          className={`rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-dark-800/50 border-dark-700/60"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`text-xs uppercase border-b ${
                  isDark
                    ? "bg-dark-800 text-dark-400 border-dark-700"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                <tr>
                  <th className="px-6 py-4">Kapak & Başlık</th>
                  <th className="px-6 py-4">Etiketler</th>
                  <th className="px-6 py-4">Okuma Süresi</th>
                  <th className="px-6 py-4">Yayın Tarihi</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/40">
                {stories.map((story) => (
                  <tr
                    key={story.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-dark-800/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="font-semibold font-serif text-base">
                            {story.title}
                          </div>
                          <span className="text-xs text-dark-400">
                            /{story.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {story.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-dark-700 text-dark-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-xs">
                      {story.readingTime} dk
                    </td>
                    <td className="px-6 py-4 text-dark-400 text-xs">
                      {new Date(story.publishedAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/stories/${story.slug}`}
                          target="_blank"
                          title="Sitede Gör"
                          className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditStory(story)}
                          title="Düzenle"
                          className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `"${story.title}" yazısını silmek istediğinize emin misiniz?`
                              )
                            ) {
                              deleteStory(story.id);
                            }
                          }}
                          title="Sil"
                          className="p-2 rounded-lg text-dark-400 hover:text-rose-400 hover:bg-dark-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 2. SEKME: SANAT ESERLERİ LİSTESİ ──────────────────────────────── */}
      {activeTab === "artworks" && (
        <div
          className={`rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-dark-800/50 border-dark-700/60"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`text-xs uppercase border-b ${
                  isDark
                    ? "bg-dark-800 text-dark-400 border-dark-700"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                <tr>
                  <th className="px-6 py-4">Önizleme & Başlık</th>
                  <th className="px-6 py-4">Teknik & Araç</th>
                  <th className="px-6 py-4">Etiketler</th>
                  <th className="px-6 py-4">Eklenme Tarihi</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/40">
                {artworks.map((art) => (
                  <tr
                    key={art.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-dark-800/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="font-semibold font-serif text-base">
                            {art.title}
                          </div>
                          <p className="text-xs text-dark-400 line-clamp-1 max-w-sm">
                            {art.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-xs">
                      {art.medium}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {art.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-dark-700 text-dark-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-400 text-xs">
                      {new Date(art.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={art.highResUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Görseli Aç"
                          className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditArt(art)}
                          title="Düzenle"
                          className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `"${art.title}" adlı eseri silmek istediğinizden emin misiniz?`
                              )
                            ) {
                              deleteArtwork(art.id);
                            }
                          }}
                          title="Sil"
                          className="p-2 rounded-lg text-dark-400 hover:text-rose-400 hover:bg-dark-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 3. SEKME: YORUM MODERASYON MERKEZİ ────────────────────────────── */}
      {activeTab === "comments" && (
        <div
          className={`rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-dark-800/50 border-dark-700/60"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="p-4 bg-brand-500/10 border-b border-brand-500/20 text-xs text-brand-300 flex items-center justify-between">
            <span>
              🛡️ Yönetici yetkisi ile topluluk kurallarına aykırı tüm yorumları
              buradan anında kaldırabilirsiniz.
            </span>
            <span className="font-semibold">Toplam {comments.length} Yorum</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`text-xs uppercase border-b ${
                  isDark
                    ? "bg-dark-800 text-dark-400 border-dark-700"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                <tr>
                  <th className="px-6 py-4">Okuyucu</th>
                  <th className="px-6 py-4">İlgili Hikaye</th>
                  <th className="px-6 py-4">Yorum İçeriği</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4 text-right">Moderasyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/40">
                {comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-dark-800/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-sm">
                          {comment.authorName}
                        </div>
                        <div className="text-xs text-dark-400">
                          {comment.authorEmail}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 text-dark-300">
                          {comment.authorRole}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/stories/${comment.storySlug}`}
                        target="_blank"
                        className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        {comment.storyTitle}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-xs leading-relaxed text-dark-200 line-clamp-3">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-dark-400">
                      {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Bu yorumu moderasyon kararıyla kaldırmak istiyor musunuz?`
                            )
                          ) {
                            deleteComment(comment.id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Yorumu Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── HİKAYE FORMU MODALI (EKLE / DÜZENLE) ──────────────────────────── */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-3xl rounded-2xl p-6 sm:p-8 my-8 border shadow-2xl ${
              isDark ? "bg-dark-900 border-dark-700 text-dark-100" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-700">
              <h2 className="font-serif text-xl font-bold">
                {editingStoryId ? "Hikayeyi Düzenle" : "Yeni Hikaye / Yazı Ekle"}
              </h2>
              <button
                onClick={() => setIsStoryModalOpen(false)}
                className="p-1 rounded-lg text-dark-400 hover:text-dark-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveStory} className="space-y-4">
              {/* ─── PDF ile Otomatik Yükleme Alanı ─── */}
              <div className="p-4 rounded-2xl border border-dashed border-brand-500/40 bg-brand-500/5 hover:bg-brand-500/10 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                          PDF ile Otomatik Hikaye Yükle
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-medium">
                          Akıllı Aktarım
                        </span>
                      </div>
                      <p className="text-xs text-dark-300 mt-0.5">
                        Cihazınızdan bir .pdf seçin; başlık, özet ve içerik otomatik aktarılacaktır.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white cursor-pointer transition-all shadow-md shadow-brand-600/30">
                      {isUploadingPdf ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          PDF Çözümleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          PDF Dosyası Seç
                        </>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        disabled={isUploadingPdf}
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* PDF Durum Bildirimi */}
                {pdfStatus && (
                  <div
                    className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      pdfStatus.type === "success"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : pdfStatus.type === "error"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {pdfStatus.type === "success" && (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    )}
                    {pdfStatus.type === "error" && (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    {pdfStatus.type === "info" && (
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    )}
                    <span>{pdfStatus.message}</span>
                  </div>
                )}

                {/* Ekli PDF Bilgisi */}
                {storyForm.pdfUrl && (
                  <div className="mt-3 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-300">
                    <span className="flex items-center gap-1.5 truncate max-w-md">
                      <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                      Ekli Doküman:{" "}
                      <span className="text-dark-100 font-mono text-[11px] truncate">
                        {storyForm.pdfUrl}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setStoryForm((prev) => ({ ...prev, pdfUrl: "" }))
                      }
                      className="text-rose-400 hover:text-rose-300 text-xs font-medium ml-2"
                    >
                      PDF'i Kaldır
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    required
                    value={storyForm.title}
                    onChange={(e) =>
                      setStoryForm({ ...storyForm, title: e.target.value })
                    }
                    placeholder="Örn: Sessizliğin Mimarisi"
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Slug (URL uzantısı)
                  </label>
                  <input
                    type="text"
                    value={storyForm.slug}
                    onChange={(e) =>
                      setStoryForm({ ...storyForm, slug: e.target.value })
                    }
                    placeholder="sessizligin-mimarisi"
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Özet</label>
                <textarea
                  rows={2}
                  required
                  value={storyForm.excerpt}
                  onChange={(e) =>
                    setStoryForm({ ...storyForm, excerpt: e.target.value })
                  }
                  placeholder="Yazının kısa bir tanıtım paragrafı..."
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                />
              </div>

              {/* Kapak Resmi Alanı */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold">
                    Kapak Resmi
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 cursor-pointer font-medium">
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Resim Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Cihazdan Resim Seç / Yükle
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingCover}
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={storyForm.coverImage}
                    onChange={(e) =>
                      setStoryForm({ ...storyForm, coverImage: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/... veya yukarıdan yükleyin"
                    className="flex-1 px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                  {storyForm.coverImage && (
                    <div className="relative group w-14 h-10 rounded-lg overflow-hidden border border-dark-700 flex-shrink-0 bg-dark-800">
                      <img
                        src={storyForm.coverImage}
                        alt="Önizleme"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Etiketler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={storyForm.tags}
                    onChange={(e) =>
                      setStoryForm({ ...storyForm, tags: e.target.value })
                    }
                    placeholder="Deneme, Tasarım, Felsefe"
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Okuma Süresi (Dakika)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={storyForm.readingTime}
                    onChange={(e) =>
                      setStoryForm({
                        ...storyForm,
                        readingTime: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* İçerik Editörü ve Görsel Ekleme Araç Çubuğu */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-semibold">
                    İçerik (HTML destekli)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-800 hover:bg-dark-700 text-brand-300 border border-dark-700 cursor-pointer transition-all shadow-sm">
                      {isInsertingInlineImage ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Görsel Ekleniyor...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5" />
                          Metne Görsel Ekle
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isInsertingInlineImage}
                        onChange={handleInlineImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setStoryForm((prev) => ({
                          ...prev,
                          content:
                            prev.content +
                            '\n<h2 class="text-2xl font-serif font-bold mt-8 mb-4">Yeni Ara Başlık</h2>\n',
                        }))
                      }
                      className="px-2 py-1 rounded-lg text-xs font-medium bg-dark-800 hover:bg-dark-700 text-dark-300 border border-dark-700 transition-colors"
                    >
                      + Başlık
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStoryForm((prev) => ({
                          ...prev,
                          content:
                            prev.content +
                            '\n<blockquote class="border-l-4 border-brand-500 pl-4 py-2 my-6 italic text-dark-300">Önemli alıntı metni...</blockquote>\n',
                        }))
                      }
                      className="px-2 py-1 rounded-lg text-xs font-medium bg-dark-800 hover:bg-dark-700 text-dark-300 border border-dark-700 transition-colors"
                    >
                      + Alıntı
                    </button>
                  </div>
                </div>
                <textarea
                  rows={8}
                  required
                  value={storyForm.content}
                  onChange={(e) =>
                    setStoryForm({ ...storyForm, content: e.target.value })
                  }
                  placeholder="<p>Paragraflar, <h2>Başlıklar</h2> vb.</p>"
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={storyForm.featured}
                  onChange={(e) =>
                    setStoryForm({ ...storyForm, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="featured" className="text-xs font-medium">
                  Ana sayfada öne çıkanlar arasında göster
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm border border-dark-700 text-dark-300 hover:bg-dark-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white"
                >
                  {editingStoryId ? "Değişiklikleri Kaydet" : "Hikayeyi Yayınla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ESER FORMU MODALI (EKLE / DÜZENLE) ────────────────────────────── */}
      {isArtModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-2xl p-6 sm:p-8 my-8 border shadow-2xl ${
              isDark ? "bg-dark-900 border-dark-700 text-dark-100" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-700">
              <h2 className="font-serif text-xl font-bold">
                {editingArtId ? "Eseri Düzenle" : "Yeni Sanat Eseri Ekle"}
              </h2>
              <button
                onClick={() => setIsArtModalOpen(false)}
                className="p-1 rounded-lg text-dark-400 hover:text-dark-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveArt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Eser Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={artForm.title}
                  onChange={(e) =>
                    setArtForm({ ...artForm, title: e.target.value })
                  }
                  placeholder="Örn: Eşik Mavisi"
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Eser Açıklaması / Arkasındaki Hikaye
                </label>
                <textarea
                  rows={3}
                  required
                  value={artForm.description}
                  onChange={(e) =>
                    setArtForm({ ...artForm, description: e.target.value })
                  }
                  placeholder="Eserin temasını ve ardındaki düşünceyi anlatın..."
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold">
                      Önizleme Resim URL
                    </label>
                    <label className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 cursor-pointer font-medium">
                      {isUploadingArt ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      Cihazdan Yükle
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingArt}
                        onChange={(e) => handleArtImageUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    required
                    value={artForm.imageUrl}
                    onChange={(e) =>
                      setArtForm({ ...artForm, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold">
                      Yüksek Çözünürlük URL
                    </label>
                    <label className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 cursor-pointer font-medium">
                      {isUploadingArt ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      Cihazdan Yükle
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingArt}
                        onChange={(e) => handleArtImageUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={artForm.highResUrl}
                    onChange={(e) =>
                      setArtForm({ ...artForm, highResUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Kullanılan Teknik & Araç
                  </label>
                  <input
                    type="text"
                    required
                    value={artForm.medium}
                    onChange={(e) =>
                      setArtForm({ ...artForm, medium: e.target.value })
                    }
                    placeholder="Dijital — Procreate"
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Etiketler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={artForm.tags}
                    onChange={(e) =>
                      setArtForm({ ...artForm, tags: e.target.value })
                    }
                    placeholder="Dijital Resim, Doğa"
                    className="w-full px-3 py-2 rounded-xl text-sm border bg-dark-800 border-dark-700 text-dark-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredArt"
                  checked={artForm.featured}
                  onChange={(e) =>
                    setArtForm({ ...artForm, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="featuredArt" className="text-xs font-medium">
                  Ana sayfadaki öne çıkan seride göster
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setIsArtModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm border border-dark-700 text-dark-300 hover:bg-dark-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white"
                >
                  {editingArtId ? "Değişiklikleri Kaydet" : "Eseri Galeriye Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
