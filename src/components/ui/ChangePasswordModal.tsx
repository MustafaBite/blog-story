import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function ChangePasswordModal() {
  const {
    changePasswordModalOpen,
    closeChangePasswordModal,
    changePassword,
  } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successNewPassword, setSuccessNewPassword] = useState<string | null>(null);
  const [showResultPassword, setShowResultPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!changePasswordModalOpen) return null;

  const handleResetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setErrorMsg("");
    setSuccessNewPassword(null);
    setCopied(false);
  };

  const handleClose = () => {
    handleResetForm();
    closeChangePasswordModal();
  };

  const handleCopy = () => {
    if (successNewPassword) {
      navigator.clipboard.writeText(successNewPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessNewPassword(null);

    if (newPassword.length < 6) {
      setErrorMsg("Yeni şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMsg("Yeni şifreler birbiriyle eşleşmiyor. Lütfen kontrol edin.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg("Yeni şifre mevcut şifrenizle aynı olamaz. Farklı bir şifre seçin.");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword(currentPassword, newPassword, newPasswordConfirm);
      if (!res.success && res.error) {
        setErrorMsg(res.error);
      } else {
        // Şifreyi başarıyla değiştirdik ve kullanıcıya geri gösteriyoruz!
        setSuccessNewPassword(newPassword);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Şifre güncellenirken beklenmedik bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
        {/* Karartma Katmanı */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal Kartı */}
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
            onClick={handleClose}
            className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
              isDark
                ? "text-dark-400 hover:text-dark-100 hover:bg-dark-800"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Başarı Durumu (Kullanıcıya Yeni Şifreyi Geri Gösterme Ekranı) */}
          {successNewPassword ? (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="font-serif text-2xl font-bold tracking-tight mb-2 text-emerald-400">
                Şifreniz Başarıyla Değiştirildi!
              </h3>
              <p
                className={`text-xs sm:text-sm mb-6 ${
                  isDark ? "text-dark-300" : "text-slate-600"
                }`}
              >
                Yeni şifreniz sisteme kaydedildi. Lütfen yeni şifrenizi güvenli
                bir yere not edin:
              </p>

              {/* Yeni Şifreyi Gösteren Kutu */}
              <div
                className={`p-4 rounded-2xl border mb-6 flex items-center justify-between gap-3 text-left ${
                  isDark
                    ? "bg-dark-800/90 border-emerald-500/40"
                    : "bg-emerald-50/80 border-emerald-300"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-0.5">
                    Yeni Şifreniz
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-300 tracking-wide break-all">
                    {showResultPassword ? successNewPassword : "••••••••••••"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowResultPassword(!showResultPassword)}
                    title={showResultPassword ? "Gizle" : "Göster"}
                    className="p-2 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-700/60 transition-colors"
                  >
                    {showResultPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    title="Şifreyi Kopyala"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Kopyala
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-2xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/30 transition-all"
              >
                Tamam, Anladım
              </button>
            </div>
          ) : (
            /* Normal Şifre Değiştirme Formu */
            <>
              {/* Başlık */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white mb-3 shadow-xl shadow-brand-600/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  Şifre Değiştir
                </h3>
                <p
                  className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                    isDark ? "text-dark-400" : "text-slate-500"
                  }`}
                >
                  Hesabınız için yeni ve güvenli bir parola belirleyin.
                </p>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mevcut Şifre */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-dark-300">
                    Mevcut Şifreniz
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? "text-dark-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Mevcut parolanız"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                        isDark
                          ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                          : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Yeni Şifre */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
                      Yeni Şifre
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
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Yeni parolanız"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                        isDark
                          ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                          : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Yeni Şifre Tekrarı */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-dark-300">
                    Yeni Şifre Tekrarı
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? "text-dark-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      placeholder="Yeni parolanızı tekrar girin"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                        isDark
                          ? "bg-dark-800 border-dark-700 focus:border-brand-500 text-dark-100"
                          : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                      isDark
                        ? "border-dark-700 text-dark-300 hover:bg-dark-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5"
                  >
                    {loading ? "Güncelleniyor..." : "Şifreyi Değiştir"}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
