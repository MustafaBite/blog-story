import { useTheme } from "../../context/ThemeContext";

interface TagBadgeProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
}

// Deterministic color per tag
const TAG_COLORS: Record<string, string> = {
  Essay: "brand",
  Journal: "violet",
  Design: "sky",
  Philosophy: "indigo",
  Painting: "amber",
  Nature: "emerald",
  "Creative Process": "teal",
  Craft: "orange",
  Memory: "rose",
  Psychology: "pink",
  Mindfulness: "green",
  Sketches: "amber",
  "Digital Painting": "violet",
  Conceptual: "purple",
  Portraits: "rose",
  Commission: "orange",
  Urban: "slate",
  Travel: "sky",
  "Light Study": "yellow",
  "Concept Art": "indigo",
  "Sci-Fi": "blue",
  "Personal Project": "teal",
  Botanical: "green",
  "Detail Work": "emerald",
  Series: "purple",
  "Figure Study": "amber",
  Practice: "slate",
};

const COLOR_MAP: Record<string, string> = {
  brand:
    "bg-brand-500/15 text-brand-400 border-brand-500/30 hover:bg-brand-500/25",
  violet:
    "bg-violet-500/15 text-violet-400 border-violet-500/30 hover:bg-violet-500/25",
  sky: "bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25",
  indigo:
    "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/25",
  amber:
    "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25",
  emerald:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25",
  teal: "bg-teal-500/15 text-teal-400 border-teal-500/30 hover:bg-teal-500/25",
  orange:
    "bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25",
  rose: "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25",
  pink: "bg-pink-500/15 text-pink-400 border-pink-500/30 hover:bg-pink-500/25",
  green:
    "bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25",
  yellow:
    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25",
  purple:
    "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25",
  slate:
    "bg-slate-500/15 text-slate-400 border-slate-500/30 hover:bg-slate-500/25",
};

// Light mode variants
const COLOR_MAP_LIGHT: Record<string, string> = {
  brand:
    "bg-brand-100 text-brand-700 border-brand-200 hover:bg-brand-200",
  violet:
    "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200",
  sky: "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200",
  indigo:
    "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
  emerald:
    "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200",
  orange:
    "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
  green: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  yellow:
    "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  purple:
    "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
};

export function TagBadge({ tag, active, onClick }: TagBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colorKey = TAG_COLORS[tag] ?? "brand";
  const map = isDark ? COLOR_MAP : COLOR_MAP_LIGHT;
  const colorClass = map[colorKey] ?? map.brand;

  const activeClass = active
    ? isDark
      ? "ring-2 ring-current"
      : "ring-2 ring-current"
    : "";

  return (
    <span
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick ? (e) => e.key === "Enter" && onClick() : undefined
      }
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 ${colorClass} ${activeClass} ${
        onClick ? "cursor-pointer select-none" : ""
      }`}
    >
      {tag}
    </span>
  );
}
