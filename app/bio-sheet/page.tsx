'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Copy, Check, Download } from 'lucide-react';
import Nav from '@/components/ui/Nav';
import Spinner from '@/components/ui/Spinner';

interface Bios { linkedinHeadline:string; linkedinAbout:string; shortBio100:string; twitterBio:string; githubBio:string; }

const SECTIONS: { key: keyof Bios; label: string; limit?: string; color: string }[] = [
  {key:'linkedinHeadline', label:'LinkedIn Headline',       limit:'120 chars',  color:'#0077B5'},
  {key:'linkedinAbout',    label:'LinkedIn About / Summary',                    color:'#0077B5'},
  {key:'shortBio100',      label:'Short Bio (100 words)',    limit:'~100 words', color:'#C9A84C'},
  {key:'twitterBio',       label:'Twitter / X Bio',          limit:'160 chars',  color:'#1DA1F2'},
  {key:'githubBio',        label:'GitHub Bio',               limit:'2 sentences',color:'#6E5494'},
];

export default function BioSheetPage() {
  const [cv,    setCv]    = useState('');
  const [name,  setName]  = useState('');
  const [bios,  setBios]  = useState<Bios|null>(null);
  const [edits, setEdits] = useState<Bios|null>(null);
  const [busy,  setBusy]  = useState(false);
  const [copied,setCopied]= useState<string|null>(null);

  const generate = async () => {
    if (!cv.trim()) { toast.error('Please provide your CV'); return; }
    setBusy(true);
    try {
      const res  = await fetch('/api/tailor-cv', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({cv, jobDescription:'', mode:'bio-sheet', senderName:name}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBios(data.bios); setEdits(data.bios);
      toast.success('Bio sheet ready!');
    } catch(e:unknown) { toast.error(e instanceof Error?e.message:'Failed'); }
    finally { setBusy(false); }
  };

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key); toast.success('Copied!');
    setTimeout(()=>setCopied(null),2000);
  };

  const downloadDocx = async () => {
    const res = await fetch('/api/generate-doc',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({content:'',docType:'bio-sheet',format:'docx',candidateName:name||'BioSheet',bios:edits})});
    if(!res.ok){toast.error('Download failed');return;}
    const blob=await res.blob();
    const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`${(name||'Candidate').replace(/\s+/g,'_')}_BioSheet.docx`});
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    toast.success('Downloaded!');
  };

  const inp = "w-full glass-card border border-white/10 rounded-xl px-4 py-3 text-[#F0EDE6] text-sm bg-transparent focus:border-[#C9A84C]/40 placeholder-white/20";

  return (
    <div className="min-h-screen">
      <Nav/>
      <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-3xl font-bold text-[#F0EDE6] mb-2">Bio & Profile Sheet</h1>
          <p className="text-white/40 text-sm">LinkedIn · Twitter/X · GitHub · Short bio — all from your CV in one click</p>
        </div>

        <AnimatePresence mode="wait">
          {!bios ? (
            <motion.div key="form" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="max-w-xl mx-auto space-y-4">
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Adedokun Peter Akintomiwa" className={inp}/>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your CV</label>
                <textarea value={cv} onChange={e=>setCv(e.target.value)} rows={10} placeholder="Paste your full CV here…" className={`${inp} font-mono text-xs leading-relaxed`}/>
              </div>
              <button onClick={generate} disabled={busy||!cv.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-black font-bold py-3.5 rounded-xl text-sm transition-all">
                {busy?<><Spinner size={14}/> Generating bio profiles…</>:<><Zap className="w-4 h-4"/> Generate All Bios</>}
              </button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-white/40 text-sm">All bios are editable — click any field to customise</p>
                <div className="flex items-center gap-2">
                  <button onClick={()=>{setBios(null);setEdits(null);}} className="glass-card border border-white/10 text-white/45 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">Re-generate</button>
                  <button onClick={downloadDocx} className="flex items-center gap-1.5 glass-card border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/8 px-3 py-1.5 rounded-lg text-xs transition-all">
                    <Download className="w-3 h-3"/> Download DOCX
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {SECTIONS.map(s=>(
                  <div key={s.key} className="glass rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{background:s.color}}/>
                        <p className="text-[#F0EDE6] font-semibold text-sm">{s.label}</p>
                        {s.limit && <span className="text-white/25 text-xs">{s.limit}</span>}
                      </div>
                      <button onClick={()=>copy(s.key, edits?.[s.key]||'')}
                        className="flex items-center gap-1.5 text-white/35 hover:text-white text-xs transition-colors">
                        {copied===s.key?<Check className="w-3 h-3 text-[#0D7C66]"/>:<Copy className="w-3 h-3"/>} Copy
                      </button>
                    </div>
                    <textarea
                      value={edits?.[s.key]||''}
                      onChange={e=>setEdits(prev=>prev?{...prev,[s.key]:e.target.value}:null)}
                      className="w-full p-4 text-white/70 text-sm bg-transparent focus:outline-none leading-relaxed"
                      style={{minHeight: s.key==='linkedinAbout' ? '160px' : s.key==='shortBio100' ? '120px' : '70px'}}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
