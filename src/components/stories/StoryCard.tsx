import { Link } from "react-router-dom";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Story } from "../../types";
import { TagBadge } from "./TagBadge";
import { useTheme } from "../../context/ThemeContext";

interface StoryCardProps {
  story: Story;
  index?: number;
}

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

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? "border-dark-700/60 bg-dark-800/40 hover:border-brand-500/40 hover:bg-dark-800/80 shadow-sm"
          : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50"
      }`}
    >
      {/* Kapak Görseli */}
      <Link
        to={`/stories/${story.slug}`}
        className="block overflow-hidden aspect-[16/10] bg-dark-700 relative"
      >
        <img
          src={story.coverImage}
          alt={story.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* İçerik */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Etiketler */}
        <div className="flex flex-wrap gap-1.5">
          {story.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Başlık */}
        <Link to={`/stories/${story.slug}`}>
          <h3
            className={`font-serif font-bold text-xl leading-snug transition-colors group-hover:text-brand-400 ${
              isDark ? "text-dark-50" : "text-slate-900"
            }`}
          >
            {story.title}
          </h3>
        </Link>

        {/* Özet */}
        <p
          className={`text-sm leading-relaxed line-clamp-3 flex-1 ${
            isDark ? "text-dark-300" : "text-slate-600"
          }`}
        >
          {story.excerpt}
        </p>

        {/* Alt Meta */}
        <div
          className={`flex items-center justify-between pt-4 border-t text-xs ${
            isDark
              ? "border-dark-700/60 text-dark-400"
              : "border-slate-100 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(story.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {story.readingTime} dk okuma
            </span>
          </div>

          <Link
            to={`/stories/${story.slug}`}
            className="flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors font-semibold"
          >
            Yazıyı Oku
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
