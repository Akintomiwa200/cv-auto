'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Send, ChevronDown, Check, Settings } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface Props {
  cvContent: string;
  defaultTo?: string;
  defaultFromName?: string;
  defaultFromEmail?: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
  onClose: () => void;
}

export default function EmailModal({
  cvContent, defaultTo='', defaultFromName='', defaultFromEmail='',
  jobDescription='', targetRole='', targetCompany='', onClose,
}: Props) {
  const [to,       setTo]       = useState(defaultTo);
  const [fromName, setFromName] = useState(defaultFromName);
  const [from,     setFrom]     = useState(defaultFromEmail);
  const [subject,  setSubject]  = useState('');
  const [body,     setBody]     = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [showSmtp, setShowSmtp] = useState(false);
  const [genBusy,  setGenBusy]  = useState(false);
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  const generateEmail = async () => {
    setGenBusy(true);
    try {
      const res = await fetch('/api/tailor-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv: cvContent, jobDescription, mode: 'email-body', senderName: fromName || defaultFromName, targetCompany, targetRole }),
      });
      const data = await res.json();
      setSubject(data.subject || '');
      setBody(data.body || '');
      if (data.detectedEmail && !to) setTo(data.detectedEmail);
      toast.success('Email generated!');
    } catch { toast.error('Generation failed'); }
    finally { setGenBusy(false); }
  };

  const send = async () => {
    if (!to || !from || !subject || !body) { toast.error('Please fill all fields'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to, from, fromName, subject, body, cvContent,
          smtp: showSmtp && smtpPass ? { host:smtpHost||'smtp.gmail.com', port:parseInt(smtpPort), user:smtpUser||from, pass:smtpPass } : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      toast.success('Application sent!');
      setTimeout(onClose, 2200);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Send failed');
    } finally { setSending(false); }
  };

  const inp = "w-full glass-card border border-white/10 rounded-xl px-4 py-2.5 text-[#F0EDE6] text-sm bg-transparent focus:border-[#C9A84C]/40 placeholder-white/20";

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background:'rgba(10,10,15,.88)',backdropFilter:'blur(10px)'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:.95,y:16}} animate={{scale:1,y:0}}
        className="glass rounded-2xl w-full max-w-xl border border-white/8 shadow-2xl overflow-hidden"
        style={{maxHeight:'90vh',overflowY:'auto'}}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0D7C66]/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#0D7C66]"/>
            </div>
            <div>
              <p className="text-[#F0EDE6] font-semibold text-sm">Send Application Email</p>
              <p className="text-white/35 text-xs">Nigerian formal format — "Yours faithfully,"</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors"><X className="w-4 h-4"/></button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-14 gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0D7C66]/20 flex items-center justify-center">
              <Check className="w-7 h-7 text-[#0D7C66]"/>
            </div>
            <p className="text-[#F0EDE6] font-semibold">Application Sent!</p>
            <p className="text-white/40 text-sm">Your CV was delivered to {to}</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {/* From */}
            <div className="grid grid-cols-2 gap-3">
              <input value={fromName} onChange={e=>setFromName(e.target.value)} placeholder="Your full name" className={inp}/>
              <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="your@email.com" type="email" className={inp}/>
            </div>
            {/* To */}
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="careers@company.ng" type="email" className={inp}/>

            {/* Generate button */}
            {!body && (
              <button onClick={generateEmail} disabled={genBusy}
                className="w-full flex items-center justify-center gap-2 glass-card border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/8 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                {genBusy ? <><Spinner size={14}/> Generating Nigerian cover letter...</> : <><Mail className="w-4 h-4"/> Generate Nigerian-Style Email</>}
              </button>
            )}

            {/* Subject */}
            <input value={subject} onChange={e=>setSubject(e.target.value)}
              placeholder="Application for the Position of [Role] — [Your Full Name]" className={inp}/>

            {/* Body */}
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={9}
              placeholder={"Dear Sir/Ma,\n\nI write to express my keen interest in the position of...\n\nKindly find attached my CV for your consideration.\n\nYours faithfully,\n[Full Name]"}
              className={`${inp} font-mono text-xs leading-relaxed`}/>

            {/* Attachment note */}
            <div className="flex items-center gap-2.5 glass-card rounded-xl p-3 border border-[#0D7C66]/15">
              <Mail className="w-4 h-4 text-[#0D7C66] flex-shrink-0"/>
              <p className="text-white/45 text-xs">Your tailored CV will be attached as PDF. Attach NYSC discharge cert separately if required.</p>
            </div>

            {/* SMTP toggle */}
            <button onClick={()=>setShowSmtp(!showSmtp)} className="flex items-center gap-2 text-white/30 hover:text-white/55 text-xs transition-colors">
              <Settings className="w-3.5 h-3.5"/>
              SMTP Settings (required to send)
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSmtp?'rotate-180':''}`}/>
            </button>
            <AnimatePresence>
              {showSmtp && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                  <div className="glass-card rounded-xl p-4 border border-white/8 space-y-2">
                    <p className="text-white/30 text-xs mb-2">Gmail: smtp.gmail.com · Port 587 · Use App Password (not your normal password). Corporate Nigerian email: use your cPanel/Zoho/M365 settings.</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={smtpHost} onChange={e=>setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" className={`${inp} text-xs`}/>
                      <input value={smtpPort} onChange={e=>setSmtpPort(e.target.value)} placeholder="587" className={`${inp} text-xs`}/>
                      <input value={smtpUser} onChange={e=>setSmtpUser(e.target.value)} placeholder="you@gmail.com" className={`${inp} text-xs`}/>
                      <input value={smtpPass} onChange={e=>setSmtpPass(e.target.value)} placeholder="App Password" type="password" className={`${inp} text-xs`}/>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Send */}
            <button onClick={send} disabled={sending||!to||!subject||!body}
              className="w-full flex items-center justify-center gap-2 bg-[#0D7C66] hover:bg-[#10A882] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm">
              {sending ? <><Spinner size={14}/> Sending...</> : <><Send className="w-4 h-4"/> Send Application</>}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
