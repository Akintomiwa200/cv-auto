'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Mail } from 'lucide-react';
import Nav from '@/components/ui/Nav';
import ResultPane from '@/components/cv/ResultPane';
import Spinner from '@/components/ui/Spinner';

export default function CoverLetterPage() {
  const [cv,      setCv]      = useState('');
  const [job,     setJob]     = useState('');
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [email,   setEmail]   = useState('');
  const [role,    setRole]    = useState('');
  const [company, setCompany] = useState('');
  const [result,  setResult]  = useState('');
  const [edited,  setEdited]  = useState('');
  const [busy,    setBusy]    = useState(false);

  const generate = async () => {
    if (!cv.trim()) { toast.error('Please provide your CV'); return; }
    setBusy(true);
    try {
      const res  = await fetch('/api/tailor-cv', { method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({cv, jobDescription:job, mode:'cover-letter', senderName:name, targetRole:role, targetCompany:company}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result); setEdited(data.result);
      toast.success('Cover letter generated!');
    } catch(e:unknown) { toast.error(e instanceof Error?e.message:'Failed'); }
    finally { setBusy(false); }
  };

  const inp = "w-full glass-card border border-white/10 rounded-xl px-4 py-3 text-[#F0EDE6] text-sm bg-transparent focus:border-[#C9A84C]/40 placeholder-white/20";

  return (
    <div className="min-h-screen">
      <Nav/>
      <div className="pt-20 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-3xl font-bold text-[#F0EDE6] mb-2">Cover Letter Generator</h1>
          <p className="text-white/40 text-sm">Formal Nigerian format — "Dear Sir/Ma," opening · "Yours faithfully," close</p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Full Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Adedokun Peter Akintomiwa" className={inp}/>
                </div>
                <div>
                  <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Phone</label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+234 814 532 8795" className={inp}/>
                </div>
                <div>
                  <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Email</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" className={inp}/>
                </div>
                <div>
                  <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Target Role</label>
                  <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Software Engineer" className={inp}/>
                </div>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Company Name</label>
                <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Flutterwave / Access Bank PLC" className={inp}/>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your CV</label>
                <textarea value={cv} onChange={e=>setCv(e.target.value)} rows={7} placeholder="Paste your CV text…" className={`${inp} font-mono text-xs leading-relaxed`}/>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Job Description (optional but improves quality)</label>
                <textarea value={job} onChange={e=>setJob(e.target.value)} rows={5} placeholder="Paste job advert…" className={`${inp} font-mono text-xs leading-relaxed`}/>
              </div>
              <button onClick={generate} disabled={busy||!cv.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-black font-bold py-3.5 rounded-xl text-sm transition-all">
                {busy?<><Spinner size={14}/> Writing Cover Letter…</>:<><Zap className="w-4 h-4"/> Generate Cover Letter</>}
              </button>
              {/* Preview of Nigerian style */}
              <div className="glass-card rounded-xl p-4 border border-white/6 text-xs text-white/30 font-mono leading-relaxed">
                <p className="text-white/40 mb-1">Preview of format:</p>
                <p>[Date]</p>
                <p>The Hiring Manager, {company||'[Company Name]'}, Lagos, Nigeria</p>
                <p className="mt-1">Re: Application for the Position of {role||'[Role Title]'}</p>
                <p className="mt-1">Dear Sir/Ma,</p>
                <p className="mt-1">I write to express my keen interest in…</p>
                <p className="mt-1">Yours faithfully,</p>
                <p>{name||'[Your Name]'}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
              <ResultPane
                content={edited} onChange={setEdited}
                docType="cover-letter" candidateName={name||'Cover Letter'}
                phone={phone} email={email}
                onRetailor={()=>{setResult('');setEdited('');}}
                showEmail cvContent={edited}
                defaultFromName={name} defaultFromEmail={email}
                jobDescription={job} targetRole={role} targetCompany={company}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
