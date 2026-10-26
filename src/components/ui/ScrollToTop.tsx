import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 focus-ring ${
        isDark
          ? "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-900/50"
          : "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
