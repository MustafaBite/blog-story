import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { GalleryHorizontal, X } from "lucide-react";
import { useData } from "../context/DataContext";
import { ArtworkCard } from "../components/gallery/ArtworkCard";
import { Lightbox } from "../components/gallery/Lightbox";
import type { Artwork } from "../types";
import { useTheme } from "../context/ThemeContext";

export function GalleryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { artworks, getAllArtworkTags } = useData();

  const [selected, setSelected] = useState<Artwork | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = getAllArtworkTags();

  const filtered = useMemo(() => {
    if (!activeTag) return artworks;
    return artworks.filter((a) => a.tags.includes(activeTag));
  }, [artworks, activeTag]);

  const handleNavigate = useCallback((artwork: Artwork) => {
    setSelected(artwork);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Sayfa Başlığı */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mb-3"
        >
          <GalleryHorizontal
            className={`w-5 h-5 ${
              isDark ? "text-brand-400" : "text-brand-600"
            }`}
          />
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-brand-400" : "text-brand-600"
            }`}
          >
            Orijinal Çizimler & İllüstrasyonlar
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`font-serif text-4xl sm:text-5xl font-bold mb-4 ${
            isDark ? "text-dark-50" : "text-slate-900"
          }`}
        >
          Dijital Sanat Galerisi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
            isDark ? "text-dark-400" : "text-slate-600"
          }`}
        >
          Dijital tablolar, açık hava mürekkep etütleri, konsept eskizler ve
          ışık çalışmaları. Bir esere tıklayarak yüksek çözünürlüklü haline ve
          arkasındaki hikayeye ulaşabilirsiniz.
        </motion.p>
      </div>

      {/* Etiket Filtreleri */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
            activeTag === null
              ? "bg-brand-500/20 border-brand-500/50 text-brand-300 font-semibold"
              : isDark
              ? "border-dark-700 bg-dark-800 text-dark-400 hover:text-dark-200"
              : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          }`}
        >
          Tüm Eserler ({artworks.length})
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              activeTag === tag
                ? "bg-brand-500/20 border-brand-500/50 text-brand-300 font-semibold"
                : isDark
                ? "border-dark-700 bg-dark-800 text-dark-400 hover:text-dark-200"
                : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Sayaç ve Filtre Temizleme */}
      <div className="flex items-center justify-between mb-6 text-xs text-dark-400">
        <span>{filtered.length} sanat eseri görüntüleniyor</span>
        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="inline-flex items-center gap-1 text-brand-400 hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            Filtreyi Temizle
          </button>
        )}
      </div>

      {/* Masonry Izgara */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {filtered.map((artwork, i) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className={`py-20 text-center rounded-3xl border ${
            isDark
              ? "border-dark-700/50 bg-dark-800/30"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <GalleryHorizontal
            className={`w-10 h-10 mx-auto mb-3 ${
              isDark ? "text-dark-600" : "text-slate-300"
            }`}
          />
          <p className={isDark ? "text-dark-400" : "text-slate-500"}>
            Bu kategoride henüz bir eser bulunmuyor.
          </p>
        </div>
      )}

      {/* Işık Kutusu / Modal */}
      <Lightbox
        artwork={selected}
        artworks={filtered}
        onClose={() => setSelected(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
