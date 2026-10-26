import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  PenLine,
  GalleryHorizontal,
  BookOpen,
  Home,
  User as UserIcon,
  Menu,
  X,
  Shield,
  MessageSquare,
  LogOut,
  LogIn,
  KeyRound,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Ana Sayfa", icon: Home },
  { to: "/stories", label: "Hikayeler", icon: BookOpen },
  { to: "/gallery", label: "Galeri", icon: GalleryHorizontal },
  { to: "/about", label: "Hakkımda", icon: UserIcon },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    authorName,
    openAuthModal,
    openChangePasswordModal,
    logout,
  } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isDark = theme === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-dark-900/95 backdrop-blur-md border-b border-dark-700/50 shadow-xl shadow-black/30"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo / Yazar İsmi */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group rounded-xl outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <PenLine className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight gradient-text">
              {authorName}
            </span>
          </Link>

          {/* Masaüstü Navigasyon */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }: { isActive: boolean }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-brand-400 bg-brand-500/10"
                      : isDark
                      ? "text-dark-300 hover:text-dark-50 hover:bg-dark-700/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Sadece Admin İçin Yönetici Paneli Linki */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                    isActive
                      ? "bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30"
                      : "bg-brand-500/15 text-brand-300 border-brand-500/30 hover:bg-brand-500/25"
                  }`
                }
              >
                <Shield className="w-3.5 h-3.5" />
                Yönetici Paneli
              </NavLink>
            )}

            {/* Giriş Yapmış Okuyucu İçin Yorumlarım Linki */}
            {isAuthenticated && !isAdmin && (
              <NavLink
                to="/panel"
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isActive
                      ? "bg-brand-600 text-white border-brand-500"
                      : "border-dark-700 bg-dark-800 text-dark-200 hover:border-brand-500/40"
                  }`
                }
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                Yorumlarım
              </NavLink>
            )}
          </div>

          {/* Sağ Alan: Tema Butonu & Kullanıcı Durumu */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? "/admin" : "/panel"}
                  title={currentUser?.email}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-dark-700/60 bg-dark-800/60 hover:bg-dark-700/60 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {currentUser?.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold max-w-[120px] truncate leading-tight">
                      {currentUser?.name}
                    </span>
                    <span className="text-[10px] text-brand-400 leading-tight">
                      {isAdmin ? "Yönetici" : "Okuyucu"}
                    </span>
                  </div>
                </Link>

                {/* Şifre Değiştir Butonu */}
                <button
                  onClick={() => openChangePasswordModal()}
                  title="Şifre Değiştir"
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark
                      ? "border-dark-700 text-dark-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10"
                      : "border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>

                {/* Çıkış Yap Butonu */}
                <button
                  onClick={() => logout()}
                  title="Oturumu Kapat (Çıkış Yap)"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                    isDark
                      ? "border-dark-700 text-dark-300 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10"
                      : "border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Çıkış Yap</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 transition-all hover:-translate-y-0.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Giriş Yap
              </button>
            )}

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                isDark
                  ? "text-dark-300 hover:bg-dark-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              aria-label="Menüyü aç/kapat"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobil Menü Çekmecesi */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden border-t overflow-hidden ${
              isDark
                ? "bg-dark-900/98 border-dark-700/60"
                : "bg-white/98 border-slate-200/80"
            }`}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-brand-400 bg-brand-500/10"
                        : isDark
                        ? "text-dark-300 hover:text-dark-50 hover:bg-dark-800"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/30"
                >
                  <Shield className="w-4 h-4" />
                  Yönetici Paneli
                </NavLink>
              )}

              {isAuthenticated && (
                <div className="pt-2 border-t border-dark-700/60 mt-2 space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-dark-800 text-xs">
                    <span className="text-dark-300 font-medium truncate">
                      {currentUser?.name} ({currentUser?.email})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold">
                      {isAdmin ? "Yönetici" : "Okuyucu"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openChangePasswordModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-dark-800 border border-dark-700 text-amber-300 hover:bg-dark-700 transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Şifre Değiştir
                  </button>

                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Oturumu Kapat (Çıkış Yap)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
