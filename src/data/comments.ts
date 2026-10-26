import type { Comment } from "../types";

export const initialComments: Comment[] = [
  {
    id: "c1",
    storyId: "1",
    storyTitle: "Sessizliğin Mimarisi",
    storySlug: "sessizligin-mimarisi",
    authorId: "user-reader-1",
    authorName: "Deniz Arda",
    authorEmail: "deniz@ornek.com",
    authorRole: "reader",
    content:
      "Tate Modern'deki Rothko tasviri beni derinden etkiledi. Gerçekten de günümüz dünyasında boşluğa tahammül edemiyoruz. Çok kıymetli bir bakış açısı.",
    createdAt: "2026-10-18T14:32:00Z",
  },
  {
    id: "c2",
    storyId: "1",
    storyTitle: "Sessizliğin Mimarisi",
    storySlug: "sessizligin-mimarisi",
    authorId: "user-admin",
    authorName: "Mustafa",
    authorEmail: "mustafabite2357@gmail.com",
    authorRole: "admin",
    content:
      "Çok teşekkür ederim! 'Ma' kavramı üzerine okumalar yaptıkça aslında hayatımızın da nefes alacak aralıklara muhtaç olduğunu daha iyi anlıyoruz.",
    createdAt: "2026-10-18T16:10:00Z",
  },
  {
    id: "c3",
    storyId: "2",
    storyTitle: "Altın Saati Kovalamak",
    storySlug: "altin-saati-kovalamak",
    authorId: "user-reader-2",
    authorName: "Selin Yurt",
    authorEmail: "selin@ornek.com",
    authorRole: "reader",
    content:
      "Sabah 04:52 detayı harika. O saatlerde dışarısının sakinliği hiçbir şeye değişilmez. Çizimlerinizin ışığı da bunu çok iyi hissettiriyor.",
    createdAt: "2026-10-02T10:15:00Z",
  },
  {
    id: "c4",
    storyId: "3",
    storyTitle: "Kötü Üretmenin Erdemi",
    storySlug: "kotu-uretmenin-erdemi",
    authorId: "user-reader-3",
    authorName: "Mert Karaca",
    authorEmail: "mert@ornek.com",
    authorRole: "reader",
    content:
      "Tam da bir süredir çizim masasından uzak kalmışken bu yazı ilaç gibi geldi. 'Acemi olma cesareti' notunu masamın üzerine yapıştırdım.",
    createdAt: "2026-09-12T19:45:00Z",
  },
];
