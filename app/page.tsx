'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText, Zap, Mail, Download, Layout, ArrowRight,
  Check, Star, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'Upload Your CV',         desc: 'PDF, DOCX or paste text. Our parser reads Nigerian CV fields — NYSC, state of origin, professional bodies.',          color: '#0D7C66' },
  { icon: Zap,      title: 'AI CV Tailoring',         desc: 'Paste any job advert from Jobberman, LinkedIn or a company site. Claude rewrites your CV with sector-specific language.',  color: '#C9A84C' },
  { icon: FileText, title: 'Resume Builder',          desc: 'One-page modern tech resume for banks, fintechs, startups and multinationals. Two-column layout, clean and ATS-ready.',   color: '#9B72CF' },
  { icon: Mail,     title: 'Cover Letter Generator',  desc: 'Full formal Nigerian cover letter — "Dear Sir/Ma," opening, proper qualifications match, "Yours faithfully," close.',     color: '#E76F51' },
  { icon: Star,     title: '5 Email Templates',       desc: 'Job application, follow-up, interview confirmation, referral, and post-interview thank-you — all Nigerian format.',      color: '#457B9D' },
  { icon: FileText, title: 'Bio & Profile Sheet',     desc: 'LinkedIn headline + About, 100-word bio, Twitter/X and GitHub bios — ready to paste.',                                   color: '#2B9348' },
  { icon: Mail,     title: 'Direct Email Send',       desc: 'Send your application straight from the app via SMTP with your tailored CV attached as a PDF.',                          color: '#0D7C66' },
  { icon: Download, title: 'Download All Formats',    desc: 'Export any document as PDF, DOCX, HTML or plain text in one click.',                                                     color: '#C9A84C' },
  { icon: Layout,   title: 'Nigerian CV Templates',   desc: 'Banking · Oil & Gas · Tech · NGO · Civil Service · FMCG — sector-specific starting points.',                            color: '#E76F51' },
];

const SECTORS = ['Banking / Finance', 'Oil & Gas', 'Technology / Fintech', 'NGO / Development', 'Civil Service', 'FMCG / Sales'];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between" style={{height:'60px'}}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#9E7A2A] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-black" />
            </div>
            <span style={{fontFamily:'Playfair Display,serif'}} className="font-bold text-[#F0EDE6] text-lg">CV Tailor <span className="text-[#C9A84C]">NG</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {[['Templates','/templates'],['Dashboard','/dashboard']].map(([l,h])=>(
              <Link key={h} href={h} className="text-white/50 hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Start Free <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.65}} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-7 text-[#C9A84C] text-xs border border-[#C9A84C]/20">
              <Zap className="w-3 h-3"/> Powered by Claude AI · Built for Nigeria 🇳🇬
            </div>
            <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-5xl md:text-6xl font-bold text-[#F0EDE6] leading-tight mb-5">
              Your Nigerian CV,<br/><span className="gold-shimmer">perfectly tailored</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your CV, paste any job advert from Jobberman or LinkedIn, and get a fully rewritten
              Nigerian-format CV, cover letter, email and more — in seconds.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/dashboard" className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-black font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 text-sm">
                Open Dashboard <ChevronRight className="w-4 h-4"/>
              </Link>
              <Link href="/templates" className="flex items-center gap-2 glass text-white/70 hover:text-white px-7 py-3.5 rounded-xl text-sm transition-all border border-white/10">
                View Templates
              </Link>
            </div>
            {/* Sector pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {SECTORS.map(s=>(
                <span key={s} className="glass text-white/40 text-xs px-3 py-1 rounded-full border border-white/5">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {FEATURES.map((f,i)=>(
              <motion.div key={f.title} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}
                className="glass-card rounded-2xl p-5 hover:border-white/12 transition-all group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{background:`${f.color}18`,border:`1px solid ${f.color}28`}}>
                  <f.icon className="w-4.5 h-4.5" style={{color:f.color, width:'18px',height:'18px'}}/>
                </div>
                <h3 className="text-[#F0EDE6] font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Nigerian standards callout */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}}
            className="glass rounded-2xl p-8 border border-[#C9A84C]/10 text-center">
            <h2 style={{fontFamily:'Playfair Display,serif'}} className="text-2xl font-bold text-[#F0EDE6] mb-3">
              Built to Nigerian Standards
            </h2>
            <p className="text-white/45 text-sm max-w-xl mx-auto mb-6">
              Every document follows Nigerian corporate conventions — the correct salutations, professional body references,
              NYSC status, sector vocabulary and formal sign-offs employers expect.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                'NYSC Status Field','State of Origin','ICAN · CIPM · COREN','"Dear Sir/Ma,"',
                '"Yours faithfully,"','₦ Naira Formatting','Jobberman-ready','CBN · NUPRC · NIBSS',
              ].map(t=>(
                <div key={t} className="flex items-center gap-1.5 text-white/50">
                  <Check className="w-3 h-3 text-[#0D7C66] flex-shrink-0"/>{t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 px-6 text-center">
        <p className="text-white/25 text-xs">CV Tailor NG · Built with Next.js &amp; Claude AI · MIT License</p>
      </footer>
    </div>
  );
}
