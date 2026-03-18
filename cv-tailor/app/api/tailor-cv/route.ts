import { NextRequest, NextResponse } from 'next/server';
import {
  getCVTailorPrompt,
  getResumeTailorPrompt,
  getCoverLetterPrompt,
  getEmailTemplatePrompt,
  getBioSheetPrompt,
} from '@/lib/nigerian-prompts';
import { NigerianSector } from '@/lib/types';

type Mode = 'cv' | 'resume' | 'cover-letter' | 'email-templates' | 'bio-sheet' | 'email-body';

async function callClaude(system: string, user: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Claude error:', err);
    throw new Error('Claude API error');
  }
  const data = await res.json();
  return data.content[0]?.text ?? '';
}

function detectEmail(text: string): string {
  const m = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cv, jobDescription = '', senderName = 'The Candidate',
      mode = 'cv' as Mode,
      sector = 'general' as NigerianSector,
      targetCompany, targetRole, companyEmail,
    } = body;

    if (!cv) return NextResponse.json({ error: 'CV content required' }, { status: 400 });

    const detectedEmail = companyEmail || detectEmail(jobDescription);

    switch (mode as Mode) {
      // ── CV tailoring ──────────────────────────────────────────────────────
      case 'cv': {
        if (!jobDescription) return NextResponse.json({ error: 'Job description required' }, { status: 400 });
        const result = await callClaude(
          'You are a senior Nigerian CV writer. Output ONLY a clean Markdown CV. No preamble.',
          getCVTailorPrompt(cv, jobDescription, sector)
        );
        return NextResponse.json({ result, detectedEmail, emailDetected: !!detectedEmail });
      }

      // ── Resume ────────────────────────────────────────────────────────────
      case 'resume': {
        if (!jobDescription) return NextResponse.json({ error: 'Job description required' }, { status: 400 });
        const result = await callClaude(
          'You are an expert resume writer. Output ONLY clean Markdown resume content. No preamble.',
          getResumeTailorPrompt(cv, jobDescription)
        );
        return NextResponse.json({ result });
      }

      // ── Cover letter ─────────────────────────────────────────────────────
      case 'cover-letter': {
        const result = await callClaude(
          'You are a Nigerian career consultant. Output ONLY the cover letter plain text. No markdown headers. No preamble.',
          getCoverLetterPrompt(cv, jobDescription, senderName, targetCompany, targetRole)
        );
        return NextResponse.json({ result });
      }

      // ── Email templates ──────────────────────────────────────────────────
      case 'email-templates': {
        const raw = await callClaude(
          'You are a Nigerian career consultant. Output ONLY valid JSON. No markdown, no explanation.',
          getEmailTemplatePrompt(cv, jobDescription, senderName)
        );
        try {
          const cleaned = raw.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return NextResponse.json({ templates: parsed.templates });
        } catch {
          return NextResponse.json({ error: 'Failed to parse templates JSON' }, { status: 500 });
        }
      }

      // ── Bio sheet ────────────────────────────────────────────────────────
      case 'bio-sheet': {
        const raw = await callClaude(
          'You are a personal branding expert. Output ONLY valid JSON. No markdown, no explanation.',
          getBioSheetPrompt(cv, senderName)
        );
        try {
          const cleaned = raw.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return NextResponse.json({ bios: parsed });
        } catch {
          return NextResponse.json({ error: 'Failed to parse bio JSON' }, { status: 500 });
        }
      }

      // ── Single email body ────────────────────────────────────────────────
      case 'email-body': {
        const raw = await callClaude(
          `You are a Nigerian career consultant. Output ONLY valid JSON: {"subject":"...","body":"..."}`,
          `Write a Nigerian job application email.
CANDIDATE: ${senderName}
CV SUMMARY: ${cv.substring(0, 600)}
JOB: ${jobDescription.substring(0, 600)}
COMPANY: ${targetCompany || '[Company]'}
ROLE: ${targetRole || '[Role]'}

Rules: Open "Dear Sir/Ma,". Use "I write to express...". Close "Yours faithfully,". Sign: ${senderName}.
Subject format: "Application for the Position of [Role] — ${senderName}"`
        );
        try {
          const cleaned = raw.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return NextResponse.json({ subject: parsed.subject, body: parsed.body, detectedEmail });
        } catch {
          return NextResponse.json({ subject: `Application — ${senderName}`, body: raw, detectedEmail });
        }
      }

      default:
        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
