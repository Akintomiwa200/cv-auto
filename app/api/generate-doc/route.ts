// app/api/generate-doc/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  generateCVDocx, 
  generateResumeDocx, 
  generateCoverLetterDocx, 
  generateEmailTemplatesDocx, 
  generateBioSheetDocx 
} from '@/lib/docx-generator';
import { generateCVPdf } from '@/lib/pdf-generator';
import { DocType } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const {
      content, docType, format, candidateName,
      phone = '', email = '',
      templates, bios,
    } = await request.json();

    if (!content && !templates && !bios) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const safeName = (candidateName || 'CV').replace(/\s+/g, '_');

    // ===== TXT format =====
    if (format === 'txt') {
      const text = (content as string)
        .replace(/^# /gm, '')
        .replace(/^## /gm, '\n── ')
        .replace(/^### /gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/^- /gm, '• ')
        .replace(/^---$/gm, '─'.repeat(55));

      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeName}_${docType}.txt"`,
        },
      });
    }

    // ===== HTML format =====
    if (format === 'html') {
      const html = buildHTML(content, candidateName);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeName}_${docType}.html"`,
        },
      });
    }

    // ===== PDF or DOCX format =====
    let rawData: any;
    let mimeType: string;
    let ext: string;

    if (format === 'pdf') {
      rawData = await generateCVPdf(content, candidateName);
      mimeType = 'application/pdf';
      ext = 'pdf';
    } else {
      switch (docType as DocType) {
        case 'cv':
          rawData = await generateCVDocx(content, candidateName);
          break;
        case 'resume':
          rawData = await generateResumeDocx(content, candidateName);
          break;
        case 'cover-letter':
          rawData = await generateCoverLetterDocx(content, candidateName, phone, email);
          break;
        case 'email-templates':
          rawData = await generateEmailTemplatesDocx(templates || [], candidateName);
          break;
        case 'bio-sheet':
          rawData = await generateBioSheetDocx(bios || {}, candidateName);
          break;
        default:
          rawData = await generateCVDocx(content, candidateName);
      }
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      ext = 'docx';
    }

    const docLabel = {
      cv: 'CV',
      resume: 'Resume',
      'cover-letter': 'CoverLetter',
      'email-templates': 'EmailTemplates',
      'bio-sheet': 'BioSheet',
    }[docType as DocType] || 'Document';

    // Convert to base64 to avoid TypeScript buffer issues
    const buffer = Buffer.from(rawData);
    const base64 = buffer.toString('base64');

    // Return as JSON with base64 encoded data
    return NextResponse.json({
      success: true,
      data: base64,
      mimeType: mimeType,
      filename: `${safeName}_${docLabel}.${ext}`,
    });

  } catch (e) {
    console.error('generate-doc error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

// ===== Helper function: Markdown → HTML =====
function buildHTML(markdown: string, name: string): string {
  let processed = markdown;
  
  processed = processed.replace(/^# (.*)/gm, '<h1>$1</h1>');
  processed = processed.replace(/^## (.*)/gm, '<h2>$1</h2>');
  processed = processed.replace(/^### (.*)/gm, '<h3>$1</h3>');
  processed = processed.replace(/^- (.*)/gm, '<li>$1</li>');
  processed = processed.replace(/^\* (.*)/gm, '<li>$1</li>');
  processed = processed.replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul class="list">${match}</ul>`);
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  processed = processed.replace(/^---$/gm, '<hr>');
  
  const lines = processed.split('\n');
  const wrapped = lines.map(line => {
    if (line.trim() === '') return '';
    if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('</ul') || line.startsWith('<hr')) {
      return line;
    }
    return `<p>${line}</p>`;
  }).filter(line => line !== '').join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} - Professional CV</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Roboto', Georgia, serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 32px;
      color: #1f2937;
      line-height: 1.6;
      background: #ffffff;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #0a2540;
      border-bottom: 3px solid #0d7c66;
      padding-bottom: 0.75rem;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #0d7c66;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #374151;
    }
    p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    ul.list {
      margin-bottom: 1rem;
      padding-left: 2rem;
      list-style-type: disc;
    }
    li {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
    hr {
      margin: 2rem 0;
      border: none;
      border-top: 2px solid #e5e7eb;
    }
    strong {
      font-weight: 600;
      color: #0a2540;
    }
    em { font-style: italic; }
    @media print {
      body { padding: 20px; font-size: 12pt; }
      h1 { font-size: 20pt; }
      h2 { font-size: 16pt; }
      h3 { font-size: 14pt; }
    }
    @media (max-width: 768px) {
      body { padding: 24px 16px; }
      h1 { font-size: 1.875rem; }
      h2 { font-size: 1.25rem; }
    }
  </style>
</head>
<body>
  ${wrapped}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}