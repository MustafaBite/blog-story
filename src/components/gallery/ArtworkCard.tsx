import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { Artwork } from "../../types";
import { TagBadge } from "../stories/TagBadge";
import { useTheme } from "../../context/ThemeContext";

interface ArtworkCardProps {
  artwork: Artwork;
  index?: number;
  onClick?: (artwork: Artwork) => void;
}

export function ArtworkCard({ artwork, index = 0, onClick }: ArtworkCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      className="break-inside-avoid mb-5"
    >
      <button
        onClick={() => onClick?.(artwork)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group w-full text-left rounded-3xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? "border-dark-700/60 bg-dark-800/40 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-black/50"
            : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100/50"
        }`}
      >
        {/* Görsel Alanı */}
        <div className="relative overflow-hidden bg-dark-700">
          {!loaded && (
            <div
              className="skeleton absolute inset-0"
              style={{ minHeight: 220 }}
            />
          )}
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full object-cover transition-all duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            } ${hovered ? "scale-105" : "scale-100"}`}
          />

          {/* Hover Katmanı */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ZoomIn className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tracking-wide">
                Hikayesini İncele
              </span>
            </div>
          </div>
        </div>

        {/* Eser Başlığı ve Etiketleri */}
        <div className="p-4 space-y-2">
          <h3
            className={`font-serif font-bold text-base leading-snug ${
              isDark ? "text-dark-100" : "text-slate-800"
            }`}
          >
            {artwork.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {artwork.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
