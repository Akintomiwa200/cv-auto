import { NextRequest, NextResponse } from 'next/server';
import { generateCVPdf } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { to, from, fromName, subject, body, cvContent, smtp } = await request.json();

    if (!to || !from || !subject || !body)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const cfg = smtp || {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || from,
      pass: process.env.SMTP_PASS || '',
    };

    if (!cfg.pass)
      return NextResponse.json({ error: 'SMTP password not configured. Set SMTP_PASS in .env.local or enter it in the UI.' }, { status: 400 });

    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      auth: { user: cfg.user || from, pass: cfg.pass },
    });

    // Verify connection
    await transporter.verify();

    const attachments = [];
    if (cvContent) {
      try {
        const pdf = await generateCVPdf(cvContent, fromName);
        attachments.push({
          filename: `${fromName.replace(/\s+/g, '_')}_CV.pdf`,
          content: pdf,
          contentType: 'application/pdf',
        });
      } catch (e) {
        console.error('PDF attachment error:', e);
      }
    }

    const htmlBody = `<div style="font-family:Georgia,serif;max-width:600px;line-height:1.7;color:#333;font-size:14px;">
      ${body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^/, '<p>').replace(/$/, '</p>')}
    </div>`;

    await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to,
      subject,
      text: body,
      html: htmlBody,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Send failed';
    console.error('Email error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
