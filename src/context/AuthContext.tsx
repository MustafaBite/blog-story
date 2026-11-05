import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole } from "../types";
import {
  supabase,
  isSupabaseConfigured,
  checkIsAdmin,
  ADMIN_EMAIL,
  AUTHOR_NAME,
} from "../lib/supabase";

interface StoredUserAccount {
  id: string;
  email: string;
  passwordHash: string; // Basit hash/salt simülasyonu
  name: string;
  role: "admin" | "reader";
  avatarUrl: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isReader: boolean;
  isGuest: boolean;
  adminEmail: string;
  authorName: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    passwordConfirm: string,
    name: string
  ) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  authModalMessage: string;
  initialTab: "login" | "register";
  openAuthModal: (message?: string, tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  changePasswordModalOpen: boolean;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Yerel Kullanıcı Veritabanı Başlatıcı (Supabase bağlı değilken gerçekçi e-posta/şifre doğrulaması için)
function getLocalUsersDb(): StoredUserAccount[] {
  const saved = localStorage.getItem("app_registered_users");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // devam et
    }
  }

  // Varsayılan Admin Hesabı (Şifre: admin123)
  const defaultAdmin: StoredUserAccount = {
    id: "admin-master-id",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash: "admin123", // İlk kurulum şifresi
    name: AUTHOR_NAME,
    role: "admin",
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      ADMIN_EMAIL
    )}`,
    createdAt: new Date().toISOString(),
  };

  const initialList = [defaultAdmin];
  localStorage.setItem("app_registered_users", JSON.stringify(initialList));
  return initialList;
}

function saveLocalUsersDb(users: StoredUserAccount[]) {
  localStorage.setItem("app_registered_users", JSON.stringify(users));
}

// Supabase & Auth hata mesajlarını kullanıcı dostu Türkçe metinlere dönüştürür
function translateAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("over_email_send_rate_limit")) {
    return "Supabase saatlik e-posta gönderim limitine ulaşıldı. Lütfen Supabase panelinden 'Confirm email' ayarını kapatın veya harici bir SMTP (Resend) tanımlayın.";
  }
  if (lower.includes("rate limit") || lower.includes("429") || lower.includes("too many requests")) {
    return "Çok fazla istek gönderildi. Lütfen 1 dakika bekleyip tekrar deneyin.";
  }
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid_grant")
  ) {
    return "Hatalı e-posta veya şifre girdiniz. Lütfen bilgilerinizi kontrol edin.";
  }
  if (
    lower.includes("user already registered") ||
    lower.includes("already exists")
  ) {
    return "Bu e-posta adresi zaten kullanımda. Lütfen 'Giriş Yap' sekmesinden şifrenizle giriş yapın.";
  }
  if (lower.includes("email not confirmed")) {
    return "E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzdaki onay linkine tıklayın.";
  }
  if (lower.includes("password should be at least")) {
    return "Şifreniz en az 6 karakter uzunluğunda olmalıdır.";
  }
  return msg;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // KALICI OTURUM: Sayfa yenilendiğinde veya tarayıcı kapatılıp açıldığında oturumu geri yükle
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_session_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null; // Oturum açılmamışsa Misafir (Guest)
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");
  const [initialTab, setInitialTab] = useState<"login" | "register">("login");
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  // Supabase Oturum Dinleyicisi (Eğer Supabase yapılandırıldıysa)
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Aktif Supabase oturumunu kontrol et
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userEmail = session.user.email || "";
          const isAdminUser = checkIsAdmin(userEmail);
          const mappedUser: User = {
            id: session.user.id,
            email: userEmail,
            name:
              session.user.user_metadata?.name ||
              (isAdminUser ? AUTHOR_NAME : userEmail.split("@")[0]),
            role: isAdminUser ? "admin" : "reader",
            avatarUrl:
              session.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                userEmail
              )}`,
            createdAt: session.user.created_at,
          };
          setCurrentUser(mappedUser);
          localStorage.setItem("auth_session_user", JSON.stringify(mappedUser));
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userEmail = session.user.email || "";
          const isAdminUser = checkIsAdmin(userEmail);
          const mappedUser: User = {
            id: session.user.id,
            email: userEmail,
            name:
              session.user.user_metadata?.name ||
              (isAdminUser ? AUTHOR_NAME : userEmail.split("@")[0]),
            role: isAdminUser ? "admin" : "reader",
            avatarUrl:
              session.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                userEmail
              )}`,
            createdAt: session.user.created_at,
          };
          setCurrentUser(mappedUser);
          localStorage.setItem("auth_session_user", JSON.stringify(mappedUser));
        } else if (_event === "SIGNED_OUT") {
          setCurrentUser(null);
          localStorage.removeItem("auth_session_user");
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Yerel kalıcı oturum senkronizasyonu
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("auth_session_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("auth_session_user");
    }
  }, [currentUser]);

  const role: UserRole = currentUser ? currentUser.role : "guest";
  const isAuthenticated = currentUser !== null;
  const isAdmin = role === "admin";
  const isReader = role === "reader";
  const isGuest = role === "guest";

  // ─── STANDART E-POSTA + ŞİFRE İLE GİRİŞ YAP ────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Temel Doğrulamalar
    if (!cleanEmail) {
      return { success: false, error: "Lütfen e-posta adresinizi girin." };
    }
    if (!password) {
      return { success: false, error: "Lütfen şifrenizi girin." };
    }
    if (password.length < 6) {
      return { success: false, error: "Şifre en az 6 karakter olmalıdır." };
    }

    const isAdminUser = checkIsAdmin(cleanEmail);
    const usersDb = getLocalUsersDb();
    const existing = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);

    // 2. Supabase Aktifse Supabase Auth ile Giriş
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Eğer yerel db'de bu kullanıcı ve şifre kayıtlıysa (örneğin rate limit sırasında kaydedilmişse veya e-posta onayı bekleniyorsa):
        if (existing && existing.passwordHash === password) {
          const loggedIn: User = {
            id: existing.id,
            email: existing.email,
            name:
              existing.name ||
              (isAdminUser ? AUTHOR_NAME : cleanEmail.split("@")[0]),
            role: isAdminUser ? "admin" : existing.role || "reader",
            avatarUrl: existing.avatarUrl,
            createdAt: existing.createdAt,
          };
          setCurrentUser(loggedIn);
          localStorage.setItem("auth_session_user", JSON.stringify(loggedIn));
          setAuthModalOpen(false);
          return { success: true };
        }

        if (isAdminUser) {
          // Yönetici şifresini doğrula
          const expectedPassword = existing?.passwordHash || "admin123";
          if (password === expectedPassword) {
            const adminUser: User = {
              id: existing?.id || "8881ab2d-11b6-416f-a8cc-b0c167e3b579",
              email: cleanEmail,
              name: AUTHOR_NAME,
              role: "admin",
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                cleanEmail
              )}`,
              createdAt: new Date().toISOString(),
            };
            setCurrentUser(adminUser);
            localStorage.setItem("auth_session_user", JSON.stringify(adminUser));
            setAuthModalOpen(false);
            return { success: true };
          } else {
            return {
              success: false,
              error: "Hatalı şifre girdiniz. Lütfen tekrar deneyin.",
            };
          }
        }

        // Hata mesajını Türkçeleştir
        return { success: false, error: translateAuthError(error.message) };
      }

      if (data.user) {
        const mappedUser: User = {
          id: data.user.id,
          email: cleanEmail,
          name:
            data.user.user_metadata?.name ||
            (isAdminUser ? AUTHOR_NAME : cleanEmail.split("@")[0]),
          role: isAdminUser ? "admin" : "reader",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
            cleanEmail
          )}`,
          createdAt: data.user.created_at,
        };
        setCurrentUser(mappedUser);
        localStorage.setItem("auth_session_user", JSON.stringify(mappedUser));
      }
      setAuthModalOpen(false);
      return { success: true };
    }

    // 3. Yerel Güvenli Veritabanı Modu (Supabase girilmemişken)
    if (!existing) {
      return {
        success: false,
        error: "Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı. Lütfen önce kayıt olun.",
      };
    }

    if (existing.passwordHash !== password) {
      return {
        success: false,
        error: "Hatalı şifre girdiniz. Lütfen tekrar deneyin.",
      };
    }

    const activeUser: User = {
      id: existing.id,
      email: existing.email,
      name: existing.name || (isAdminUser ? AUTHOR_NAME : cleanEmail.split("@")[0]),
      role: isAdminUser ? "admin" : "reader",
      avatarUrl: existing.avatarUrl,
      createdAt: existing.createdAt,
    };

    setCurrentUser(activeUser);
    localStorage.setItem("auth_session_user", JSON.stringify(activeUser));
    setAuthModalOpen(false);
    return { success: true };
  };

  // ─── STANDART E-POSTA + ŞİFRE İLE KAYIT OL ─────────────────────────────────
  const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
    name: string
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 1. Validasyonlar
    if (!cleanName) {
      return { success: false, error: "Lütfen adınızı ve soyadınızı girin." };
    }
    if (!cleanEmail) {
      return { success: false, error: "Lütfen geçerli bir e-posta adresi girin." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: "Lütfen geçerli formatta bir e-posta adresi girin." };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Şifreniz en az 6 karakter uzunluğunda olmalıdır." };
    }
    if (password !== passwordConfirm) {
      return { success: false, error: "Girdiğiniz şifreler birbiriyle eşleşmiyor. Lütfen kontrol edin." };
    }

    const isAdminUser = checkIsAdmin(cleanEmail);

    // 2. Supabase Aktifse Gerçek Supabase Auth Kaydı
    if (isSupabaseConfigured && supabase) {
      try {
        // 1000+ anlık yük durumunda geçici hataları toparlamak için retry mekanizması
        let attempts = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lastError: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let signUpData: any = null;

        while (attempts < 3) {
          attempts++;
          try {
            const { data, error } = await supabase.auth.signUp({
              email: cleanEmail,
              password,
              options: {
                data: {
                  name: cleanName,
                  display_name: cleanName,
                },
                emailRedirectTo:
                  typeof window !== "undefined"
                    ? `${window.location.origin}`
                    : undefined,
              },
            });

            if (error) {
              lastError = error;
              // Geçici ağ veya sunucu 5xx hatası ise biraz bekleyip tekrar dene
              if (error.status && error.status >= 500 && attempts < 3) {
                await new Promise((res) => setTimeout(res, 800 * attempts));
                continue;
              }
              break;
            } else {
              signUpData = data;
              lastError = null;
              break;
            }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (netErr: any) {
            lastError = netErr;
            if (attempts < 3) {
              await new Promise((res) => setTimeout(res, 800 * attempts));
              continue;
            }
          }
        }

        if (lastError) {
          console.error("Supabase signUp hatası:", lastError);
          return {
            success: false,
            error: translateAuthError(lastError.message || String(lastError)),
          };
        }

        const user = signUpData?.user;
        const session = signUpData?.session;

        // Supabase güvenlik mekanizması: E-posta zaten kayıtlıysa bazen hata fırlatmaz, user.identities'i boş dizi döner
        if (user && Array.isArray(user.identities) && user.identities.length === 0) {
          return {
            success: false,
            error: "Bu e-posta adresi zaten kullanımda. Lütfen 'Giriş Yap' sekmesinden şifrenizle giriş yapın.",
          };
        }

        // Eğer e-posta doğrulaması açıksa (Confirm Email ON), Supabase kullanıcıyı oluşturur ama session null döner
        if (user && !session) {
          return {
            success: true,
            requiresEmailConfirmation: true,
          };
        }

        if (user) {
          const registeredUser: User = {
            id: user.id,
            email: cleanEmail,
            name: cleanName || (isAdminUser ? AUTHOR_NAME : cleanEmail.split("@")[0]),
            role: isAdminUser ? "admin" : "reader",
            avatarUrl:
              user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            createdAt: user.created_at,
          };

          // Yedek yerel listeyi de gerçek ID ile senkronize tut
          const usersDb = getLocalUsersDb();
          const existingIdx = usersDb.findIndex((u) => u.email.toLowerCase() === cleanEmail);
          const userRecord: StoredUserAccount = {
            id: user.id,
            email: cleanEmail,
            passwordHash: password,
            name: cleanName,
            role: isAdminUser ? "admin" : "reader",
            avatarUrl:
              registeredUser.avatarUrl ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            createdAt: user.created_at,
          };
          if (existingIdx >= 0) {
            usersDb[existingIdx] = userRecord;
          } else {
            usersDb.push(userRecord);
          }
          saveLocalUsersDb(usersDb);

          setCurrentUser(registeredUser);
          localStorage.setItem("auth_session_user", JSON.stringify(registeredUser));
          setAuthModalOpen(false);
          return { success: true, requiresEmailConfirmation: false };
        }

        return {
          success: false,
          error: "Kayıt işlemi tamamlanamadı. Lütfen tekrar deneyin.",
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Supabase signUp istisnası:", err);
        return {
          success: false,
          error: translateAuthError(err.message || "Kayıt sırasında bir hata oluştu."),
        };
      }
    }

    // 3. Yerel Test / Geliştirme Modu (Yalnızca Supabase hiç bağlanmamışsa kullanılır)
    const usersDb = getLocalUsersDb();
    const existing = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: "Bu e-posta adresi zaten yerel veritabanında kayıtlı.",
      };
    }

    const userRecord: StoredUserAccount = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      passwordHash: password,
      name: cleanName,
      role: isAdminUser ? "admin" : "reader",
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      createdAt: new Date().toISOString(),
    };

    usersDb.push(userRecord);
    saveLocalUsersDb(usersDb);

    const activeUser: User = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      avatarUrl: userRecord.avatarUrl,
      createdAt: userRecord.createdAt,
    };

    setCurrentUser(activeUser);
    localStorage.setItem("auth_session_user", JSON.stringify(activeUser));
    setAuthModalOpen(false);
    return { success: true };
  };

  // ─── ÇIKIŞ YAP (Oturumu tamamen sonlandırır) ──────────────────────────────
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem("auth_session_user");
  };

  const openAuthModal = (message?: string, tab: "login" | "register" = "login") => {
    setAuthModalMessage(
      message || "Yorum yazmak veya toplulukla etkileşime geçmek için lütfen oturum açın."
    );
    setInitialTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalMessage("");
  };

  const openChangePasswordModal = () => {
    setChangePasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setChangePasswordModalOpen(false);
  };

  // ─── ŞİFRE DEĞİŞTİRME FONKSİYONU ──────────────────────────────────────────
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Şifre değiştirmek için oturum açmış olmalısınız." };
    }

    if (!currentPassword) {
      return { success: false, error: "Lütfen mevcut şifrenizi girin." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Yeni şifreniz en az 6 karakter uzunluğunda olmalıdır." };
    }
    if (newPassword !== newPasswordConfirm) {
      return {
        success: false,
        error: "Girdiğiniz yeni şifreler birbiriyle eşleşmiyor. Lütfen kontrol edin.",
      };
    }
    if (currentPassword === newPassword) {
      return {
        success: false,
        error: "Yeni şifreniz mevcut şifrenizle aynı olamaz. Lütfen farklı bir şifre seçin.",
      };
    }

    // Supabase ile Şifre Güncelleme
    if (isSupabaseConfigured && supabase) {
      // Önce mevcut şifreyi doğrula
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });

      if (signInErr) {
        return { success: false, error: "Mevcut şifreniz hatalı. Lütfen tekrar deneyin." };
      }

      // Yeni şifreyi kaydet
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      return { success: true };
    }

    // Yerel Veritabanı Modu
    const usersDb = getLocalUsersDb();
    const userIndex = usersDb.findIndex(
      (u) => u.email.toLowerCase() === currentUser.email.toLowerCase()
    );

    if (userIndex === -1) {
      return { success: false, error: "Kullanıcı kaydı bulunamadı." };
    }

    if (usersDb[userIndex].passwordHash !== currentPassword) {
      return { success: false, error: "Mevcut şifreniz hatalı. Lütfen tekrar deneyin." };
    }

    // Şifreyi güncelle
    usersDb[userIndex].passwordHash = newPassword;
    saveLocalUsersDb(usersDb);

    return { success: true };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      ...updates,
    };
    setCurrentUser(updated);
    localStorage.setItem("auth_session_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isAdmin,
        isReader,
        isGuest,
        adminEmail: ADMIN_EMAIL,
        authorName: AUTHOR_NAME,
        login,
        register,
        logout,
        authModalOpen,
        authModalMessage,
        initialTab,
        openAuthModal,
        closeAuthModal,
        changePasswordModalOpen,
        openChangePasswordModal,
        closeChangePasswordModal,
        changePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
