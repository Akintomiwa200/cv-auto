// lib/docx-generator.ts
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat,
} from 'docx';

// ── Colours ──────────────────────────────────────────────────────────────────
const C = {
  navy:  '0A2540', teal:  '0D7C66', gold:  'C9A84C',
  dark:  '1A1A2E', mid:   '4A4A6A', light: '8A9AB0',
  line:  'DDDDDD', white: 'FFFFFF', bg:    'F4F8FF',
};

// ── Border helpers ────────────────────────────────────────────────────────────
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: none, bottom: none, left: none, right: none };
const thickNavy = { style: BorderStyle.SINGLE, size: 14, color: C.navy };
const thinGrey  = { style: BorderStyle.SINGLE, size: 4,  color: C.line };

// ── Numbering config ──────────────────────────────────────────────────────────
const NUMBERING = {
  config: [{
    reference: 'bullets', levels: [{
      level: 0, format: LevelFormat.BULLET, text: '▸',
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 480, hanging: 280 } } },
    }],
  }],
};

// ── Page sizes ────────────────────────────────────────────────────────────────
const A4 = { size: { width: 11906, height: 16838 }, margin: { top: 900, right: 900, bottom: 900, left: 900 } };
const A4_TIGHT = { size: { width: 11906, height: 16838 }, margin: { top: 700, right: 800, bottom: 700, left: 800 } };

// ── Shared paragraph helpers ─────────────────────────────────────────────────
function sp(before: number = 80) { 
  return new Paragraph({ children: [], spacing: { before, after: 0 } }); 
}

function sectionHead(text: string, colour = C.navy) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 20, font: 'Calibri', color: colour, allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: colour, space: 4 } },
    spacing: { before: 220, after: 100 },
  });
}

function run(text: string, opts: { bold?: boolean; italic?: boolean; size?: number; color?: string } = {}) {
  return new TextRun({ 
    text, 
    font: 'Calibri', 
    size: opts.size ?? 20, 
    color: opts.color ?? C.mid, 
    bold: opts.bold, 
    italics: opts.italic 
  });
}

function para(children: TextRun[], spacing?: { before?: number; after?: number }, align?: typeof AlignmentType[keyof typeof AlignmentType]) {
  return new Paragraph({ 
    children, 
    spacing: spacing ? { before: spacing.before || 0, after: spacing.after || 0 } : { after: 80 },
    alignment: align 
  });
}

function bul(text: string, size = 19) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [run(text, { size })],
    spacing: { after: 60 },
  });
}

// ── Convert basic Markdown to docx paragraphs ─────────────────────────────────
function mdToDocx(markdown: string): Paragraph[] {
  const lines = markdown.split('\n');
  const result: Paragraph[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      result.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2), bold: true, size: 36, font: 'Calibri', color: C.navy })],
        border: { bottom: thickNavy },
        spacing: { after: 80 },
      }));
    } else if (line.startsWith('## ')) {
      result.push(sectionHead(line.slice(3)));
    } else if (line.startsWith('### ')) {
      result.push(para([run(line.slice(4), { bold: true, size: 21, color: C.dark })], { before: 140, after: 40 }));
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(bul(line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')));
    } else if (line.trim() === '---') {
      result.push(new Paragraph({ border: { bottom: thinGrey }, children: [], spacing: { before: 80, after: 80 } }));
    } else if (line.trim() === '') {
      result.push(sp(50));
    } else {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const runs = parts.map(p =>
        p.startsWith('**') && p.endsWith('**')
          ? run(p.slice(2, -2), { bold: true, size: 20 })
          : run(p)
      );
      result.push(para(runs, { after: 70 }, AlignmentType.JUSTIFIED));
    }
  }
  return result;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. CV — Full Nigerian format from markdown
// ══════════════════════════════════════════════════════════════════════════════
export async function generateCVDocx(markdown: string, name: string): Promise<Buffer> {
  const doc = new Document({
    numbering: NUMBERING,
    sections: [{ properties: { page: A4 }, children: mdToDocx(markdown) }],
  });
  return Packer.toBuffer(doc);
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. RESUME — Modern two-column from markdown
// ══════════════════════════════════════════════════════════════════════════════
export async function generateResumeDocx(markdown: string, name: string): Promise<Buffer> {
  const lines = markdown.split('\n');

  // Extract sections
  const headerLines: string[] = [];
  const leftLines: string[] = [];
  const rightLines: string[] = [];

  let currentSection = 'header';
  for (const line of lines) {
    if (line.startsWith('# ')) { 
      headerLines.push(line); 
      continue; 
    }
    const low = line.toLowerCase();
    if (low.startsWith('## ')) {
      if (low.includes('skill') || low.includes('education') || low.includes('nysc') || low.includes('cert')) {
        currentSection = 'left';
      } else {
        currentSection = 'right';
      }
    }
    if (currentSection === 'header') {
      headerLines.push(line);
    } else if (currentSection === 'left') {
      leftLines.push(line);
    } else {
      rightLines.push(line);
    }
  }

  const headerChildren = mdToDocx(headerLines.join('\n'));
  const leftChildren  = mdToDocx(leftLines.join('\n'));
  const rightChildren = mdToDocx(rightLines.join('\n'));

  const headerTable = new Table({
    width: { size: 10306, type: WidthType.DXA },
    columnWidths: [10306],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: C.navy, type: ShadingType.CLEAR },
            borders: noBorders,
            width: { size: 10306, type: WidthType.DXA },
            margins: { top: 200, bottom: 200, left: 300, right: 300 },
            children: [
              ...lines.filter(l => l.startsWith('# ')).map(l =>
                new Paragraph({ 
                  children: [run(l.slice(2), { bold: true, size: 44, color: C.white })], 
                  spacing: { after: 60 } 
                })
              ),
              new Paragraph({ 
                children: [run(name, { size: 19, color: 'A8C8FF', italic: true })], 
                spacing: { after: 0 } 
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const bodyTable = new Table({
    width: { size: 10306, type: WidthType.DXA },
    columnWidths: [3400, 160, 6746],
    rows: [
      new TableRow({
        children: [
          new TableCell({ 
            borders: noBorders, 
            width: { size: 3400, type: WidthType.DXA }, 
            margins: { top: 0, bottom: 0, left: 0, right: 200 }, 
            children: leftChildren 
          }),
          new TableCell({ 
            borders: { 
              top: none, 
              bottom: none, 
              left: { style: BorderStyle.SINGLE, size: 6, color: C.line }, 
              right: none 
            }, 
            width: { size: 160, type: WidthType.DXA }, 
            children: [sp()] 
          }),
          new TableCell({ 
            borders: noBorders, 
            width: { size: 6746, type: WidthType.DXA }, 
            margins: { top: 0, bottom: 0, left: 200, right: 0 }, 
            children: rightChildren 
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    numbering: NUMBERING,
    sections: [{
      properties: { page: A4_TIGHT },
      children: [headerTable, sp(160), bodyTable],
    }],
  });
  return Packer.toBuffer(doc);
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. COVER LETTER — Formal Nigerian letterhead
// ══════════════════════════════════════════════════════════════════════════════
export async function generateCoverLetterDocx(
  letterText: string,
  name: string,
  phone: string,
  email: string
): Promise<Buffer> {
  const paragraphs = letterText.split('\n').filter(l => l.trim());

  const doc = new Document({
    sections: [{
      properties: { page: A4 },
      children: [
        // Letterhead
        para([run(name, { bold: true, size: 34, color: C.navy })], { after: 50 }),
        para([run(`${phone}  ·  ${email}  ·  Lagos, Nigeria`, { size: 18, color: C.mid })], { after: 60 }),
        new Paragraph({ border: { bottom: thickNavy }, children: [], spacing: { after: 220 } }),

        // Letter body
        ...paragraphs.map((p, i) => {
          if (p.startsWith('Yours') || p.startsWith('Dear')) {
            const isYours = p.startsWith('Yours');
            return para(
              [run(p, { bold: true, size: 20, color: C.dark })], 
              { before: isYours ? 200 : 0, after: isYours ? 80 : 160 }
            );
          }
          if (p.startsWith('Re:')) {
            return para([run(p, { bold: true, size: 20, color: C.navy })], { after: 200 });
          }
          if (i > paragraphs.length - 5 && p === name) {
            return para([run(p, { bold: true, size: 22, color: C.navy })], { before: 280, after: 40 });
          }
          return para([run(p, { size: 20 })], { after: 140 }, AlignmentType.JUSTIFIED);
        }),
      ],
    }],
  });
  return Packer.toBuffer(doc);
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. EMAIL TEMPLATES DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════
export async function generateEmailTemplatesDocx(
  templates: Array<{ id: string; title: string; subject: string; body: string }>,
  name: string
): Promise<Buffer> {
  const children: Paragraph[] = [
    para([run('PROFESSIONAL EMAIL TEMPLATES', { bold: true, size: 36, color: C.navy })], { after: 60 }, AlignmentType.CENTER),
    para([run(`Prepared for ${name}  ·  Nigerian Corporate Standard`, { size: 18, color: C.mid })], { after: 60 }, AlignmentType.CENTER),
    new Paragraph({ border: { bottom: thickNavy }, children: [], spacing: { after: 40 } }),
    para([run('Fields in [brackets] must be personalised before sending.', { italic: true, size: 17, color: C.light })], { after: 0 }),
  ];

  for (const tmpl of templates) {
    children.push(
      sectionHead(`${tmpl.title.toUpperCase()}`),
      para(
        [run('SUBJECT LINE:', { bold: true, size: 19, color: C.teal }), run(`  ${tmpl.subject}`, { size: 19, color: C.dark })], 
        { after: 120 }
      ),
    );
    for (const line of tmpl.body.split('\n')) {
      if (!line.trim()) { 
        children.push(sp(60)); 
        continue; 
      }
      const isSalutation = line.startsWith('Dear') || line.startsWith('Yours');
      children.push(para(
        [run(line, { size: 19, bold: isSalutation, color: isSalutation ? C.dark : C.mid })],
        { after: isSalutation ? 100 : 60 },
        AlignmentType.JUSTIFIED
      ));
    }
  }

  const doc = new Document({ sections: [{ properties: { page: A4 }, children }] });
  return Packer.toBuffer(doc);
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. BIO & PROFILE SHEET
// ══════════════════════════════════════════════════════════════════════════════
export async function generateBioSheetDocx(
  bios: { linkedinHeadline: string; linkedinAbout: string; shortBio100: string; twitterBio: string; githubBio: string },
  name: string
): Promise<Buffer> {
  const section = (title: string, content: string) => [
    sectionHead(title),
    ...content.split('\n').filter(l => l.trim()).map(l =>
      para([run(l, { size: 20 })], { after: 80 }, AlignmentType.JUSTIFIED)
    ),
  ];

  const doc = new Document({
    sections: [{
      properties: { page: A4 },
      children: [
        para([run(name, { bold: true, size: 44, color: C.navy })], { after: 60 }),
        new Paragraph({ border: { bottom: thickNavy }, children: [], spacing: { after: 200 } }),
        ...section('LinkedIn Headline', bios.linkedinHeadline),
        ...section('LinkedIn About / Summary', bios.linkedinAbout),
        ...section('Short Bio (100 Words)', bios.shortBio100),
        ...section('Twitter / X Bio (160 chars)', bios.twitterBio),
        ...section('GitHub Bio', bios.githubBio),
      ],
    }],
  });
  return Packer.toBuffer(doc);
}