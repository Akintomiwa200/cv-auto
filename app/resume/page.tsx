'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FileText, Zap } from 'lucide-react';
import Nav from '@/components/ui/Nav';
import ResultPane from '@/components/cv/ResultPane';
import Spinner from '@/components/ui/Spinner';

export default function ResumePage() {
  const [cv,      setCv]      = useState('');
  const [job,     setJob]     = useState('');
  const [name,    setName]    = useState('');
  const [result,  setResult]  = useState('');
  const [edited,  setEdited]  = useState('');
  const [busy,    setBusy]    = useState(false);

  const generate = async () => {
    if (!cv.trim() || !job.trim()) { toast.error('Please provide CV and job description'); return; }
    setBusy(true);
    try {
      const res  = await fetch('/api/tailor-cv', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({cv, jobDescription:job, mode:'resume', senderName:name}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result); setEdited(data.result);
      toast.success('Resume generated!');
    } catch(e:unknown) { toast.error(e instanceof Error?e.message:'Failed'); }
    finally { setBusy(false); }
  };

  const inp = "w-full glass-card border border-white/10 rounded-xl px-4 py-3 text-[#F0EDE6] text-sm bg-transparent focus:border-[#C9A84C]/40 placeholder-white/20";

  return (
    <div className="min-h-screen">
      <Nav/>
      <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-3xl font-bold text-[#F0EDE6] mb-2">Resume Builder</h1>
          <p className="text-white/40 text-sm">Modern one-page resume — two-column layout, skills-first, ATS-ready</p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="max-w-2xl mx-auto space-y-4">
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Adedokun Peter Akintomiwa" className={inp}/>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your CV / Work History</label>
                <textarea value={cv} onChange={e=>setCv(e.target.value)} rows={8} placeholder="Paste your full CV text here…" className={`${inp} font-mono text-xs leading-relaxed`}/>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Job Description</label>
                <textarea value={job} onChange={e=>setJob(e.target.value)} rows={6} placeholder="Paste the job advert here…" className={`${inp} font-mono text-xs leading-relaxed`}/>
              </div>
              <button onClick={generate} disabled={busy||!cv.trim()||!job.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-black font-bold py-3.5 rounded-xl text-sm transition-all">
                {busy?<><Spinner size={14}/> Building Resume…</>:<><Zap className="w-4 h-4"/> Build Resume</>}
              </button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
              <ResultPane content={edited} onChange={setEdited} docType="resume" candidateName={name||'Resume'} onRetailor={()=>{setResult('');setEdited('');}}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
