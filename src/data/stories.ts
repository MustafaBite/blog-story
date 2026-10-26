import type { Story } from "../types";

export const initialStories: Story[] = [
  {
    id: "1",
    slug: "sessizligin-mimarisi",
    title: "Sessizliğin Mimarisi",
    excerpt:
      "Boş alanların sözcüklerden daha güçlü konuştuğu anlar — hem sanatta hem de modern yaşamda negatif alanın felsefesi.",
    content: `
<h2>Öğrenmeyi Unuttuğumuz Dil</h2>
<p>
  Japon estetiğinde <em>ma</em> adı verilen kadim bir kavram vardır: Bir melodideki iki nota arasındaki bilinçli duraklama, feneri parıldatan gölge, odanın içindeki yaşanabilir boşluk. Batı dillerinde bunun doğrudan tek bir karşılığı olmaması, neye değer verdiğimiz hakkında çok şey fısıldıyor.
</p>
<p>
  Sürekli dolduruyoruz. Sessizlik bizi tedirgin ediyor, tablosuz bir duvar eksik hissettiriyor, toplantısız bir takvim başarısızlık gibi algılanıyor. Peki ya asıl anlatı o boşlukta saklıysa?
</p>
<blockquote>
  <p>"Negatif alan, formun yokluğu değildir. Formun bizzat nefes alan ciğeridir."</p>
</blockquote>
<h2>Tabloların Bana Dinlemeyi Öğrettiği Gün</h2>
<p>
  Bir keresinde Londra Tate Modern'de tek bir Rothko tablosunun karşısında neredeyse üç saat geçirdim. Sis içinde yüzen iki devasa renk bloğu... İnsanların bu soyut tuvalin önünde neden gözyaşlarına boğulduğunu anlamaya çalışıyordum.
</p>
<p>
  Cevap şuydu: Resim sizden karşılık olarak mutlak sessizlik talep ediyordu. Çözülecek şifreli bir hikaye, alkışlanacak bir el becerisi sunmuyordu. Sadece <strong>var oluyordu</strong> ve bu varoluşuyla sizin de sadece kendiniz olarak kalabileceğiniz bir sığınak açıyordu.
</p>
<h2>Eksilterek Tasarlamak</h2>
<p>
  İllüstrasyon çalışmalarımda artık boşluğa daha çok güveniyorum. İlk yıllarımda tuvalin her köşesini doldurma telaşındaydım. Şimdiki çizimlerimde ise geniş beyaz bir arazide tek başına duran bir figür ya da sınır çizgileri çekilmemiş bir gölge görüyorsunuz.
</p>
<p>
  Bazen insanlar "biraz daha detay ekleyemez misin?" diye soruyor. Fazlalık insana güvenli gelir. Oysa en cesur sanatsal karar çoğu zaman çıkarmayı seçtiğiniz çizgidir.
</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    tags: ["Deneme", "Tasarım", "Felsefe"],
    publishedAt: "2026-10-15T09:00:00Z",
    readingTime: 6,
    featured: true,
  },
  {
    id: "2",
    slug: "altin-saati-kovalamak",
    title: "Altın Saati Kovalamak",
    excerpt:
      "Işığın saha günlüğü — gün doğumunun ve batımının ilk ışıkları resim yapma ve dünyayı görme biçimimi nasıl değiştirdi?",
    content: `
<h2>Ekim Sabahında Saat 04:52</h2>
<p>
  Kuşlar henüz uyanmadan çalar saatim çaldı. Büyüdüğüm sazlıkların üzerinden doğacak güneşi yakalamak için yola koyuldum. Gerçek şafaktan önceki o birkaç dakikada sular akıl almaz bir kehribar rengine bürünür.
</p>
<p>
  Yanımda eskiz defterim, termosta soğumaya yüz tutmuş kahvem ve bugün göreceğim ışığın nihayet renk hakkındaki tüm sorularıma yanıt olacağına dair o saf inancım vardı.
</p>
<h2>Altının Fiziği ve Hissi</h2>
<p>
  Güneşin ufka yakın açısı, ışığın atmosferde daha uzun yol kat etmesine sebep olur; kısa mavi dalga boyları dağılırken geriye uzun kırmızı ve turuncular kalır. Fizik gayet basittir, ancak yarattığı duygu tarif edilemez.
</p>
<blockquote>
  <p>"Güneş dünyayı altına boyamaz; dünyanın zaten içinde sakladığı cevheri gün yüzüne çıkarır."</p>
</blockquote>
<p>
  Ressamların yüzyıllardır kovaladığı şey bir sıcaklıktan fazlasıdır: Işığın kazandığı ağırlık hissi. Gölgeler mora çalar, sıradan binalar sanki içten aydınlatılmış gibi parlar.
</p>
<h2>Elde Tutulamayanı Resmetmek</h2>
<p>
  Altın saatin en acımasız tarafı asla yerinde durmamasıdır. Siz doğru tonu palette bulana kadar ışık başka bir karaktere bürünmüştür. Bu bir eksiklik değil, yaratıcı sürecin ta kendisidir: Işığı sabitlemeye çalışmak yerine onun akışına teslim olmak.
</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    tags: ["Günlük", "Resim", "Doğa"],
    publishedAt: "2026-09-28T08:00:00Z",
    readingTime: 5,
    featured: true,
  },
  {
    id: "3",
    slug: "kotu-uretmenin-erdemi",
    title: "Kötü Üretmenin Erdemi",
    excerpt:
      "Bozuk eskizler, başarısız ilk taslaklar ve her gün yeniden acemi olabilme cesaretinin savunusu.",
    content: `
<h2>İlk Çizim Her Zaman Yanlıştır</h2>
<p>
  Yaptığım hiçbir kötü eskizi çöpe atmam. Nostaljiden değil, kanıt olarak saklarım. Başarısızlıklar yığını bir sürecin ispatıdır ve ortaya kayda değer bir şey koymanın tek garantili yolu bu süreçten geçer.
</p>
<p>
  Kültür olarak bitmiş esere tapınma eğilimindeyiz. Sergideki parlatılmış tabloyu, basılmış kitabı görürüz. Ancak o noktaya gelene kadar yırtılıp atılan sayfaları, sanatçının hiçbir şeyin çalışmadığı haftalarda yine de masaya oturuşunu görmeyiz.
</p>
<blockquote>
  <p>"Amatörler ilham perisini bekler. Profesyoneller ise masaya oturup iyi bir şey çıkana dek kötü şeyler üretir."</p>
</blockquote>
<h2>Yeni Başlayanların Özgürlüğü</h2>
<p>
  Üretmek isteyip de bir türlü başlayamayanlardan en sık duyduğum cümle şudur: <em>"Henüz yeterince iyi değilim."</em>
</p>
<p>
  Bu teknik olarak doğru, pratikte ise tamamen anlamsızdır. Bekleyerek iyi olamazsınız. Tek yol üretmektir; sakarca, dağınıkça ve yargılamadan.
</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
    tags: ["Deneme", "Yaratıcı Süreç", "Zanaat"],
    publishedAt: "2026-09-10T10:00:00Z",
    readingTime: 7,
    featured: true,
  },
  {
    id: "4",
    slug: "bellegin-rengi",
    title: "Belleğin Rengi",
    excerpt:
      "Zihnimiz geçmişi neden sıcak sepya tonlarıyla hatırlar? Ve anıları resmetmeye çalışan sanat bu yanılsamayla nasıl baş eder?",
    content: `
<h2>Güvenilmez Arşiv</h2>
<p>
  Hafıza bir fotoğraf albümü değildir. Bilişsel bilimciler bunu uzun zamandır biliyor ancak biz yine de hatıralarımızı tartışılmaz deliller gibi kabul etmekte ısrarcıyız.
</p>
<p>
  Oysa bir anıyı her hatırlayışımızda onu yeniden inşa ederiz. Boşlukları bugünkü duygularımızla boyar, detayları mantığımıza uydururuz.
</p>
<blockquote>
  <p>"Nostalji, geçmişi olduğundan daha güzel hatırlama sanatıdır; çünkü oradan sağ kurtulmuşuzdur."</p>
</blockquote>
<h2>Gerçek ile His Arasındaki Çizgi</h2>
<p>
  Çocukluğumun geçtiği evin mutfağını resmederken fayansların deseniyle uğraşmam. Benim aradığım şey o ikindi vaktinde camdan süzülen toz taneciklerinin hissettirdiği o mutlak güvenlik hissidir.
</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&q=80",
    tags: ["Deneme", "Hafıza", "Psikoloji"],
    publishedAt: "2026-08-22T11:00:00Z",
    readingTime: 5,
  },
  {
    id: "5",
    slug: "yalnizlik-uzerine-notlar",
    title: "Yalnızlık Üzerine Notlar",
    excerpt:
      "Masada tek başına kalmanın bereketi: Yaratıcı yalnızlık ile tecrit edilmişlik arasındaki ince fark.",
    content: `
<h2>Kendine Ait Bir Zihin</h2>
<p>
  Virginia Woolf para ve mekandan bahsederken asıl vurgusu içsel özgürlüktü. Üretebilmek için gürültünün ortasında açılmış sakin bir koridora ihtiyaç duyarız.
</p>
<p>
  Benim için bu alan her zaman sabahın erken saatleri olmuştur. Günün talepleri kapıya dayanmadan önce kimseye ait olmayan o birkaç saat...
</p>
<blockquote>
  <p>"Yalnızlıktan daha iyi bir yol arkadaşı bulamadım." — Henry David Thoreau</p>
</blockquote>
<p>
  Yalnızlık bir varış noktası değil, bir çalışma iklimidir. O iklimde ne ektiğiniz ise tamamen sizin ellerinizde.
</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=1200&q=80",
    tags: ["Deneme", "Farkındalık", "Yaratıcı Süreç"],
    publishedAt: "2026-08-05T09:30:00Z",
    readingTime: 4,
  },
  {
    id: "6",
    slug: "uzun-vadeye-bakis",
    title: "Uzun Vadeye Bakış",
    excerpt:
      "Yıllar süren zanaatın öğrettikleri: Sabır, birikim ve yaratıcısını aşan eserler bırakabilme arzusu.",
    content: `
<h2>Yirmi Yıllık Pratik</h2>
<p>
  Yirmi yıldır aralıksız çiziyorum ve yazıyorum. Her zaman harika şeyler çıkmadı elbette. Ancak yetişkin hayatımda ellerimle bir şey üretmediğim tek bir ay bile geçmedi.
</p>
<p>
  Geriye dönüp baktığımda; beni utandıran ilk işlerimi, teknik olarak gelişip duygusal olarak kuruduğum orta dönemi ve nihayet ikisinin el sıkıştığı bugünü görüyorum.
</p>
<blockquote>
  <p>"Meşe palamutta, kuş yumurtada uyur; ruhun en yüksek vizyonunda ise uyanan bir melek kıpırdar."</p>
</blockquote>
<p>
  Yaratıcı emek doğrusal artmaz, bileşik faiz gibi katlanarak çoğalır. Yılların emeği bir gün beklenmedik bir derinlik olarak karşınıza dikilir.
</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1560762484-813fc97650a0?w=1200&q=80",
    tags: ["Deneme", "Felsefe", "Zanaat"],
    publishedAt: "2026-07-18T08:00:00Z",
    readingTime: 6,
  },
];
