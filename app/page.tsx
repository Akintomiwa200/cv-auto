'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Zap,
  Mail,
  Download,
  Layout,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
} from 'lucide-react';

// Features data
const FEATURES = [
  { icon: FileText, title: 'Upload Your CV', desc: 'PDF, DOCX or paste text. Our parser reads Nigerian CV fields — NYSC, state of origin, professional bodies.', color: '#0D7C66' },
  { icon: Zap, title: 'AI CV Tailoring', desc: 'Paste any job advert from Jobberman, LinkedIn or a company site. Claude rewrites your CV with sector-specific language.', color: '#C9A84C' },
  { icon: FileText, title: 'Resume Builder', desc: 'One-page modern tech resume for banks, fintechs, startups and multinationals. Two-column layout, clean and ATS-ready.', color: '#9B72CF' },
  { icon: Mail, title: 'Cover Letter Generator', desc: 'Full formal Nigerian cover letter — "Dear Sir/Ma," opening, proper qualifications match, "Yours faithfully," close.', color: '#E76F51' },
  { icon: Star, title: 'Email Templates', desc: 'Job application, follow-up, interview confirmation, referral, and post-interview thank-you — all Nigerian format.', color: '#457B9D' },
  { icon: FileText, title: 'Bio & Profile Sheet', desc: 'LinkedIn headline + About, 100-word bio, Twitter/X and GitHub bios — ready to paste.', color: '#2B9348' },
  { icon: Mail, title: 'Direct Email Send', desc: 'Send your application straight from the app via SMTP with your tailored CV attached as a PDF.', color: '#0D7C66' },
  { icon: Download, title: 'Download All Formats', desc: 'Export any document as PDF, DOCX, HTML or plain text in one click.', color: '#C9A84C' },
  { icon: Layout, title: 'Nigerian CV Templates', desc: 'Banking · Oil & Gas · Tech · NGO · Civil Service · FMCG — sector-specific starting points.', color: '#E76F51' },
];

const SECTORS = [
  'Banking / Finance',
  'Oil & Gas',
  'Technology / Fintech',
  'NGO / Development',
  'Civil Service',
  'FMCG / Sales',
];

const NAV_LINKS = [
  { href: '/templates', label: 'Templates' },
  { href: '/dashboard', label: 'Dashboard' },
];

const NIGERIAN_STANDARDS = [
  'NYSC Status Field',
  'State of Origin',
  'ICAN · CIPM · COREN',
  '"Dear Sir/Ma,"',
  '"Yours faithfully,"',
  '₦ Naira Formatting',
  'Jobberman-ready',
  'CBN · NUPRC · NIBSS',
];

// Client-only MotionDiv to avoid hydration errors
function MotionDiv({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF7] text-[#111111]">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center group-hover:bg-[#C9A84C]/30 transition-colors">
              <FileText className="w-4 h-4 text-[#0D7C66]" />
            </div>
            <span className="font-playfair text-lg font-bold">
              CV Tailor <span className="text-[#8B5CF6]">NG</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#111111]/70 hover:text-[#111111] transition-colors text-sm font-medium"
              >
                {label}
              </Link>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#9F7FFF] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
          >
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <MotionDiv delay={0}>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 text-[#8B5CF6] text-xs border border-[#8B5CF6]/20 bg-[#8B5CF6]/5">
                <Zap className="w-3 h-3" />
                Powered by Claude AI · Built for Nigeria 🇳🇬
              </div>

              <h1 className="font-playfair text-5xl md:text-6xl font-bold leading-tight mb-5">
                Your Nigerian CV,<br />
                <span className="text-[#8B5CF6]">perfectly tailored</span>
              </h1>

              <p className="text-[#111111]/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Upload your CV, paste any job advert from Jobberman or LinkedIn, and get a fully rewritten
                Nigerian-format CV, cover letter, email and more — in seconds.
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#9F7FFF] text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 text-sm"
                >
                  Open Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/templates"
                  className="flex items-center gap-2 border border-black/10 bg-white/80 hover:bg-white text-[#111111]/70 hover:text-[#111111] px-7 py-3.5 rounded-xl text-sm transition-all"
                >
                  View Templates
                </Link>
              </div>

              {/* Sector Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {SECTORS.map((sector) => (
                  <span
                    key={sector}
                    className="px-3 py-1 rounded-full border border-black/10 bg-white/50 text-xs text-[#111111]/60"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </MotionDiv>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {FEATURES.map((feature, index) => (
              <MotionDiv key={feature.title} delay={index * 0.05}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3`} style={{ backgroundColor: `${feature.color}20` }}>
                    <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-semibold text-[#111111] mb-1.5">{feature.title}</h3>
                  <p className="text-[#111111]/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Nigerian Standards Section */}
          <MotionDiv delay={0.4}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/10 text-center">
              <h2 className="font-playfair text-2xl font-bold mb-3">
                Built to Nigerian Standards
              </h2>
              <p className="text-[#111111]/60 text-sm max-w-xl mx-auto mb-6">
                Every document follows Nigerian corporate conventions — the correct salutations, professional body references,
                NYSC status, sector vocabulary and formal sign-offs employers expect.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {NIGERIAN_STANDARDS.map((standard) => (
                  <div key={standard} className="flex items-center gap-1.5 text-[#111111]/60">
                    <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <span className="text-xs">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-6 px-6 text-center bg-[#FDFCF7]">
        <p className="text-[#111111]/40 text-xs">
          CV Tailor NG · Built with Next.js & Claude AI · MIT License
        </p>
      </footer>
    </div>
  );
}