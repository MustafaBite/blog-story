import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Trash2,
  Edit2,
  ShieldAlert,
  Check,
  X,
  Lock,
} from "lucide-react";
import type { Story, Comment } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";

interface CommentsSectionProps {
  story: Story;
}

export function CommentsSection({ story }: CommentsSectionProps) {
  const { currentUser, isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const { getStoryComments, addComment, updateComment, deleteComment } =
    useData();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const comments = getStoryComments(story.id);

  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal("Bu hikayeye düşüncelerinizi eklemek için giriş yapın.");
      return;
    }
    if (!newContent.trim()) return;

    addComment(story.id, story.title, story.slug, newContent);
    setNewContent("");
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = (commentId: string) => {
    if (!editContent.trim()) return;
    updateComment(commentId, editContent);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      deleteComment(commentId);
    }
  };

  const formatCommentDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-dark-700/60">
      {/* Başlık ve Sayaç */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`font-serif text-2xl font-bold ${
                isDark ? "text-dark-50" : "text-slate-900"
              }`}
            >
              Yorumlar ve Düşünceler
            </h3>
            <p
              className={`text-xs ${
                isDark ? "text-dark-400" : "text-slate-500"
              }`}
            >
              {comments.length} okuyucu katkısı
            </p>
          </div>
        </div>

        {/* Yetki Durumu Rozeti */}
        <div className="text-xs">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
              <ShieldAlert className="w-3.5 h-3.5" />
              Yönetici Modu (Tam Moderasyon)
            </span>
          ) : isAuthenticated ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dark-700 text-dark-300 border border-dark-600">
              Okuyucu: {currentUser?.name}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dark-800 text-dark-400 border border-dark-700">
              Misafir Modu
            </span>
          )}
        </div>
      </div>

      {/* Yorum Ekleme Alanı */}
      <div
        className={`rounded-2xl p-6 border mb-10 transition-all ${
          isDark
            ? "bg-dark-800/60 border-dark-700/60"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        {isAuthenticated ? (
          <form onSubmit={handleAddSubmit}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs border border-brand-500/30">
                {currentUser?.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span
                  className={`text-sm font-semibold ${
                    isDark ? "text-dark-100" : "text-slate-800"
                  }`}
                >
                  {currentUser?.name}
                </span>
                <span className="text-xs text-brand-400 ml-2">
                  ({currentUser?.role === "admin" ? "Yönetici" : "Okuyucu"})
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Bu yazı üzerine ne düşünüyorsunuz? Düşüncelerinizi paylaşın..."
              className={`w-full p-4 rounded-xl text-sm border outline-none transition-colors resize-none ${
                isDark
                  ? "bg-dark-900 border-dark-600 focus:border-brand-500 text-dark-100 placeholder-dark-500"
                  : "bg-slate-50 border-slate-200 focus:border-brand-500 text-slate-800 placeholder-slate-400"
              }`}
            />

            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                Yorumu Yayınla
              </button>
            </div>
          </form>
        ) : (
          /* Misafirler İçin Giriş Çağrısı */
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4
              className={`font-medium text-base mb-1 ${
                isDark ? "text-dark-100" : "text-slate-800"
              }`}
            >
              Yorum yazmak için oturum açmalısınız
            </h4>
            <p
              className={`text-xs max-w-md mx-auto mb-5 ${
                isDark ? "text-dark-400" : "text-slate-500"
              }`}
            >
              Misafir kullanıcılar hikayeleri serbestçe okuyabilir. Yorum
              bırakmak ve toplulukla etkileşime geçmek için lütfen e-postanızla
              giriş yapın.
            </p>
            <button
              onClick={() =>
                openAuthModal(
                  "Bu hikayeye yorum yazabilmek için lütfen giriş yapın."
                )
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-600/30"
            >
              Giriş Yap veya Kaydol
            </button>
          </div>
        )}
      </div>

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div
            className={`text-center py-12 rounded-2xl border ${
              isDark
                ? "border-dark-700/40 bg-dark-800/20 text-dark-400"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            Henüz yorum yazılmamış. İlk düşünceyi siz paylaşın!
          </div>
        ) : (
          comments.map((comment) => {
            const isOwner = currentUser?.id === comment.authorId;
            const canDelete = isOwner || isAdmin;
            const isEditingThis = editingId === comment.id;

            return (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-dark-800/50 border-dark-700/60"
                    : "bg-white border-slate-200"
                }`}
              >
                {/* Üst Bilgi: Yazar & Tarih & Aksiyonlar */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                        comment.authorRole === "admin"
                          ? "bg-gradient-to-tr from-brand-600 to-violet-600 text-white"
                          : "bg-dark-700 text-brand-300 border border-dark-600"
                      }`}
                    >
                      {comment.authorName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-sm ${
                            isDark ? "text-dark-100" : "text-slate-800"
                          }`}
                        >
                          {comment.authorName}
                        </span>
                        {comment.authorRole === "admin" && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            Yönetici
                          </span>
                        )}
                        {isOwner && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 text-dark-300 border border-dark-600">
                            Siz
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] ${
                          isDark ? "text-dark-400" : "text-slate-400"
                        }`}
                      >
                        {formatCommentDate(comment.createdAt)}
                        {comment.updatedAt && " (düzenlendi)"}
                      </span>
                    </div>
                  </div>

                  {/* Düzenleme / Silme Aksiyonları */}
                  <div className="flex items-center gap-1">
                    {/* Düzenle butonu: Sadece kendi yorumu */}
                    {isOwner && !isEditingThis && (
                      <button
                        onClick={() => startEdit(comment)}
                        title="Yorumumu Düzenle"
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isDark
                            ? "text-dark-400 hover:text-dark-200 hover:bg-dark-700"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Sil butonu: Kendi yorumu VEYA Admin */}
                    {canDelete && !isEditingThis && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        title={
                          isAdmin && !isOwner
                            ? "Yönetici Olarak Sil (Moderasyon)"
                            : "Yorumu Sil"
                        }
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isAdmin && !isOwner
                            ? "text-rose-400 hover:bg-rose-500/10"
                            : isDark
                            ? "text-dark-400 hover:text-rose-400 hover:bg-dark-700"
                            : "text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Yorum İçeriği Veya Düzenleme Formu */}
                {isEditingThis ? (
                  <div className="space-y-3 mt-2">
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`w-full p-3 rounded-xl text-sm border outline-none ${
                        isDark
                          ? "bg-dark-900 border-dark-600 focus:border-brand-500 text-dark-100"
                          : "bg-slate-50 border-slate-300 focus:border-brand-500 text-slate-900"
                      }`}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          isDark
                            ? "border-dark-600 hover:bg-dark-700 text-dark-300"
                            : "border-slate-200 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        Vazgeç
                      </button>
                      <button
                        onClick={() => saveEdit(comment.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Kaydet
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
          })
        )}
      </div>
    </section>
  );
}
