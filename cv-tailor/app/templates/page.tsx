'use client';

import { motion } from 'framer-motion';
import { Check, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { useState } from 'react';

const TEMPLATES = [
  {
    id:'banking', name:'Banking & Finance', color:'#C9A84C',
    desc:'For Nigerian banks, fintech, insurance and financial services. ICAN/ACCA-ready with CBN compliance language.',
    tags:['Banking','Fintech','ICAN','CBN','AML/CFT'],
    preview:{ name:'Chukwuemeka Obi', title:'Senior Relationship Manager — GTBank',
      sections:['Personal Information','NYSC Status','Career Objective','Educational Qualifications','Professional Experience','Certifications (ICAN)','Referees'] },
    highlights:['KYC / AML/CFT language','CBN regulatory references','ICAN membership field','Treasury & credit skills'],
  },
  {
    id:'oilandgas', name:'Oil & Gas', color:'#2A9D8F',
    desc:'HSE-formatted for upstream, midstream and downstream roles. NUPRC/DPR, NCDMB and NAPIMS language built-in.',
    tags:['HSE/HSSE','Upstream','NCDMB','NAPIMS','NUPRC'],
    preview:{ name:'Fatima Aliyu', title:'HSE Supervisor — NNPC Limited',
      sections:['Personal Information','NYSC Discharge','Career Objective','Educational Qualifications','HSE Experience','HSE Certifications','Referees'] },
    highlights:['HSE/HSSE achievement bullets','NUPRC compliance language','NAPIMS project references','Safety record emphasis'],
  },
  {
    id:'tech', name:'Technology / Fintech', color:'#9B72CF',
    desc:'For Nigerian tech, fintech and startup roles. Skills-first layout with Lagos/Abuja ecosystem language.',
    tags:['Tech','Fintech','Startup','Developer','NIBSS'],
    preview:{ name:'Seun Adeyemi', title:'Full-Stack Engineer — Flutterwave',
      sections:['Contact & Links','Technical Skills','Career Summary','Professional Experience','Projects','Education','NYSC'] },
    highlights:['Tech stack skills table','NIBSS / CBN sandbox refs','Project portfolio section','GitHub / portfolio links'],
  },
  {
    id:'ngo', name:'NGO / Development', color:'#E76F51',
    desc:'Structured for USAID, DFID, UN and Nigerian NGO roles. M&E, donor reporting and LGA coordination language.',
    tags:['NGO','M&E','USAID','UN','DFID'],
    preview:{ name:'Amaka Nwosu', title:'M&E Specialist — USAID Nigeria',
      sections:['Personal Information','Career Objective','Programme Experience','M&E Skills','Donor Reporting','Education','NYSC','Referees'] },
    highlights:['M&E / MEAL framework language','Donor reporting bullets','LGA coordination experience','KOBO / ODK tools field'],
  },
  {
    id:'civil-service', name:'Civil Service / Public Sector', color:'#457B9D',
    desc:'Formal Nigerian public sector style for federal/state MDAs, parastatals and regulatory bodies.',
    tags:['Government','MDAs','Parastatal','Federal','TSA'],
    preview:{ name:'Babatunde Lawal', title:'Director, Finance & Accounts — Federal MDA',
      sections:['Personal Data','State of Origin','Educational Qualifications','Work History','NYSC','Professional Membership','Publications','Referees'] },
    highlights:['Parastatal language','IPPIS / GIFMIS references','Due process compliance','Formal third-person tone'],
  },
  {
    id:'fmcg', name:'FMCG / Sales', color:'#2B9348',
    desc:'For consumer goods, sales and marketing across Nigeria. Route-to-market and distributor management language.',
    tags:['FMCG','Sales','Marketing','Distribution','Nielsen'],
    preview:{ name:'Ngozi Eze', title:'Regional Sales Manager — Unilever Nigeria',
      sections:['Career Summary','Core Competencies','Professional Experience','Sales Achievements','Education','NYSC','Certifications'] },
    highlights:['Route-to-market bullets','Distributor management','Nielsen data references','Territory & volume metrics'],
  },
];

export default function TemplatesPage() {
  const [selected, setSelected] = useState<string|null>(null);

  return (
    <div className="min-h-screen">
      <Nav right={
        <Link href="/dashboard" className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E8C96B] text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
          <Zap className="w-3 h-3"/> Start with AI
        </Link>
      }/>
      <div className="pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 pt-4">
          <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-4xl font-bold text-[#F0EDE6] mb-3">Nigerian CV Templates</h1>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            Sector-specific starting points built for the Nigerian job market. Choose one, then let AI tailor it to your exact role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map((t,i) => (
            <motion.div key={t.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
              onClick={()=>setSelected(selected===t.id?null:t.id)}
              className={`glass-card rounded-2xl overflow-hidden cursor-pointer transition-all group ${selected===t.id?'border border-[#C9A84C]/40 shadow-lg shadow-[#C9A84C]/5':'border border-white/6 hover:border-white/12'}`}>

              {/* Mock CV preview */}
              <div className="p-5 relative" style={{background:`${t.color}08`, minHeight:'160px'}}>
                <div className="bg-white rounded-xl shadow-md p-4 text-left transform group-hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{background:t.color}}>
                      {t.preview.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900">{t.preview.name}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{t.preview.title}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {t.preview.sections.map(s=>(
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{background:t.color}}/>
                        <div className="h-1.5 bg-gray-200 rounded flex-1"/>
                        <span className="text-gray-400 text-[8px]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selected===t.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-black"/>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#F0EDE6] font-semibold">{t.name}</h3>
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:t.color}}/>
                </div>
                <p className="text-white/40 text-xs mb-3 leading-relaxed">{t.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.tags.map(tag=>(
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:`${t.color}15`,color:t.color}}>{tag}</span>
                  ))}
                </div>

                {/* Highlights */}
                {selected===t.id && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mb-4 space-y-1">
                    {t.highlights.map(h=>(
                      <div key={h} className="flex items-center gap-2 text-xs text-white/50">
                        <Check className="w-3 h-3 text-[#0D7C66] flex-shrink-0"/>{h}
                      </div>
                    ))}
                  </motion.div>
                )}

                <Link href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{background:t.color, color: ['banking','oilandgas','fmcg'].includes(t.id) ? '#0A0A0F' : 'white'}}>
                  Use This Template <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 glass rounded-2xl p-9 text-center border border-white/6">
          <h2 style={{fontFamily:'Playfair Display,serif'}} className="text-2xl font-bold text-[#F0EDE6] mb-2">Don't see your sector?</h2>
          <p className="text-white/40 text-sm mb-6">Upload any existing CV and the AI will tailor it to any Nigerian job advert — no template required.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] text-black font-bold px-7 py-3 rounded-xl transition-all hover:scale-105 text-sm">
            <Zap className="w-4 h-4"/> Start with My CV
          </Link>
        </div>
      </div>
    </div>
  );
}
