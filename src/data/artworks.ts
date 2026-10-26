import type { Artwork } from "../types";

export const initialArtworks: Artwork[] = [
  {
    id: "1",
    title: "Eşik Mavisi",
    description:
      "Araftaki mekanların görsel etüdü — havalimanı bekleme salonları, nefes alıp verme arasındaki o duraklama anı. Figür ne burada ne de orada, tam sınır çizgisinde duruyor.",
    imageUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1600&q=90",
    tags: ["Dijital Resim", "Kavramsal", "Mavi Tonlar"],
    createdAt: "2026-10-01T00:00:00Z",
    medium: "Dijital — iPad Pro & Procreate",
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "2",
    title: "Orman Hafızası No:7",
    description:
      "Çocukluk manzaralarını fotoğraftan değil de sadece zihindeki izlerden yola çıkarak yeniden kurma serisi. Ağaçların boyu ve oranları, hatıraların abartılı doğası gibi biçimlendi.",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=90",
    tags: ["Dijital Resim", "Doğa", "Seri"],
    createdAt: "2026-09-15T00:00:00Z",
    medium: "Dijital — Clip Studio Paint",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    id: "3",
    title: "N. Portresi",
    description:
      "Klasik bir sipariş olarak başlayan ancak zamanla derin bir içsel portreye evrilen bir çalışma. Yüz hatlarından ziyade gözlerdeki yorgun tebessüme odaklanıldı.",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=90",
    tags: ["Portre", "Figüratif"],
    createdAt: "2026-08-30T00:00:00Z",
    medium: "Dijital — Adobe Photoshop",
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "4",
    title: "İstanbul Çizimleri: Alacakaranlık",
    description:
      "İstanbul'da geçirilen bir haftanın hızlı mürekkep notları — Boğaz'ın akşam üstü ışığı, çay ocaklarının buğusu ve tarihi kemerlerin geometrisi.",
    imageUrl:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=90",
    tags: ["Eskiz", "Şehir", "Seyahat"],
    createdAt: "2026-08-10T00:00:00Z",
    medium: "Kağıt üzerine mürekkep & dijital renklendirme",
    aspectRatio: "landscape",
  },
  {
    id: "5",
    title: "Suyun Ağırlığı",
    description:
      "Suyun ışığı başka hiçbir yüzeyin tutamadığı şekilde yansıtması ve soğurması üzerine bir çalışma. Hem yansıtıcı hem de derin bir kuyu.",
    imageUrl:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600&q=90",
    tags: ["Dijital Resim", "Doğa", "Işık Etüdü"],
    createdAt: "2026-07-22T00:00:00Z",
    medium: "Dijital — Procreate",
    aspectRatio: "landscape",
  },
  {
    id: "6",
    title: "Konsept: Rüya Gören Makineler",
    description:
      "Yapay zekanın veri değil de görsel imgeler üzerinden rüya görebilseydi nasıl manzaralar kuracağına dair kavramsal bilim kurgu çalışması.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=90",
    tags: ["Konsept Sanatı", "Bilim Kurgu"],
    createdAt: "2026-07-05T00:00:00Z",
    medium: "Dijital — Photoshop & Blender",
    aspectRatio: "square",
  },
  {
    id: "7",
    title: "Botanik İllüstrasyonlar",
    description:
      "18. yüzyıl doğa bilimcilerinin titizliği ile modern illüstrasyon duyarlılığını harmanlayan detaylı yabani otlar serisi.",
    imageUrl:
      "https://images.unsplash.com/photo-1490750967868-88df5691cc5c?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1490750967868-88df5691cc5c?w=1600&q=90",
    tags: ["Eskiz", "Botanik", "Detay"],
    createdAt: "2026-06-18T00:00:00Z",
    medium: "Kurşun kalem & suluboya dokuları",
    aspectRatio: "portrait",
  },
  {
    id: "8",
    title: "Altın Saat Çalışması #3",
    description:
      "Açık havada yapılmış hızlı bir renk notunun atölyede dijital olarak geliştirilmiş hali; sonbaharın o sarı-mor zıtlığı.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=90",
    tags: ["Dijital Resim", "Işık Etüdü"],
    createdAt: "2026-06-01T00:00:00Z",
    medium: "Dijital — Clip Studio Paint",
    aspectRatio: "landscape",
  },
  {
    id: "9",
    title: "Defterden: Eller",
    description:
      "Anatomik çalışmalardan oluşan 50 el eskizinden biri. İnsan elinin ifade gücü yüz kadar zengin ve karmaşık.",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    highResUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&q=90",
    tags: ["Eskiz", "Anatomi", "Pratik"],
    createdAt: "2026-05-14T00:00:00Z",
    medium: "Grafit kalem",
    aspectRatio: "square",
  },
];
