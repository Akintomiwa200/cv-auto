import { NigerianSector } from './types';

export const SECTOR_LANGUAGE: Record<NigerianSector, string> = {
  banking: 'KYC, AML/CFT, CBN regulations, IFRS, financial controls, loan portfolio management, treasury operations, credit analysis, NIBSS, NIP',
  oilandgas: 'HSE/HSSE, NAPIMS, NUPRC/DPR, NCDMB, upstream/downstream/midstream, OIM, well integrity, production optimization, OPEX/CAPEX',
  tech: 'Nigerian fintech ecosystem, NIBSS, CBN sandbox, NIP, NQR, React, Next.js, Node.js, cloud infrastructure, agile/scrum, CI/CD',
  ngo: 'M&E, MEAL framework, donor reporting (USAID, DFID, EU, UN agencies), LGA coordination, community mobilisation, logframe, KOBO/ODK',
  'civil-service': 'federal/state MDAs, due process, treasury single account (TSA), IPPIS, GIFMIS, policy implementation, parastatal management',
  fmcg: 'route-to-market, distributor management, Nielsen data, category management, trade marketing, van sales, numerical/weighted distribution',
  general: 'stakeholder management, strategic thinking, cross-functional collaboration, project delivery, KPI management',
};

export function getCVTailorPrompt(cv: string, jobDescription: string, sector: NigerianSector = 'general'): string {
  return `You are a senior Nigerian CV writer. Rewrite this CV for the Nigerian job market, tailored to the job description.

ORIGINAL CV:
${cv}

JOB DESCRIPTION:
${jobDescription}

SECTOR LANGUAGE TO USE WHERE RELEVANT: ${SECTOR_LANGUAGE[sector]}

Nigerian CV Standards:
1. Keep ALL true information — never fabricate
2. Personal Information section: Full Name, Address (State, Nigeria), Phone (+234), Email, LinkedIn
   Include if present: Date of Birth, State of Origin, Nationality, Marital Status, NYSC Status
3. Career Objective: 3–4 sentences tailored to this role; start "A results-driven [profession] with X years..."
4. Educational Qualifications (most recent first): Degree · Institution · Year · Class if strong
   Correct full Nigerian institution names. Include WAEC/NECO O'Level for junior roles.
5. Professional Experience (most recent first): Company · Title · Period
   Use action verbs: Spearheaded · Coordinated · Liaised with · Interfaced with · Facilitated · Supervised · Championed
   Quantify with % · ₦ amounts · team sizes · project values
6. Skills: technical + soft skills relevant to role
7. Professional Certifications (ICAN · CIPM · COREN · NSE · NIM · ACCA · PMP etc.) with year
8. NYSC: State of service · Year · CDS activity
9. Referees: 2 referees OR "Available on request"

Language: Formal Nigerian English. Use ₦ for naira. Date format: "January 2020". 2–3 pages max.

Output ONLY the CV in clean Markdown. No commentary.`;
}

export function getResumeTailorPrompt(cv: string, jobDescription: string): string {
  return `You are an expert resume writer for the Nigerian tech/professional market. Create a concise, modern ONE-PAGE resume.

ORIGINAL CV:
${cv}

JOB DESCRIPTION:
${jobDescription}

Format as clean Markdown (one page worth of content):
# [Full Name]
**[Job Title]** | [Phone] | [Email] | [City, Nigeria] | [LinkedIn]

## Profile
[2–3 sentence punchy summary tailored to this role]

## Technical Skills
[Categorised skills grid: Frontend · Backend · Mobile · Tools · Databases]

## Experience
### [Job Title] — [Company] | [Period]
- [Bullet: achievement-focused, quantified]

## Education
[Degree · Institution · Year]

## NYSC
[Status · Year]

## Key Projects
[Name: one-line description]

Rules: One page only. Bullets max 8 words each. No full sentences. Achievement-first. Output ONLY the resume Markdown.`;
}

export function getCoverLetterPrompt(cv: string, jobDescription: string, senderName: string, targetCompany?: string, targetRole?: string): string {
  return `You are a Nigerian career consultant writing a formal cover letter.

CANDIDATE CV:
${cv}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE NAME: ${senderName}
TARGET COMPANY: ${targetCompany || '[Company Name]'}
TARGET ROLE: ${targetRole || '[Role Title]'}

Write a full formal Nigerian cover letter following these rules:
1. Date line: current month/year
2. Recipient: "The Hiring Manager / [Company Name] / [City], Nigeria"
3. Subject: "Re: Application for the Position of [Role Title]"
4. Salutation: "Dear Sir/Ma,"
5. Para 1: State the role, where advertised, and one-line who the candidate is
6. Para 2: 2–3 specific qualifications matched to job requirements; reference certifications/experience by name
7. Para 3: Show genuine interest in the company; mention their reputation/sector specifically
8. Para 4: Request interview; confirm CV is attached; state availability
9. Sign-off: "Yours faithfully,"
10. Name, phone, email on separate lines

TONE: Formal, respectful, confident. Never use "I'm excited", "I'd love", or contractions.
USE: "I write to express...", "I wish to apply...", "Kindly find attached...", "I look forward to the opportunity..."

Output ONLY the cover letter text. No markdown headers. Plain formatted text.`;
}

export function getEmailTemplatePrompt(cv: string, jobDescription: string, senderName: string): string {
  return `You are a Nigerian career consultant. Generate 5 professional Nigerian email templates.

CANDIDATE: ${senderName}
CV SUMMARY: ${cv.substring(0, 800)}
JOB CONTEXT: ${jobDescription.substring(0, 400)}

Generate exactly this JSON structure:
{
  "templates": [
    {
      "id": "job-application",
      "title": "Job Application Email",
      "subject": "...",
      "body": "..."
    },
    {
      "id": "follow-up",
      "title": "Follow-Up After Application",
      "subject": "...",
      "body": "..."
    },
    {
      "id": "interview-confirm",
      "title": "Interview Confirmation",
      "subject": "...",
      "body": "..."
    },
    {
      "id": "referral",
      "title": "Referral / Networking",
      "subject": "...",
      "body": "..."
    },
    {
      "id": "thank-you",
      "title": "Post-Interview Thank You",
      "subject": "...",
      "body": "..."
    }
  ]
}

Each body must:
- Open with "Dear Sir/Ma," or "Dear [Name],"
- Use "I write to express..." not "I'm excited to..."
- Use "Kindly find attached..." for documents
- Close with "Yours faithfully," or "Yours sincerely,"
- End with: ${senderName} / [Phone] / [Email]

Output ONLY the JSON. No markdown, no preamble.`;
}

export function getBioSheetPrompt(cv: string, senderName: string): string {
  return `You are a personal branding expert for Nigerian tech professionals.

CV:
${cv}

CANDIDATE: ${senderName}

Generate this JSON:
{
  "linkedinHeadline": "...",
  "linkedinAbout": "...",
  "shortBio100": "...",
  "twitterBio": "...",
  "githubBio": "..."
}

Rules:
- linkedinHeadline: max 120 chars, skills-focused, include "Lagos, Nigeria" or "Nigeria"
- linkedinAbout: 4 short paragraphs, professional tone, end with open-to-work line
- shortBio100: exactly ~100 words, third person, professional
- twitterBio: max 160 chars, include 🇳🇬
- githubBio: 1–2 sentences, developer-focused

Output ONLY the JSON.`;
}
