import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useData } from "../context/DataContext";
import { StoryCard } from "../components/stories/StoryCard";
import { StoryFilters } from "../components/stories/StoryFilters";
import { useTheme } from "../context/ThemeContext";

export function StoriesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { stories, getAllStoryTags } = useData();

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const allTags = getAllStoryTags();

  const filtered = useMemo(() => {
    let result = [...stories];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.excerpt.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeTag) {
      result = result.filter((s) => s.tags.includes(activeTag));
    }

    result.sort((a, b) => {
      const diff =
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

    return result;
  }, [stories, search, activeTag, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Sayfa Başlığı */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mb-3"
        >
          <BookOpen
            className={`w-5 h-5 ${
              isDark ? "text-brand-400" : "text-brand-600"
            }`}
          />
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-brand-400" : "text-brand-600"
            }`}
          >
            Yazılar & Denemeler
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
          Hikayeler ve Düşünceler
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
            isDark ? "text-dark-400" : "text-slate-600"
          }`}
        >
          Yaratıcı süreçler, sanat felsefesi, hafıza ve sessizce dikkat kesilme
          pratiği üzerine kaleme alınmış kişisel denemeler.
        </motion.p>
      </div>

      {/* Arama & Filtreler */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <StoryFilters
          search={search}
          onSearchChange={setSearch}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          allTags={allTags}
        />
      </motion.div>

      {/* Sonuç Sayacı */}
      <p
        className={`text-xs font-medium mb-6 ${
          isDark ? "text-dark-500" : "text-slate-400"
        }`}
      >
        Toplam {filtered.length} yazı listeleniyor
      </p>

      {/* Hikayeler Izgarası */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`py-20 text-center rounded-3xl border ${
            isDark
              ? "border-dark-700/50 bg-dark-800/30"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <BookOpen
            className={`w-10 h-10 mx-auto mb-3 ${
              isDark ? "text-dark-600" : "text-slate-300"
            }`}
          />
          <p
            className={`font-medium ${
              isDark ? "text-dark-300" : "text-slate-600"
            }`}
          >
            Aramanızla eşleşen bir hikaye bulunamadı.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTag(null);
            }}
            className="mt-3 text-xs font-semibold text-brand-400 hover:underline"
          >
            Filtreleri Temizle
          </button>
        </motion.div>
      )}
    </div>
  );
}
