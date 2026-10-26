/**
 * İstemci tarafında (Tarayıcıda) PDF dosyalarını çözümleyen ve
 * hikaye başlığı, özeti, içeriği ve okuma süresini çıkaran yardımcı modül.
 */

export interface ExtractedPdfStory {
  title: string;
  excerpt: string;
  content: string;
  readingTime: number;
  tags: string[];
  rawText: string;
  hasText: boolean;
}

/**
 * PDF dosyasını okur ve metin içeriğini ayrıştırır.
 */
export async function extractStoryFromPdf(file: File): Promise<ExtractedPdfStory> {
  const fallbackTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // 1. Akışları (Streams) ayıkla ve zlib/deflate ile aç
    const extractedStreams = await extractPdfStreams(bytes);

    // 2. Metin parçalarını topla
    const textPieces: string[] = [];

    for (const streamStr of extractedStreams) {
      const extracted = parseTextFromStream(streamStr);
      if (extracted.length > 0) {
        textPieces.push(...extracted);
      }
    }

    // Ham metni temizle ve birleştir
    const rawText = textPieces
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!rawText || rawText.length < 20) {
      // Metin katmanı yok (taranmış görsel PDF olabilir)
      return {
        title: fallbackTitle,
        excerpt: "Bu hikaye PDF formatında yüklenmiştir. Orijinal dokümanı indirebilir veya görüntüleyebilirsiniz.",
        content: `<p>Bu içerik <strong>${escapeHtml(file.name)}</strong> adlı PDF dokümanından yüklenmiştir. PDF dosyası hikayeye eklenmiş olup yukarıdaki bağlantıdan indirilebilir.</p>`,
        readingTime: 3,
        tags: ["PDF", "Doküman"],
        rawText: "",
        hasText: false,
      };
    }

    // 3. Paragraflara ayır
    const paragraphs = rawText
      .split(/(?<=[.!?])\s+(?=[A-ZĞÜŞİÖÇ])|\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10);

    const titleCandidate = paragraphs[0]?.slice(0, 90).trim() || fallbackTitle;
    const excerptCandidate =
      paragraphs[1]?.slice(0, 250).trim() ||
      paragraphs[0]?.slice(0, 200).trim() ||
      "";

    // İçeriği zengin HTML olarak biçimlendir
    const htmlContent = (paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("\n\n");

    const wordCount = rawText.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 180));

    // Otomatik etiket önerileri
    const tags: string[] = ["PDF"];
    const lower = rawText.toLowerCase();
    if (lower.includes("sanat") || lower.includes("estetik") || lower.includes("tasarım")) tags.push("Sanat");
    if (lower.includes("felsefe") || lower.includes("düşünce") || lower.includes("zaman")) tags.push("Felsefe");
    if (lower.includes("edebiyat") || lower.includes("şiir") || lower.includes("hikaye")) tags.push("Edebiyat");
    if (lower.includes("teknoloji") || lower.includes("yapay") || lower.includes("kod")) tags.push("Teknoloji");
    if (tags.length === 1) tags.push("Deneme");

    return {
      title: titleCandidate,
      excerpt: excerptCandidate,
      content: htmlContent || `<p>${escapeHtml(rawText)}</p>`,
      readingTime,
      tags: tags.slice(0, 3),
      rawText,
      hasText: true,
    };
  } catch (error) {
    console.warn("PDF metin çıkarma hatası:", error);
    return {
      title: fallbackTitle,
      excerpt: "PDF dosyasından oluşturuldu.",
      content: `<p>PDF dosyası başarıyla yüklendi: <strong>${escapeHtml(file.name)}</strong></p>`,
      readingTime: 2,
      tags: ["PDF"],
      rawText: "",
      hasText: false,
    };
  }
}

/**
 * PDF baytları içindeki /Filter /FlateDecode akışlarını bulur ve çözer
 */
async function extractPdfStreams(bytes: Uint8Array): Promise<string[]> {
  const results: string[] = [];
  const latin1Decoder = new TextDecoder("latin1");
  const rawString = latin1Decoder.decode(bytes);

  // Akış regex'i: stream ... endstream
  const streamRegex = /stream[\r\n]+([\s\S]*?)endstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawString)) !== null) {
    const streamStart = match.index + match[0].indexOf("stream") + 6;
    // Satır sonunu atla (\r\n veya \n)
    let actualStart = streamStart;
    if (bytes[actualStart] === 13) actualStart++; // \r
    if (bytes[actualStart] === 10) actualStart++; // \n

    const streamEnd = match.index + match[0].lastIndexOf("endstream");
    if (actualStart >= streamEnd) continue;

    const streamChunk = bytes.slice(actualStart, streamEnd);

    // DecompressionStream ile açmayı dene
    const decompressed = await tryDecompress(streamChunk);
    if (decompressed) {
      try {
        const decoded = new TextDecoder("utf-8", { fatal: false }).decode(decompressed);
        results.push(decoded);
      } catch {
        results.push(latin1Decoder.decode(decompressed));
      }
    } else {
      // Düz akış olabilir
      results.push(match[1]);
    }
  }

  // Ham metin de eklensin
  results.push(rawString);
  return results;
}

/**
 * Tarayıcının yerel DecompressionStream API'siyle Deflate/zlib çözer
 */
async function tryDecompress(data: Uint8Array): Promise<Uint8Array | null> {
  // 1. Standart deflate (zlib sarmalayıcı)
  if (typeof DecompressionStream !== "undefined") {
    try {
      const ds = new DecompressionStream("deflate");
      const writer = ds.writable.getWriter();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await writer.write(data as any);
      await writer.close();
      const response = new Response(ds.readable);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch {
      // 2. Ham deflate (raw deflate)
      try {
        const dsRaw = new DecompressionStream("deflate-raw");
        const writer = dsRaw.writable.getWriter();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await writer.write(data as any);
        await writer.close();
        const response = new Response(dsRaw.readable);
        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * BT ... ET blokları ve Tj / TJ operatörlerinden metin ayıklar
 */
function parseTextFromStream(streamStr: string): string[] {
  const pieces: string[] = [];

  // BT (Begin Text) ... ET (End Text) bloklarını yakala
  const btRegex = /BT[\s\S]*?ET/g;
  let btMatch: RegExpExecArray | null;

  while ((btMatch = btRegex.exec(streamStr)) !== null) {
    const block = btMatch[0];

    // (Metin) Tj
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const decoded = decodePdfString(tjMatch[1]);
      if (decoded.trim()) pieces.push(decoded);
    }

    // [(Metin1) -10 (Metin2)] TJ
    const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
    let arrMatch: RegExpExecArray | null;
    while ((arrMatch = tjArrayRegex.exec(block)) !== null) {
      const arrayBody = arrMatch[1];
      const strRegex = /\(([^)]*)\)/g;
      let strMatch: RegExpExecArray | null;
      let combined = "";
      while ((strMatch = strRegex.exec(arrayBody)) !== null) {
        combined += decodePdfString(strMatch[1]);
      }
      if (combined.trim()) pieces.push(combined);
    }
  }

  return pieces;
}

/**
 * PDF dize kaçışlarını ve Türkçe karakter kodlamalarını dönüştürür
 */
function decodePdfString(str: string): string {
  // UTF-16BE BOM kontrolü (\xfe\xff)
  if (str.startsWith("\xfe\xff") || str.startsWith("\\376\\377")) {
    let result = "";
    for (let i = 2; i < str.length; i += 2) {
      const code = (str.charCodeAt(i) << 8) | str.charCodeAt(i + 1);
      result += String.fromCharCode(code);
    }
    return result;
  }

  return str
    // Sekizli (Octal) kaçışlar: \307 -> Ç vb.
    .replace(/\\([0-7]{1,3})/g, (_, oct) => {
      const code = parseInt(oct, 8);
      // WinAnsi Türkçe eşleşmeleri
      if (code === 0o307) return "Ç";
      if (code === 0o347) return "ç";
      if (code === 0o326) return "Ö";
      if (code === 0o366) return "ö";
      if (code === 0o334) return "Ü";
      if (code === 0o374) return "ü";
      if (code === 0o336) return "Ş";
      if (code === 0o376) return "ş";
      if (code === 0o320) return "Ğ";
      if (code === 0o360) return "ğ";
      if (code === 0o335) return "İ";
      if (code === 0o375) return "ı";
      return String.fromCharCode(code);
    })
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
