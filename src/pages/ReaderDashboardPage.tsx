import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  X,
  BookOpen,
  Calendar,
  Mail,
  Shield,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

export function ReaderDashboardPage() {
  const { currentUser, isAuthenticated, openChangePasswordModal } = useAuth();
  const { getUserComments, updateComment, deleteComment } = useData();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  const myComments = getUserComments(currentUser.id);

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditContent(text);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    updateComment(id, editContent);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bu yorumunuzu silmek istediğinizden emin misiniz?")) {
      deleteComment(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profil Başlığı */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border mb-10 ${
          isDark
            ? "bg-dark-800/60 border-dark-700/60"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-brand-600/30">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1
                  className={`font-serif text-2xl sm:text-3xl font-bold ${
                    isDark ? "text-dark-50" : "text-slate-900"
                  }`}
                >
                  {currentUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/40">
                  {currentUser.role === "admin" ? "Yönetici" : "Kayıtlı Okur"}
                </span>
              </div>
              <div
                className={`flex items-center gap-4 mt-2 text-xs ${
                  isDark ? "text-dark-400" : "text-slate-500"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Kayıt:{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openChangePasswordModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-dark-700 bg-dark-800 text-amber-300 hover:bg-dark-700 transition-all shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Şifre Değiştir
            </button>

            {currentUser.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30"
              >
                <Shield className="w-3.5 h-3.5" />
                Yönetici Paneline Git
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Yorumlarım Bölümü */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`font-serif text-2xl font-bold ${
                  isDark ? "text-dark-50" : "text-slate-900"
                }`}
              >
                Yorumlarım
              </h2>
              <p
                className={`text-xs ${
                  isDark ? "text-dark-400" : "text-slate-500"
                }`}
              >
                Hikayeler altında paylaştığınız tüm düşünceler
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-dark-700 text-dark-300">
            {myComments.length} Yorum
          </span>
        </div>

        {myComments.length === 0 ? (
          <div
            className={`py-16 text-center rounded-3xl border ${
              isDark
                ? "border-dark-700/50 bg-dark-800/30"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <BookOpen
              className={`w-12 h-12 mx-auto mb-3 ${
                isDark ? "text-dark-600" : "text-slate-300"
              }`}
            />
            <h3
              className={`font-medium text-base mb-1 ${
                isDark ? "text-dark-200" : "text-slate-700"
              }`}
            >
              Henüz bir yorum paylaşmadınız
            </h3>
            <p
              className={`text-xs max-w-sm mx-auto mb-5 ${
                isDark ? "text-dark-400" : "text-slate-500"
              }`}
            >
              Hikayeleri okurken ilginizi çeken pasajlara düşüncelerinizi ekleyin.
            </p>
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white"
            >
              Hikayelere Göz At
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myComments.map((comment) => {
              const isEditing = editingId === comment.id;

              return (
                <motion.div
                  key={comment.id}
                  layout
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark
                      ? "bg-dark-800/50 border-dark-700/60"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-dark-700/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-dark-400">Yazı:</span>
                      <Link
                        to={`/stories/${comment.storySlug}`}
                        className="text-sm font-serif font-semibold text-brand-400 hover:underline flex items-center gap-1"
                      >
                        {comment.storyTitle}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-dark-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "tr-TR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        {comment.updatedAt && " (düzenlendi)"}
                      </span>

                      {!isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              startEdit(comment.id, comment.content)
                            }
                            title="Düzenle"
                            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            title="Sil"
                            className="p-1.5 rounded-lg text-dark-400 hover:text-rose-400 hover:bg-dark-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={`w-full p-3 rounded-xl text-sm border outline-none ${
                          isDark
                            ? "bg-dark-900 border-dark-600 focus:border-brand-500 text-dark-100"
                            : "bg-slate-50 border-slate-300 focus:border-brand-500 text-slate-800"
                        }`}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-dark-600 hover:bg-dark-700 text-dark-300"
                        >
                          <X className="w-3.5 h-3.5" />
                          Vazgeç
                        </button>
                        <button
                          onClick={() => saveEdit(comment.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Değişikliği Kaydet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        isDark ? "text-dark-200" : "text-slate-700"
                      }`}
                    >
                      {comment.content}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
