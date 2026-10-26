import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Palette,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { Artwork } from "../../types";
import { TagBadge } from "../stories/TagBadge";
import { useTheme } from "../../context/ThemeContext";

interface LightboxProps {
  artwork: Artwork | null;
  artworks: Artwork[];
  onClose: () => void;
  onNavigate: (artwork: Artwork) => void;
}

export function Lightbox({
  artwork,
  artworks,
  onClose,
  onNavigate,
}: LightboxProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dialogRef = useRef<HTMLDivElement>(null);

  const currentIndex = artwork
    ? artworks.findIndex((a) => a.id === artwork.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < artworks.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(artworks[currentIndex + 1]);
  }, [hasNext, artworks, currentIndex, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(artworks[currentIndex - 1]);
  }, [hasPrev, artworks, currentIndex, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    if (artwork) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [artwork, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={artwork.title}
        >
          {/* Arka Plan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Gövdesi */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative z-10 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] ${
              isDark
                ? "bg-dark-900 border border-dark-700/60"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Görsel Tarafı */}
            <div className="lg:flex-1 relative bg-black/95 min-h-[40vh] lg:min-h-0 flex items-center justify-center p-4">
              <img
                key={artwork.id}
                src={artwork.highResUrl}
                alt={artwork.title}
                className="max-w-full max-h-full object-contain select-none"
                style={{ maxHeight: "75vh" }}
              />

              {/* Önceki / Sonraki Butonları */}
              {hasPrev && (
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all border border-white/10"
                  aria-label="Önceki eser"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {hasNext && (
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all border border-white/10"
                  aria-label="Sonraki eser"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bilgi & Hikaye Paneli */}
            <div
              className={`lg:w-96 flex flex-col overflow-y-auto ${
                isDark
                  ? "border-t lg:border-t-0 lg:border-l border-dark-700/60"
                  : "border-t lg:border-t-0 lg:border-l border-slate-200"
              }`}
            >
              {/* Başlık & Kapat */}
              <div
                className={`p-6 border-b ${
                  isDark ? "border-dark-700/60" : "border-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                      Eser Detayı
                    </span>
                    <h2
                      className={`font-serif font-bold text-xl leading-snug mt-1 ${
                        isDark ? "text-dark-50" : "text-slate-900"
                      }`}
                    >
                      {artwork.title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? "text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                    aria-label="Kapat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Hikaye & Detaylar */}
              <div className="flex-1 p-6 space-y-6">
                <div>
                  <h4
                    className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDark ? "text-dark-400" : "text-slate-400"
                    }`}
                  >
                    Eserin Hikayesi
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-dark-200" : "text-slate-600"
                    }`}
                  >
                    {artwork.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-dark-700/40">
                  <div className="flex items-center gap-2.5">
                    <Calendar
                      className={`w-4 h-4 flex-shrink-0 ${
                        isDark ? "text-dark-500" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isDark ? "text-dark-300" : "text-slate-600"
                      }`}
                    >
                      Üretim Tarihi:{" "}
                      {new Date(artwork.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Palette
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        isDark ? "text-dark-500" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isDark ? "text-dark-300" : "text-slate-600"
                      }`}
                    >
                      {artwork.medium}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {artwork.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>

              {/* Alt Buton */}
              <div
                className={`p-6 border-t ${
                  isDark ? "border-dark-700/60" : "border-slate-100"
                }`}
              >
                <a
                  href={artwork.highResUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-600/30"
                >
                  <ExternalLink className="w-4 h-4" />
                  Tam Çözünürlükte İncele
                </a>
                <p
                  className={`mt-3 text-center text-xs ${
                    isDark ? "text-dark-500" : "text-slate-400"
                  }`}
                >
                  {currentIndex + 1} / {artworks.length}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
