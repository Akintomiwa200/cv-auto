import { PDFDocument, rgb, StandardFonts, RGB } from 'pdf-lib';

interface FontSet {
  regular: Awaited<ReturnType<PDFDocument['embedFont']>>;
  bold: Awaited<ReturnType<PDFDocument['embedFont']>>;
  italic: Awaited<ReturnType<PDFDocument['embedFont']>>;
}

const NAVY  = rgb(0.039, 0.145, 0.251);
const TEAL  = rgb(0.051, 0.486, 0.400);
const DARK  = rgb(0.102, 0.102, 0.180);
const MID   = rgb(0.290, 0.290, 0.420);
const LIGHT = rgb(0.545, 0.604, 0.627);
const LINE  = rgb(0.867, 0.867, 0.867);

export async function generateCVPdf(markdown: string, _name: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const fonts: FontSet = {
    regular: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    bold:    await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    italic:  await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
  };

  const margin = 45;
  const pageW = 595;
  const pageH = 842;
  const contentW = pageW - margin * 2;

  let page = pdfDoc.addPage([pageW, pageH]);
  let y = pageH - margin;

  function newPage() {
    page = pdfDoc.addPage([pageW, pageH]);
    y = pageH - margin;
  }

  function checkY(needed: number) {
    if (y < margin + needed) newPage();
  }

  function drawText(text: string, x: number, yPos: number, font: typeof fonts.regular, size: number, color: RGB) {
    page.drawText(text, { x, y: yPos, font, size, color });
  }

  function wrapText(text: string, font: typeof fonts.regular, size: number, maxW: number): string[] {
    const words = text.replace(/[^\x20-\x7E\u00A0-\u024F]/g, '').split(' ').filter(Boolean);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      try {
        if (font.widthOfTextAtSize(test, size) > maxW && cur) {
          lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      } catch { cur = test; }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }

  function drawWrapped(text: string, x: number, maxW: number, font: typeof fonts.regular, size: number, color: RGB, lineH: number): number {
    const lines = wrapText(text, font, size, maxW);
    for (const l of lines) {
      checkY(lineH + 4);
      drawText(l, x, y, font, size, color);
      y -= lineH;
    }
    return y;
  }

  const mdLines = markdown.split('\n');

  for (const line of mdLines) {
    if (line.startsWith('# ')) {
      const text = line.slice(2);
      checkY(36);
      drawText(text, margin, y, fonts.bold, 18, NAVY);
      y -= 22;
      checkY(4);
      page.drawLine({ start: { x: margin, y }, end: { x: pageW - margin, y }, thickness: 1.5, color: NAVY });
      y -= 10;
    } else if (line.startsWith('## ')) {
      const text = line.slice(3).toUpperCase();
      y -= 12;
      checkY(20);
      drawText(text, margin, y, fonts.bold, 9, TEAL);
      y -= 6;
      page.drawLine({ start: { x: margin, y }, end: { x: pageW - margin, y }, thickness: 0.5, color: LINE });
      y -= 10;
    } else if (line.startsWith('### ')) {
      y -= 4;
      checkY(16);
      drawText(line.slice(4), margin, y, fonts.bold, 11, DARK);
      y -= 15;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = '• ' + line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1');
      checkY(13);
      drawWrapped(text, margin + 10, contentW - 10, fonts.regular, 9.5, MID, 13);
    } else if (line.trim() === '---') {
      y -= 6;
      checkY(4);
      page.drawLine({ start: { x: margin, y }, end: { x: pageW - margin, y }, thickness: 0.4, color: LINE });
      y -= 8;
    } else if (line.trim() === '') {
      y -= 6;
    } else {
      const clean = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      checkY(13);
      drawWrapped(clean, margin, contentW, fonts.regular, 9.5, MID, 13);
    }
  }

  return Buffer.from(await pdfDoc.save());
}
