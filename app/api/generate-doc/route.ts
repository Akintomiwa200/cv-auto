import { NextRequest, NextResponse } from 'next/server';
import { generateCVDocx, generateResumeDocx, generateCoverLetterDocx, generateEmailTemplatesDocx, generateBioSheetDocx } from '@/lib/docx-generator';
import { generateCVPdf } from '@/lib/pdf-generator';
import { DocType, DownloadFormat } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const {
      content, docType, format, candidateName,
      phone = '', email = '',
      templates, bios,
    } = await request.json();

    if (!content && !templates && !bios) return NextResponse.json({ error: 'Content required' }, { status: 400 });

    const safeName = (candidateName || 'CV').replace(/\s+/g, '_');
    let fileBuffer: Buffer;
    let mimeType: string;
    let ext: string;

    if (format === 'txt') {
      const text = (content as string)
        .replace(/^# /gm, '').replace(/^## /gm, '\n── ')
        .replace(/^### /gm, '').replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/^- /gm, '• ').replace(/^---$/gm, '─'.repeat(55));
      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeName}_${docType}.txt"`,
        },
      });
    }

    if (format === 'html') {
      const html = buildHTML(content, candidateName);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeName}_${docType}.html"`,
        },
      });
    }

    if (format === 'pdf') {
      fileBuffer = await generateCVPdf(content, candidateName);
      mimeType = 'application/pdf';
      ext = 'pdf';
    } else {
      // DOCX
      switch (docType as DocType) {
        case 'cv':
          fileBuffer = await generateCVDocx(content, candidateName);
          break;
        case 'resume':
          fileBuffer = await generateResumeDocx(content, candidateName);
          break;
        case 'cover-letter':
          fileBuffer = await generateCoverLetterDocx(content, candidateName, phone, email);
          break;
        case 'email-templates':
          fileBuffer = await generateEmailTemplatesDocx(templates || [], candidateName);
          break;
        case 'bio-sheet':
          fileBuffer = await generateBioSheetDocx(bios || {}, candidateName);
          break;
        default:
          fileBuffer = await generateCVDocx(content, candidateName);
      }
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      ext = 'docx';
    }

    const docLabel = {
      cv: 'CV', resume: 'Resume', 'cover-letter': 'CoverLetter',
      'email-templates': 'EmailTemplates', 'bio-sheet': 'BioSheet',
    }[docType as DocType] || 'Document';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${safeName}_${docLabel}.${ext}"`,
      },
    });
  } catch (e) {
    console.error('generate-doc error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function buildHTML(markdown: string, name: string): string {
  const body = markdown
    .replace(/^# (.*)/gm, '<h1>$1</h1>')
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/^\- (.*)/gm, '<li>$1</li>')
    .replace(/^\* (.*)/gm, '<li>$1</li>')
    .replace(/<li>[\s\S]*?<\/li>/g, m => `<ul>${m}</ul>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr>')
    .split('\n').map(l => l.startsWith('<') ? l : `<p>${l}</p>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${name} — CV</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 40px; color: #1a1a2e; line-height: 1.65; }
  h1 { font-size: 28px; border-bottom: 2.5px solid #0A2540; padding-bottom: 10px; margin-bottom: 6px; color: #0A2540; }
  h2 { font-size: 10.5px; text-transform: uppercase; letter-spacing: .13em; color: #0D7C66; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 28px; margin-bottom: 12px; }
  h3 { font-size: 14px; font-weight: 600; margin-top: 16px; margin-bottom: 3px; }
  p { font-size: 12.5px; margin-bottom: 6px; }
  ul { padding-left: 18px; } li { font-size: 12.5px; margin-bottom: 3px; }
  hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
  @media print { body { margin: 0; padding: 20px; } }
</style>
</head>
<body>${body}</body>
</html>`;
}
