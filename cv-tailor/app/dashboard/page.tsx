'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, Zap, FileText, X, Briefcase } from 'lucide-react';
import Nav from '@/components/ui/Nav';
import StepBar from '@/components/ui/StepBar';
import Spinner from '@/components/ui/Spinner';
import ResultPane from '@/components/cv/ResultPane';
import { NigerianSector } from '@/lib/types';

const SECTORS: { id: NigerianSector; label: string }[] = [
  {id:'banking',     label:'Banking / Finance'},
  {id:'oilandgas',   label:'Oil & Gas'},
  {id:'tech',        label:'Technology / Fintech'},
  {id:'ngo',         label:'NGO / Development'},
  {id:'civil-service',label:'Civil Service'},
  {id:'fmcg',        label:'FMCG / Sales'},
  {id:'general',     label:'General / Other'},
];

type Step = 0|1|2|3;

export default function Dashboard() {
  const [step,        setStep]        = useState<Step>(0);
  const [cvRaw,       setCvRaw]       = useState('');
  const [cvFileName,  setCvFileName]  = useState('');
  const [jobDesc,     setJobDesc]     = useState('');
  const [sector,      setSector]      = useState<NigerianSector>('general');
  const [targetRole,  setTargetRole]  = useState('');
  const [targetCo,    setTargetCo]    = useState('');
  const [senderName,  setSenderName]  = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [result,      setResult]      = useState('');
  const [editResult,  setEditResult]  = useState('');
  const [detectedEmail, setDetectedEmail] = useState('');
  const [busy,        setBusy]        = useState(false);

  /* ── Upload ───────────────────────────────────────────────────────────── */
  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]; if (!file) return;
    const id = toast.loading('Parsing CV…');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/parse-cv', { method:'POST', body:fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCvRaw(data.text);
      setCvFileName(file.name);
      toast.success('CV parsed!', {id});
      setStep(1);
    } catch(e:unknown) {
      toast.error(e instanceof Error ? e.message : 'Parse failed', {id});
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept:{'application/pdf':['.pdf'],'application/vnd.openxmlformats-officedocument.wordprocessingml.document':['.docx'],'text/plain':['.txt']}, maxFiles:1,
  });

  /* ── Tailor ───────────────────────────────────────────────────────────── */
  const tailor = async () => {
    if (!cvRaw || !jobDesc.trim()) { toast.error('Please provide CV and job description'); return; }
    setBusy(true);
    setStep(2);
    try {
      const res  = await fetch('/api/tailor-cv', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ cv:cvRaw, jobDescription:jobDesc, mode:'cv', sector, senderName, targetRole, targetCompany:targetCo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      setEditResult(data.result);
      setDetectedEmail(data.detectedEmail || '');
      setStep(3);
      toast.success('CV tailored!');
    } catch(e:unknown) {
      toast.error(e instanceof Error ? e.message : 'Tailoring failed');
      setStep(1);
    } finally { setBusy(false); }
  };

  const inp = "w-full glass-card border border-white/10 rounded-xl px-4 py-3 text-[#F0EDE6] text-sm bg-transparent focus:border-[#C9A84C]/40 placeholder-white/20";

  return (
    <div className="min-h-screen">
      <Nav right={
        <StepBar steps={['Upload','Job Details','Tailoring','Result']} current={step}/>
      }/>

      <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Upload ─────────────────────────────────────────── */}
          {step===0 && (
            <motion.div key="upload" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} className="max-w-xl mx-auto">
              <div className="text-center mb-10 pt-6">
                <p className="text-[#C9A84C]/70 text-xs font-mono uppercase tracking-widest mb-3">Step 1 of 4</p>
                <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-3xl font-bold text-[#F0EDE6] mb-2">Upload Your CV</h1>
                <p className="text-white/40 text-sm">PDF, DOCX or plain text · Nigerian CV fields fully supported</p>
              </div>

              <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-[#C9A84C]/60 bg-[#C9A84C]/5 scale-[1.02]' : 'border-white/15 hover:border-[#C9A84C]/30'}`}>
                <input {...getInputProps()}/>
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDragActive?'bg-[#C9A84C]/20':'bg-white/5'}`}>
                    <Upload className={`w-7 h-7 ${isDragActive?'text-[#C9A84C]':'text-white/30'}`}/>
                  </div>
                  <p className="text-[#F0EDE6] font-medium">{isDragActive?'Drop it here!':'Drag & drop your CV'}</p>
                  <p className="text-white/35 text-sm">or click to browse</p>
                  <p className="text-white/20 text-xs font-mono">PDF · DOCX · TXT</p>
                </div>
              </div>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/8"/><span className="text-white/25 text-xs">or</span><div className="flex-1 h-px bg-white/8"/>
              </div>
              <button onClick={()=>{
                const t=prompt('Paste your CV text:');
                if(t){setCvRaw(t);setCvFileName('Pasted text');setStep(1);}
              }} className="w-full glass-card border border-white/10 text-white/45 hover:text-white py-3 rounded-xl text-sm transition-all">
                Paste CV text manually
              </button>

              {/* Sender details */}
              <div className="mt-8 space-y-3">
                <p className="text-white/30 text-xs uppercase tracking-wider">Your Details (optional — used for email sending)</p>
                <div className="grid grid-cols-2 gap-3">
                  <input value={senderName}  onChange={e=>setSenderName(e.target.value)}  placeholder="Full name" className={inp}/>
                  <input value={senderEmail} onChange={e=>setSenderEmail(e.target.value)} placeholder="your@email.com" type="email" className={inp}/>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Job Details ────────────────────────────────────── */}
          {step===1 && (
            <motion.div key="job" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} className="max-w-2xl mx-auto">
              <div className="text-center mb-8 pt-6">
                <p className="text-[#C9A84C]/70 text-xs font-mono uppercase tracking-widest mb-3">Step 2 of 4</p>
                <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-3xl font-bold text-[#F0EDE6] mb-2">Paste the Job Advert</h1>
                <p className="text-white/40 text-sm">Copy the full job posting from Jobberman, LinkedIn or company site</p>
              </div>

              {/* CV loaded chip */}
              <div className="glass-card rounded-xl p-3 mb-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0D7C66]/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-[#0D7C66]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F0EDE6] text-xs font-medium truncate">{cvFileName||'CV Loaded'}</p>
                  <p className="text-white/30 text-xs truncate">{cvRaw.substring(0,70)}…</p>
                </div>
                <button onClick={()=>{setCvRaw('');setCvFileName('');setStep(0);}} className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0">
                  <X className="w-4 h-4"/>
                </button>
              </div>

              <div className="space-y-3">
                {/* Sector */}
                <div>
                  <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Industry Sector</label>
                  <select value={sector} onChange={e=>setSector(e.target.value as NigerianSector)} className={inp}>
                    {SECTORS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                {/* Role + Company */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Target Role (optional)</label>
                    <input value={targetRole} onChange={e=>setTargetRole(e.target.value)} placeholder="e.g. Senior Software Engineer" className={inp}/>
                  </div>
                  <div>
                    <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Company Name (optional)</label>
                    <input value={targetCo} onChange={e=>setTargetCo(e.target.value)} placeholder="e.g. Access Bank PLC" className={inp}/>
                  </div>
                </div>
                {/* Job description */}
                <div>
                  <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Job Description / Advert</label>
                  <textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} rows={10} className={`${inp} font-mono text-xs leading-relaxed`}
                    placeholder={"Paste the full job advert here…\n\nExample:\nWe are recruiting for the position of Software Engineer at Flutterwave.\n\nRequirements:\n- BSc/HND in Computer Science or related field\n- 3+ years React/Node.js experience\n- NYSC discharge certificate\n\nSend applications to: careers@flutterwave.com"}/>
                </div>
                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button onClick={()=>setStep(0)} className="glass-card border border-white/10 text-white/50 hover:text-white px-5 py-3 rounded-xl text-sm transition-all">← Back</button>
                  <button onClick={tailor} disabled={!jobDesc.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-black font-bold py-3 rounded-xl text-sm transition-all">
                    <Zap className="w-4 h-4"/> Tailor with AI
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Processing ─────────────────────────────────────── */}
          {step===2 && (
            <motion.div key="processing" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} className="max-w-md mx-auto text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#C9A84C] pulse"/>
              </div>
              <h2 style={{fontFamily:'Playfair Display,serif'}} className="text-2xl font-bold text-[#F0EDE6] mb-3">Tailoring your CV…</h2>
              <p className="text-white/40 text-sm mb-8">Claude AI is rewriting your CV with Nigerian sector language and matching it to the job requirements</p>
              <div className="glass rounded-xl p-4 text-left space-y-2.5">
                {['Parsing Nigerian job advert','Extracting sector keywords & professional bodies','Rewriting experience with action verbs','Applying NYSC, certifications & sector compliance','Optimising for Nigerian recruiters'].map((l,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${i<2?'bg-[#0D7C66]/20':'bg-white/5'}`}>
                      {i<2?<span className="text-[#0D7C66] text-xs">✓</span>:<Spinner size={10}/>}
                    </div>
                    <span className={`text-xs ${i<2?'text-white/60':'text-white/25'}`}>{l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Result ─────────────────────────────────────────── */}
          {step===3 && (
            <motion.div key="result" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="pt-6">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#0D7C66] text-xs font-mono uppercase tracking-widest mb-1">
                    <span>✓</span> Tailoring Complete
                  </div>
                  <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-2xl font-bold text-[#F0EDE6]">Your Tailored Nigerian CV</h1>
                </div>
              </div>

              <ResultPane
                content={editResult} onChange={setEditResult}
                docType="cv" candidateName={senderName||'CV'}
                phone="" email={senderEmail}
                onRetailor={()=>{setEditResult('');setStep(1);}}
                showEmail cvContent={editResult}
                defaultEmailTo={detectedEmail}
                defaultFromName={senderName}
                defaultFromEmail={senderEmail}
                jobDescription={jobDesc}
                targetRole={targetRole}
                targetCompany={targetCo}
              />

              {/* Quick-action footer */}
              <div className="mt-5 glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center"><Briefcase className="w-4 h-4 text-[#C9A84C]"/></div>
                  <div>
                    <p className="text-[#F0EDE6] text-sm font-medium">Also generate for this role:</p>
                    <p className="text-white/35 text-xs">Use the same CV + job advert on other pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {[['Resume','/resume'],['Cover Letter','/cover-letter'],['Email Templates','/email-templates'],['Bio Sheet','/bio-sheet']].map(([l,h])=>(
                    <a key={h} href={h} className="glass-card border border-white/10 text-white/55 hover:text-white px-3 py-1.5 rounded-lg transition-all">{l}</a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
