import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GalleryHorizontal, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { stories, artworks } = useData();
  const { authorName } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Ambiyans Parıltıları */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-4xl">
          {/* Rozet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
                isDark
                  ? "border-brand-500/30 bg-brand-500/10 text-brand-300"
                  : "border-brand-300 bg-brand-50 text-brand-600"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Yazar & Dijital İllüstratör
            </span>
          </motion.div>

          {/* Manşet Başlık */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 ${
              isDark ? "text-dark-50" : "text-slate-900"
            }`}
          >
            Sözcüklerle yazılan,{" "}
            <span className="gradient-text">çizgilerle</span>
            <br />
            yaşayan anlatılar.
          </motion.h1>

          {/* Biyografi Özeti */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg sm:text-xl leading-relaxed max-w-2xl mb-10 ${
              isDark ? "text-dark-300" : "text-slate-600"
            }`}
          >
            Ben <strong className={isDark ? "text-dark-100" : "text-slate-900"}>{authorName}</strong>. Dilin bittiği yerde başlayan görsel imgelerin ve fırçanın suskunluğunda konuşan kelimelerin peşindeyim. Burada kişisel denemelerimi, çizim serüvenlerimi ve açık hava eskizlerimi paylaşıyorum.
          </motion.p>

          {/* Eylem Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              Son Hikayeleri Oku
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/gallery"
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm border transition-all duration-200 hover:-translate-y-0.5 ${
                isDark
                  ? "border-dark-700 bg-dark-800/80 text-dark-200 hover:border-brand-500/50 hover:text-brand-300"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-600"
              }`}
            >
              <GalleryHorizontal className="w-4 h-4" />
              Sanat Galerisini Gez
            </Link>
          </motion.div>

          {/* Sayaçlar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`flex gap-8 mt-16 pt-8 border-t ${
              isDark ? "border-dark-700/60" : "border-slate-200"
            }`}
          >
            <div>
              <div className="font-serif font-bold text-2xl sm:text-3xl gradient-text">
                {stories.length}+
              </div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium">
                Deneme & Yazı
              </div>
            </div>

            <div>
              <div className="font-serif font-bold text-2xl sm:text-3xl gradient-text">
                {artworks.length}+
              </div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium">
                Orijinal İllüstrasyon
              </div>
            </div>

            <div>
              <div className="font-serif font-bold text-2xl sm:text-3xl gradient-text">
                20+
              </div>
              <div className="text-xs text-dark-400 mt-1 uppercase font-medium">
                Yıllık Zanaat
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
