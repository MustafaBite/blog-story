import { supabase, isSupabaseConfigured } from "./supabase";

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  error?: string;
}

/**
 * Resim veya PDF dosyasını Supabase Storage'a yükler.
 * Supabase bağlı değilse veya hata verirse veri kaybı olmaması için
 * otomatik olarak base64 Veri URL'sine (Data URL) dönüştürür.
 */
export async function uploadMediaFile(
  file: File,
  folder: "stories" | "artworks" | "pdfs" = "stories"
): Promise<UploadResult> {
  const fileName = file.name;
  const size = file.size;

  // 1. Supabase Storage Denemesi
  if (isSupabaseConfigured && supabase) {
    try {
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .toLowerCase();
      const timestamp = Date.now();
      const filePath = `${folder}/${timestamp}_${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from("portfolio-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from("portfolio-media")
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          return {
            url: publicData.publicUrl,
            fileName,
            size,
          };
        }
      } else if (error) {
        console.warn(
          "Supabase Storage yükleme uyarısı (yerel veri URL'sine geçiliyor):",
          error.message
        );
      }
    } catch (err) {
      console.warn("Storage istisnası:", err);
    }
  }

  // 2. Güvenilir Fallback: Base64 Data URL (Her ortamda ve yerel çalışır)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        fileName,
        size,
      });
    };
    reader.onerror = () => {
      reject({
        url: "",
        fileName,
        size,
        error: "Dosya okunamadı.",
      });
    };
    reader.readAsDataURL(file);
  });
}
