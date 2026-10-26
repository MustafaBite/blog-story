import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "../../context/DataContext";
import { StoryCard } from "../stories/StoryCard";
import { useTheme } from "../../context/ThemeContext";

export function FeaturedStories() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { getFeaturedStories } = useData();
  const featured = getFeaturedStories();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
            Seçkiler & Son Yazılar
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
            Öne Çıkan Hikayeler
          </motion.h2>
        </div>

        <Link
          to="/stories"
          className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors ${
            isDark
              ? "text-dark-400 hover:text-brand-400"
              : "text-slate-500 hover:text-brand-600"
          }`}
        >
          Tüm yazıları gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3'lü Izgara */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((story, i) => (
          <StoryCard key={story.id} story={story} index={i} />
        ))}
      </div>

      {/* Mobilde Tümünü Gör Linki */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300"
        >
          Tüm hikayeleri inceleyin
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
