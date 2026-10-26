import { createClient } from "@supabase/supabase-js";

let rawUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// URL format düzeltmesi (örn. //xyz veya http:// yerine https://)
if (rawUrl && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
  rawUrl = "https://" + rawUrl.replace(/^\/+/, "");
}

export const isSupabaseConfigured = Boolean(
  rawUrl &&
    supabaseAnonKey &&
    rawUrl.startsWith("https://") &&
    rawUrl.includes("supabase.co")
);

export const supabase = isSupabaseConfigured
  ? createClient(rawUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Yönetici E-posta Kontrolü
export const ADMIN_EMAIL = (
  import.meta.env.VITE_ADMIN_EMAIL || "mustafabite2357@gmail.com"
).toLowerCase().trim();

export const AUTHOR_NAME =
  import.meta.env.VITE_AUTHOR_NAME || "Mustafa";

export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL;
}
