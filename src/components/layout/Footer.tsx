import { Link } from "react-router-dom";
import { PenLine, Heart, MessageCircle, Code2, Camera } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const socialLinks = [
  { icon: MessageCircle, href: "#", label: "Twitter / X" },
  { icon: Code2, href: "#", label: "GitHub" },
  { icon: Camera, href: "#", label: "Instagram" },
];

const footerLinks = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/stories", label: "Hikayeler" },
  { to: "/gallery", label: "Sanat Galerisi" },
  { to: "/about", label: "Hakkımda" },
];

export function Footer() {
  const { theme } = useTheme();
  const { authorName } = useAuth();
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t mt-24 ${
        isDark ? "border-dark-700/60" : "border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Marka Bilgisi */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <PenLine className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-serif font-semibold text-lg gradient-text">
                {authorName}
              </span>
            </Link>
            <p
              className={`text-xs max-w-xs text-center md:text-left leading-relaxed ${
                isDark ? "text-dark-400" : "text-slate-500"
              }`}
            >
              Yazar, dijital illüstratör ve kelimeler ile çizgilerin kesişiminde
              üreten bir hikaye anlatıcısı.
            </p>
          </div>

          {/* Menü Linkleri */}
          <nav className="flex items-center gap-6">
            {footerLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs font-medium transition-colors ${
                  isDark
                    ? "text-dark-400 hover:text-dark-100"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Sosyal Medya İkonları */}
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`p-2 rounded-xl transition-colors ${
                  isDark
                    ? "text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Alt Telif Yazısı */}
        <div
          className={`mt-8 pt-8 border-t text-center text-xs flex items-center justify-center gap-1.5 ${
            isDark
              ? "border-dark-700/60 text-dark-500"
              : "border-slate-200 text-slate-400"
          }`}
        >
          <span>© {new Date().getFullYear()} {authorName}. Sevgiyle ve</span>
          <Heart className="w-3 h-3 text-brand-500 fill-brand-500" />
          <span>taze demlenmiş kahveyle hazırlandı.</span>
        </div>
      </div>
    </footer>
  );
}
