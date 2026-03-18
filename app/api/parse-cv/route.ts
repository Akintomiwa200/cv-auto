import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    let text = '';

    if (name.endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else if (name.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith('.pdf')) {
      text = extractPDFText(buffer);
    } else {
      text = buffer.toString('utf-8');
    }

    if (!text.trim()) return NextResponse.json({ error: 'Could not extract text' }, { status: 400 });
    return NextResponse.json({ text: text.trim() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 });
  }
}

function extractPDFText(buffer: Buffer): string {
  try {
    const content = buffer.toString('latin1');
    const texts: string[] = [];
    const re = /BT([\s\S]*?)ET/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const block = m[1];
      const sr = /\(([^)\\]|\\[\s\S])*\)/g;
      let sm;
      while ((sm = sr.exec(block)) !== null) {
        const s = sm[0].slice(1, -1)
          .replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
          .replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
        if (s.trim()) texts.push(s);
      }
    }
    return texts.length ? texts.join(' ').replace(/\s+/g, ' ').trim() : '';
  } catch {
    return '';
  }
}
