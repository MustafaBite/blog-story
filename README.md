# 🎨 Mustafa — Dijital Portfolyo, Blog & Sanat Galerisi

Kişisel hikayeler, felsefi denemeler, zengin metin yazıları ve dijital illüstrasyonların bir arada sunulduğu modern, tam teşekküllü dijital portfolyo ve blog uygulaması.

---

## ✨ Özellikler

- **🎭 Rol Tabanlı Erişim & Tek Yönetici (Single Admin):**
  - Yönetici: Özel e-posta adresiyle korunan tek yönetici paneli. Yazı ekleme/düzenleme, resim/PDF yükleme ve moderasyon.
  - Okuyucu: E-posta ve şifre ile kalıcı oturum, hikayelere yorum yapma, kendi yorumlarını düzenleme/silme.
  - Misafir: Herkese açık okuma ve galeri görüntüleme deneyimi.
- **📄 Akıllı PDF İçe Aktarma:**
  - Cihazdan `.pdf` yükleyerek başlık, özet ve paragrafları otomatik ayıklama ve hikayeye bağlama.
  - Hikaye detay sayfasında okuyucular için orijinal PDF dokümanını indirme / görüntüleme imkanı.
- **🖼️ Zengin Medya & Kapak Yükleme:**
  - Kapak görsellerini cihazdan yükleme veya URL ile bağlama.
  - İçerik editörü üzerinden hikaye gövdesine tek tıkla duyarlı görseller ekleme.
- **🎨 Sanat Galerisi & Lightbox:**
  - Yüksek çözünürlüklü dijital eserler, teknik detaylar ve tam ekran lightbox önizleyici.
- **🌓 Karanlık / Aydınlık Mod:**
  - Zarif tipografi ve yumuşak geçişli modern arayüz tasarımı.
- **⚡ Kesintisiz Çalışma (Fault-Tolerant):**
  - Supabase Cloud entegrasyonu ve çevrimdışı / rate-limit senaryolarında dahi kesintisiz yerel depolama desteği.

---

## 🛠️ Teknolojiler

- **Frontend:** React 19, TypeScript, Vite
- **Stil & Tasarım:** Tailwind CSS v4, Lucide React, Framer Motion
- **Veritabanı & Depolama:** Supabase (PostgreSQL, Storage, Auth)

---

## 🚀 Başlangıç & Kurulum

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/MustafaBite/blog-story.git
cd blog-story
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Tanımlayın
`.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun:
```bash
cp .env.example .env
```

İçeriğini kendi yapılandırmanıza göre doldurun:
```env
VITE_ADMIN_EMAIL=mustafabite2357@gmail.com
VITE_AUTHOR_NAME=Mustafa

# İsteğe bağlı Supabase bağlantısı:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açarak uygulamayı kullanmaya başlayabilirsiniz.
