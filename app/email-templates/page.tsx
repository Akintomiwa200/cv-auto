'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Mail, Copy, Check, Download } from 'lucide-react';
import Nav from '@/components/ui/Nav';
import Spinner from '@/components/ui/Spinner';
import EmailModal from '@/components/cv/EmailModal';

interface Template { id: string; title: string; subject: string; body: string; }

const TEMPLATE_COLOURS: Record<string, string> = {
  'job-application':  '#C9A84C',
  'follow-up':        '#0D7C66',
  'interview-confirm':'#9B72CF',
  'referral':         '#457B9D',
  'thank-you':        '#E76F51',
};

export default function EmailTemplatesPage() {
  const [cv,        setCv]        = useState('');
  const [job,       setJob]       = useState('');
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [busy,      setBusy]      = useState(false);
  const [active,    setActive]    = useState<string>('job-application');
  const [copied,    setCopied]    = useState<string|null>(null);
  const [sendModal, setSendModal] = useState<Template|null>(null);

  const generate = async () => {
    if (!cv.trim()) { toast.error('Please provide your CV'); return; }
    setBusy(true);
    try {
      const res  = await fetch('/api/tailor-cv', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({cv, jobDescription:job, mode:'email-templates', senderName:name}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTemplates(data.templates);
      toast.success('5 email templates ready!');
    } catch(e:unknown) { toast.error(e instanceof Error?e.message:'Failed'); }
    finally { setBusy(false); }
  };

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id); toast.success('Copied!');
    setTimeout(()=>setCopied(null), 2000);
  };

  const downloadAll = async () => {
    const res = await fetch('/api/generate-doc', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({content:'', docType:'email-templates', format:'docx', candidateName:name||'EmailTemplates', templates}) });
    if (!res.ok) { toast.error('Download failed'); return; }
    const blob = await res.blob();
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob), download:`${(name||'Candidate').replace(/\s+/g,'_')}_EmailTemplates.docx`});
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success('Downloaded!');
  };

  const inp = "w-full glass-card border border-white/10 rounded-xl px-4 py-3 text-[#F0EDE6] text-sm bg-transparent focus:border-[#C9A84C]/40 placeholder-white/20";
  const activeT = templates.find(t=>t.id===active);

  return (
    <div className="min-h-screen">
      <Nav/>
      <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-3xl font-bold text-[#F0EDE6] mb-2">Email Templates</h1>
          <p className="text-white/40 text-sm">5 Nigerian professional email templates — generated for your specific CV and role</p>
        </div>

        {templates.length === 0 ? (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Adedokun Peter Akintomiwa" className={inp}/>
              </div>
              <div>
                <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" className={inp}/>
              </div>
            </div>
            <div>
              <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Your CV</label>
              <textarea value={cv} onChange={e=>setCv(e.target.value)} rows={7} placeholder="Paste your CV text…" className={`${inp} font-mono text-xs leading-relaxed`}/>
            </div>
            <div>
              <label className="text-white/35 text-xs uppercase tracking-wider block mb-1.5">Job Description (optional)</label>
              <textarea value={job} onChange={e=>setJob(e.target.value)} rows={4} placeholder="Paste job advert for more specific emails…" className={`${inp} font-mono text-xs leading-relaxed`}/>
            </div>
            <button onClick={generate} disabled={busy||!cv.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-40 text-black font-bold py-3.5 rounded-xl text-sm transition-all">
              {busy?<><Spinner size={14}/> Generating 5 templates…</>:<><Zap className="w-4 h-4"/> Generate Email Templates</>}
            </button>
            {/* What you get */}
            <div className="glass-card rounded-xl p-4 border border-white/6">
              <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">You'll get these 5 templates:</p>
              <div className="space-y-1.5">
                {[['job-application','Job Application Email','Standard Nigerian application with correct salutation'],
                  ['follow-up','Follow-Up Email','Polite follow-up after submitting application'],
                  ['interview-confirm','Interview Confirmation','Professional acceptance and confirmation'],
                  ['referral','Referral / Networking','Warm introduction via a mutual contact'],
                  ['thank-you','Post-Interview Thank-You','Professional gratitude after interview'],
                ].map(([,title,desc])=>(
                  <div key={title} className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-white/60 text-xs font-medium">{title}</p>
                      <p className="text-white/30 text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-4">
              {/* Top bar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-white/40 text-sm">Select a template to view, edit and send</p>
                <div className="flex items-center gap-2">
                  <button onClick={()=>{setTemplates([]);}} className="glass-card border border-white/10 text-white/45 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">Re-generate</button>
                  <button onClick={downloadAll} className="flex items-center gap-1.5 glass-card border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/8 px-3 py-1.5 rounded-lg text-xs transition-all">
                    <Download className="w-3 h-3"/> Download All (DOCX)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Sidebar tabs */}
                <div className="space-y-2">
                  {templates.map(t=>(
                    <button key={t.id} onClick={()=>setActive(t.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${active===t.id?'border-[#C9A84C]/30 bg-[#C9A84C]/8':'glass-card border-white/8 hover:border-white/15'}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:TEMPLATE_COLOURS[t.id]||'#C9A84C'}}/>
                        <p className={`text-xs font-medium ${active===t.id?'text-[#C9A84C]':'text-white/60'}`}>{t.title}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active template */}
                {activeT && (
                  <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                      <p className="text-[#F0EDE6] font-semibold text-sm">{activeT.title}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={()=>copy(activeT.body, activeT.id+'body')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors">
                          {copied===activeT.id+'body'?<Check className="w-3 h-3 text-[#0D7C66]"/>:<Copy className="w-3 h-3"/>} Copy Body
                        </button>
                        <button onClick={()=>setSendModal(activeT)}
                          className="flex items-center gap-1.5 bg-[#0D7C66] hover:bg-[#10A882] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                          <Mail className="w-3 h-3"/> Send Now
                        </button>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="glass-card rounded-lg px-4 py-2.5 border border-white/8">
                        <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Subject</p>
                        <p className="text-[#F0EDE6] text-sm">{activeT.subject}</p>
                      </div>
                      <div className="glass-card rounded-lg p-4 border border-white/8">
                        <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Body</p>
                        <pre className="text-white/65 text-xs leading-relaxed whitespace-pre-wrap font-mono">{activeT.body}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {sendModal && (
        <EmailModal
          cvContent={cv}
          defaultFromName={name} defaultFromEmail={email}
          jobDescription={job}
          onClose={()=>setSendModal(null)}
        />
      )}
    </div>
  );
}
