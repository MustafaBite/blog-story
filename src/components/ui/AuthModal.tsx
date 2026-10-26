import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function AuthModal() {
  const {
    authModalOpen,
    authModalMessage,
    initialTab,
    closeAuthModal,
    login,
    register,
  } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setActiveTab(initialTab);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [authModalOpen, initialTab]);

  if (!authModalOpen) return null;

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // İstemci Tarafı Doğrulamaları
    if (password.length < 6) {
      setErrorMsg("Şifreniz en az 6 karakter uzunluğunda olmalıdır.");
      return;
    }

    if (activeTab === "register") {
      if (!name.trim()) {
        setErrorMsg("Lütfen adınızı ve soyadınızı girin.");
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMsg("Girdiğiniz şifreler birbiriyle eşleşmiyor. Lütfen kontrol edin.");
        return;
      }
    }

    setLoading(true);

    try {
      if (activeTab === "register") {
        const res = await register(email, password, passwordConfirm, name);
        if (!res.success && res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Hesabınız başarıyla oluşturuldu ve oturum açıldı!");
        }
      } else {
        const res = await login(email, password);
        if (!res.success && res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Giriş başarılı! Yönlendiriliyorsunuz...");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("İşlem sırasında beklenmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Karartma Katmanı */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeAuthModal}
        />

        {/* Modal Penceresi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border ${
            isDark
              ? "bg-dark-900 border-dark-700/80 text-dark-100"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          {/* Kapat Butonu */}
          <button
            onClick={closeAuthModal}
            className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
              isDark
                ? "text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo / Başlık */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white mb-3 shadow-xl shadow-brand-600/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-tight">
              {activeTab === "login" ? "Tekrar Hoş Geldiniz" : "Okuyucu Topluluğuna Katılın"}
            </h3>
            <p
              className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                isDark ? "text-dark-400" : "text-slate-500"
              }`}
            >
              {authModalMessage ||
                "Düşüncelerinizi paylaşmak ve yorum yazmak için oturum açın."}
            </p>
          </div>

          {/* İki Sekmeli Navigasyon (Giriş Yap / Kayıt Ol) */}
          <div className="flex p-1 rounded-2xl bg-dark-800/80 border border-dark-700/80 mb-6">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === "login"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-dark-400 hover:text-dark-200"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === "register"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-dark-400 hover:text-dark-200"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Hata Bildirimi */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="leading-relaxed">{errorMsg}</span>
            </motion.div>
          )}

          {/* Başarı Bildirimi */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="leading-relaxed">{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kayıt Ol: Ad Soyad */}
            {activeTab === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-dark-300">
                  Adınız ve Soyadınız
                </label>
                <div className="relative">
                  <UserIcon
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-dark-500" : "text-slate-400"
                    }`}
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Caner Yılmaz"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                      isDark
                        ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                        : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* E-posta Adresi */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-dark-300">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-dark-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eposta@ornek.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                    isDark
                      ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                      : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                  }`}
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
                  Şifre
                </label>
                <span className="text-[11px] text-dark-400">En az 6 karakter</span>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-dark-500" : "text-slate-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                    isDark
                      ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                      : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Kayıt Ol: Şifre Tekrarı */}
            {activeTab === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-dark-300">
                  Şifre Tekrarı
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-dark-500" : "text-slate-400"
                    }`}
                  />
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                      isDark
                        ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                        : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white shadow-xl shadow-brand-600/30 transition-all hover:-translate-y-0.5 mt-3"
            >
              {loading
                ? "Kontrol ediliyor..."
                : activeTab === "register"
                ? "Hesap Oluştur ve Giriş Yap"
                : "Giriş Yap"}
            </button>
          </form>

          {/* Alt Bilgi */}
          <div className="mt-6 text-center text-xs text-dark-400">
            {activeTab === "login" ? (
              <p>
                Hesabınız yok mu?{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange("register")}
                  className="text-brand-400 hover:underline font-semibold ml-1"
                >
                  Kayıt Olun
                </button>
              </p>
            ) : (
              <p>
                Zaten kayıtlı mısınız?{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange("login")}
                  className="text-brand-400 hover:underline font-semibold ml-1"
                >
                  Giriş Yapın
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
