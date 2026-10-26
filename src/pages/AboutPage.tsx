import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Camera,
  Code2,
  PenLine,
  Palette,
  Heart,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const tools = [
  "iPad Pro & Apple Pencil",
  "Procreate",
  "Clip Studio Paint",
  "Adobe Photoshop",
  "Moleskine Eskiz Defteri & Mürekkep",
  "Notion & Obsidian",
];

const interests = [
  "Negatif alan estetiği",
  "Altın saat ışığı ve gölgeler",
  "Çocukluk hatıraları",
  "Botanik çizimler",
  "Eski sahaf dükkanları",
  "Uzun yürüyüşler",
  "Nitelikli kahve",
  "Sessizlik",
];

export function AboutPage() {
  const { theme } = useTheme();
  const { authorName, adminEmail } = useAuth();
  const isDark = theme === "dark";

  const cardBase = `p-6 sm:p-8 rounded-3xl border transition-all ${
    isDark
      ? "border-dark-700/60 bg-dark-800/40"
      : "border-slate-200 bg-white shadow-sm"
  }`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Profil Başlığı */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-16"
      >
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-brand-500/30 shadow-2xl bg-dark-800 flex items-center justify-center font-bold text-3xl font-serif gradient-text">
            {authorName.substring(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg text-white">
            <PenLine className="w-4 h-4" />
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            Hakkımda & Hikayem
          </span>
          <h1
            className={`font-serif text-4xl sm:text-5xl font-bold mt-1 mb-2 ${
              isDark ? "text-dark-50" : "text-slate-900"
            }`}
          >
            {authorName}
          </h1>
          <p
            className={`text-base sm:text-lg ${
              isDark ? "text-dark-300" : "text-slate-600"
            }`}
          >
            Yazar · Dijital İllüstratör · Sessiz detayların sadık gözlemcisi
          </p>
        </div>
      </motion.div>

      {/* Biyografi Metni */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 mb-16 text-base sm:text-lg leading-relaxed"
      >
        <p className={isDark ? "text-dark-300" : "text-slate-600"}>
          Kelimeler ve çizgilerle üretiyorum; bazen birbirlerinden tamamen
          bağımsız, bazen de bir odanın iki ucunda fısıldaşan iki dost gibi.
          Yazılarımda yaratıcılık sancılarını, hafızanın yanılsamalarını ve
          gözden kaçan günlük detayları irdeliyorum.
        </p>
        <p className={isDark ? "text-dark-300" : "text-slate-600"}>
          Kitaplarla dolu bir evde ve hiçbir zaman terbiye edilememiş yabani bir
          bahçede büyüdüm. İkisi de bana çok değerli bir hayat dersi verdi: Şeyler
          kendi doğal ritminde yeşerir ve yaratıcı sürecin en büyüleyici kısmı,
          asla önceden planlayamadığınız o tesadüfi fırça darbesidir.
        </p>
        <p className={isDark ? "text-dark-300" : "text-slate-600"}>
          Bu internet sitesi benim açık atölyem. Burada okuduğunuz bir pasaj veya
          gördüğünüz bir tablo sizde bir yankı uyandırırsa, yorumlarda veya
          e-posta yoluyla duymaktan mutluluk duyarım.
        </p>
      </motion.div>

      {/* Araçlar & İlgi Alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cardBase}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Palette
              className={`w-5 h-5 ${
                isDark ? "text-brand-400" : "text-brand-600"
              }`}
            />
            <h3
              className={`font-serif text-lg font-bold ${
                isDark ? "text-dark-100" : "text-slate-800"
              }`}
            >
              Kullandığım Araçlar
            </h3>
          </div>
          <ul className="space-y-2.5">
            {tools.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2.5 text-xs sm:text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span className={isDark ? "text-dark-300" : "text-slate-600"}>
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cardBase}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Heart
              className={`w-5 h-5 ${
                isDark ? "text-brand-400" : "text-brand-600"
              }`}
            />
            <h3
              className={`font-serif text-lg font-bold ${
                isDark ? "text-dark-100" : "text-slate-800"
              }`}
            >
              İlham Kaynakları & Tutkular
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <span
                key={item}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  isDark
                    ? "border-dark-700 bg-dark-800/80 text-dark-300"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* İletişim & Mesaj Gönderme */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={`${cardBase} text-center py-10`}
      >
        <h3
          className={`font-serif text-2xl sm:text-3xl font-bold mb-3 ${
            isDark ? "text-dark-50" : "text-slate-900"
          }`}
        >
          Bir Merhaba Deyin
        </h3>
        <p
          className={`text-sm mb-6 max-w-md mx-auto leading-relaxed ${
            isDark ? "text-dark-400" : "text-slate-600"
          }`}
        >
          İllüstrasyon siparişleri, ortak projeler veya sadece bir düşünceyi
          paylaşmak için doğrudan bana yazabilirsiniz.
        </p>

        <a
          href={`mailto:${adminEmail}`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/30 transition-all hover:-translate-y-0.5 mb-8"
        >
          <Mail className="w-4 h-4" />
          {adminEmail}
        </a>

        <div className="flex items-center justify-center gap-3">
          {[
            { icon: MessageCircle, href: "#", label: "Twitter" },
            { icon: Camera, href: "#", label: "Instagram" },
            { icon: Code2, href: "#", label: "GitHub" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className={`p-3 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                isDark
                  ? "border-dark-700 text-dark-400 hover:border-brand-500/50 hover:text-brand-300 hover:bg-brand-500/5"
                  : "border-slate-200 text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50"
              }`}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
