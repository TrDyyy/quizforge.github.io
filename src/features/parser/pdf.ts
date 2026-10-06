type PdfTextItem = {
  str: string;
  transform: number[];
  hasEOL: boolean;
};

function isTextItem(item: unknown): item is PdfTextItem {
  if (!item || typeof item !== "object") return false;
  const value = item as Partial<PdfTextItem>;
  return typeof value.str === "string" && Array.isArray(value.transform);
}

export function textItemsToLines(items: unknown[]) {
  const lines: string[] = [];
  let current = "";
  let previousY: number | undefined;
  const flush = () => {
    const line = current.replace(/\s+/g, " ").trim();
    if (line) lines.push(line);
    current = "";
  };
  for (const rawItem of items) {
    if (!isTextItem(rawItem)) continue;
    const y = rawItem.transform[5];
    if (previousY !== undefined && Math.abs(y - previousY) > 2) flush();
    if (rawItem.str.trim()) current += `${current ? " " : ""}${rawItem.str}`;
    if (rawItem.hasEOL) flush();
    previousY = y;
  }
  flush();
  return lines.join("\n");
}

export async function extractTextFromPdf(file: File) {
  const pdfjs = await import("pdfjs-dist/webpack.mjs");
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const document = await loadingTask.promise;
  const pages: string[] = [];
  const pageCount = document.numPages;
  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(textItemsToLines(content.items));
      page.cleanup();
    }
  } finally {
    await document.cleanup();
    await loadingTask.destroy();
  }
  const text = pages.filter(Boolean).join("\n\n");
  if (text.replace(/\s/g, "").length < Math.max(30, pageCount * 12)) {
    throw new Error("PDF này có vẻ là bản scan hoặc không có lớp chữ. Hiện QuizForge chưa OCR được ảnh; hãy dùng PDF có thể bôi chọn chữ, DOCX hoặc TXT.");
  }
  return { text, pageCount };
}
