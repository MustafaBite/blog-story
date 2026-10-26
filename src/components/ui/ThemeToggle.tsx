import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative p-2 rounded-lg transition-all duration-200 focus-ring ${
        isDark
          ? "text-dark-300 hover:text-dark-50 hover:bg-dark-700"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      <span className="relative block w-5 h-5">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 rotate-0" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 rotate-0" />
        )}
      </span>
    </button>
  );
}
