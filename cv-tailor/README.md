# CV Tailor NG 🇳🇬

> **AI-powered Nigerian job application suite** — tailor CVs, write cover letters, generate email templates, build resumes, create bio sheets, and send applications — all formatted to Nigerian corporate standards.

## Features
- CV Tailoring (upload CV + job advert → AI rewrites with Nigerian sector language)
- Resume Builder (one-page two-column modern layout)
- Cover Letter Generator ("Dear Sir/Ma," · "Yours faithfully,")
- 5 Email Templates (Application · Follow-up · Interview · Referral · Thank-you)
- Bio & Profile Sheet (LinkedIn · Twitter/X · GitHub · Short bio)
- Direct Email Send (SMTP with CV attached as PDF)
- Download: PDF · DOCX · HTML · TXT
- 6 Nigerian sector templates (Banking · Oil & Gas · Tech · NGO · Civil Service · FMCG)

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Add ANTHROPIC_API_KEY and SMTP settings to .env.local
npm run dev
```

Open http://localhost:3000

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| ANTHROPIC_API_KEY | Yes | From console.anthropic.com |
| SMTP_HOST | For email | e.g. smtp.gmail.com |
| SMTP_PORT | For email | 587 |
| SMTP_USER | For email | Your email |
| SMTP_PASS | For email | Gmail App Password |

## Nigerian Standards
NYSC Status · State of Origin · ICAN/CIPM/COREN · CBN/NUPRC/NCDMB · "Dear Sir/Ma," · "Yours faithfully," · ₦ Naira · Jobberman-ready

## Tech Stack
Next.js 14 · TypeScript · Tailwind CSS · Claude AI · docx · pdf-lib · mammoth · nodemailer · framer-motion

## License
MIT — see LICENSE
