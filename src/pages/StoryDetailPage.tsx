import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  FileText,
  Download,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { TagBadge } from "../components/stories/TagBadge";
import { StoryCard } from "../components/stories/StoryCard";
import { CommentsSection } from "../components/stories/CommentsSection";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { getStoryBySlug, stories } = useData();
  const { authorName } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const story = slug ? getStoryBySlug(slug) : undefined;

  if (!story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-serif text-2xl font-bold">Yazı Bulunamadı</h2>
        <p className={`text-sm ${isDark ? "text-dark-400" : "text-slate-500"}`}>
          Aradığınız hikaye silinmiş ya da taşınmış olabilir.
        </p>
        <Link
          to="/stories"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all"
        >
          ← Tüm Hikayelere Dön
        </Link>
      </div>
    );
  }

  const currentIdx = stories.findIndex((s) => s.id === story.id);
  const prevStory = currentIdx > 0 ? stories[currentIdx - 1] : null;
  const nextStory =
    currentIdx < stories.length - 1 ? stories[currentIdx + 1] : null;

  // İlgili hikayeler
  const related = stories
    .filter(
      (s) =>
        s.id !== story.id && s.tags.some((t) => story.tags.includes(t))
    )
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Kapak Görseli Banner */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Geri Butonu */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-white/90 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>
      </div>

      {/* Makale Okuma Alanı */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 pb-24">
        {/* Başlık Kartı */}
        <div
          className={`rounded-3xl p-6 sm:p-10 mb-10 border shadow-2xl ${
            isDark
              ? "bg-dark-900 border-dark-700/60 shadow-black/60"
              : "bg-white border-slate-200 shadow-slate-200/80"
          }`}
        >
          {/* Etiketler */}
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          {/* Başlık */}
          <h1
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 ${
              isDark ? "text-dark-50" : "text-slate-900"
            }`}
          >
            {story.title}
          </h1>

          {/* Özet */}
          <p
            className={`text-base sm:text-lg leading-relaxed mb-6 font-serif italic ${
              isDark ? "text-dark-300" : "text-slate-600"
            }`}
          >
            {story.excerpt}
          </p>

          {/* Meta Bilgileri */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 text-xs border-t pt-5 ${
              isDark
                ? "border-dark-700 text-dark-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 font-medium">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                  {authorName.substring(0, 2)}
                </div>
                {authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(story.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {story.readingTime} dakika okuma
              </span>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: story.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Yazı bağlantısı panoya kopyalandı!");
                }
              }}
              title="Bağlantıyı Paylaş"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-700 hover:bg-dark-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Paylaş
            </button>
          </div>
        </div>

        {/* PDF Eki Varsa İndirme / Görüntüleme Kutusu */}
        {story.pdfUrl && (
          <div
            className={`mb-8 p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              isDark
                ? "bg-brand-950/20 border-brand-500/30 text-dark-100"
                : "bg-brand-50/80 border-brand-200 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Orijinal PDF Dokümanı</h4>
                <p className={`text-xs ${isDark ? "text-dark-400" : "text-slate-500"}`}>
                  Bu hikaye PDF formatında yüklenmiştir. Orijinal dosyayı görüntüleyebilir veya indirebilirsiniz.
                </p>
              </div>
            </div>
            <a
              href={story.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`${story.slug}.pdf`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              PDF Olarak İndir / Aç
            </a>
          </div>
        )}

        {/* Zengin Metin Gövdesi */}
        <article
          className={`prose prose-lg max-w-none ${
            isDark ? "prose-DEFAULT" : "prose-light"
          } prose-headings:font-serif prose-headings:font-semibold prose-p:leading-[1.85] prose-p:text-base prose-blockquote:not-italic`}
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* Önceki / Sonraki Hikaye Navigasyonu */}
        <div
          className={`mt-16 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${
            isDark ? "border-dark-700/60" : "border-slate-200"
          }`}
        >
          {prevStory ? (
            <Link
              to={`/stories/${prevStory.slug}`}
              className={`group flex flex-col gap-1 p-5 rounded-2xl border transition-all ${
                isDark
                  ? "border-dark-700 hover:border-brand-500/40 hover:bg-dark-800/50"
                  : "border-slate-200 hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <span
                className={`flex items-center gap-1 text-xs ${
                  isDark ? "text-dark-500" : "text-slate-400"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Önceki Hikaye
              </span>
              <span
                className={`font-serif font-semibold text-sm group-hover:text-brand-400 transition-colors ${
                  isDark ? "text-dark-200" : "text-slate-700"
                }`}
              >
                {prevStory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextStory ? (
            <Link
              to={`/stories/${nextStory.slug}`}
              className={`group flex flex-col gap-1 p-5 rounded-2xl border text-right transition-all ${
                isDark
                  ? "border-dark-700 hover:border-brand-500/40 hover:bg-dark-800/50"
                  : "border-slate-200 hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <span
                className={`flex items-center justify-end gap-1 text-xs ${
                  isDark ? "text-dark-500" : "text-slate-400"
                }`}
              >
                Sonraki Hikaye
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span
                className={`font-serif font-semibold text-sm group-hover:text-brand-400 transition-colors ${
                  isDark ? "text-dark-200" : "text-slate-700"
                }`}
              >
                {nextStory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* İlgili Hikayeler */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3
              className={`font-serif text-2xl font-bold mb-6 ${
                isDark ? "text-dark-100" : "text-slate-800"
              }`}
            >
              Benzer Yazılar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((s, i) => (
                <StoryCard key={s.id} story={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* 💬 Yorum Bölümü & Topluluk Etkileşimi */}
        <CommentsSection story={story} />
      </div>
    </motion.div>
  );
}
