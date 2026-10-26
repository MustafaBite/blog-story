import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "../../context/DataContext";
import { ArtworkCard } from "../gallery/ArtworkCard";
import { Lightbox } from "../gallery/Lightbox";
import type { Artwork } from "../../types";
import { useTheme } from "../../context/ThemeContext";

export function FeaturedArtworks() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { getFeaturedArtworks, artworks } = useData();
  const featured = getFeaturedArtworks();
  const [selected, setSelected] = useState<Artwork | null>(null);

  const handleNavigate = useCallback((artwork: Artwork) => {
    setSelected(artwork);
  }, []);

  return (
    <section className={`py-20 ${isDark ? "bg-dark-800/25" : "bg-slate-100/60"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bölüm Başlığı */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? "text-brand-400" : "text-brand-600"
              }`}
            >
              Atölyeden Yeni İşler
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className={`font-serif text-3xl sm:text-4xl font-bold ${
                isDark ? "text-dark-50" : "text-slate-900"
              }`}
            >
              Öne Çıkan İllüstrasyonlar
            </motion.h2>
          </div>

          <Link
            to="/gallery"
            className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors ${
              isDark
                ? "text-dark-400 hover:text-brand-400"
                : "text-slate-500 hover:text-brand-600"
            }`}
          >
            Tüm galeriyi aç
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3'lü Izgara */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((artwork, i) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              index={i}
              onClick={setSelected}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300"
          >
            Tüm galeriyi görüntüleyin
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Lightbox
        artwork={selected}
        artworks={artworks}
        onClose={() => setSelected(null)}
        onNavigate={handleNavigate}
      />
    </section>
  );
}
