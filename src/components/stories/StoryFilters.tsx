import { Search, SortAsc, SortDesc, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface StoryFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  sortOrder: "newest" | "oldest";
  onSortChange: (s: "newest" | "oldest") => void;
  allTags: string[];
}

export function StoryFilters({
  search,
  onSearchChange,
  activeTag,
  onTagChange,
  sortOrder,
  onSortChange,
  allTags,
}: StoryFiltersProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputBase = `w-full pl-10 pr-4 py-3 rounded-2xl text-sm border transition-colors outline-none ${
    isDark
      ? "bg-dark-800/90 border-dark-600/60 text-dark-100 placeholder-dark-500 focus:border-brand-500"
      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-500 shadow-sm"
  }`;

  return (
    <div className="space-y-4">
      {/* Arama Çubuğu */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? "text-dark-500" : "text-slate-400"
          }`}
        />
        <input
          type="search"
          placeholder="Yazı başlığı, konu veya anahtar kelime ile arayın..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputBase}
        />
      </div>

      {/* Etiketler ve Sıralama Butonları */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onTagChange(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
            activeTag === null
              ? "bg-brand-500/20 border-brand-500/50 text-brand-300"
              : isDark
              ? "border-dark-700 bg-dark-800 text-dark-400 hover:text-dark-200"
              : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          }`}
        >
          Tüm Konular
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(activeTag === tag ? null : tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeTag === tag
                ? "bg-brand-500/20 border-brand-500/50 text-brand-300"
                : isDark
                ? "border-dark-700 bg-dark-800 text-dark-400 hover:text-dark-200"
                : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
            }`}
          >
            {tag}
          </button>
        ))}

        <div className="flex-1" />

        {/* Sıralama */}
        <button
          onClick={() =>
            onSortChange(sortOrder === "newest" ? "oldest" : "newest")
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            isDark
              ? "border-dark-700 bg-dark-800 text-dark-300 hover:border-brand-500/50"
              : "border-slate-200 bg-white text-slate-600 hover:border-brand-400"
          }`}
        >
          {sortOrder === "newest" ? (
            <SortDesc className="w-3.5 h-3.5 text-brand-400" />
          ) : (
            <SortAsc className="w-3.5 h-3.5 text-brand-400" />
          )}
          {sortOrder === "newest" ? "En Yeni" : "En Eski"}
        </button>

        {/* Temizle */}
        {(search || activeTag) && (
          <button
            onClick={() => {
              onSearchChange("");
              onTagChange(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Temizle
          </button>
        )}
      </div>
    </div>
  );
}
