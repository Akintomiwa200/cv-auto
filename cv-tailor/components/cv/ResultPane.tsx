'use client';

import { useState } from 'react';
import { Eye, EyeOff, RefreshCw, Mail } from 'lucide-react';
import CVPreview from './CVPreview';
import DownloadBar from './DownloadBar';
import EmailModal from './EmailModal';
import { DocType } from '@/lib/types';

interface Props {
  content: string;
  onChange: (v: string) => void;
  docType: DocType;
  candidateName: string;
  phone?: string;
  email?: string;
  templates?: object[];
  bios?: object;
  onRetailor?: () => void;
  showEmail?: boolean;
  cvContent?: string;
  defaultEmailTo?: string;
  defaultFromName?: string;
  defaultFromEmail?: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
}

export default function ResultPane({
  content, onChange, docType, candidateName, phone, email,
  templates, bios, onRetailor, showEmail, cvContent,
  defaultEmailTo, defaultFromName, defaultFromEmail,
  jobDescription, targetRole, targetCompany,
}: Props) {
  const [preview, setPreview]   = useState(true);
  const [showEM,  setShowEM]    = useState(false);

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <DownloadBar
          content={content} docType={docType} candidateName={candidateName}
          phone={phone} email={email} templates={templates} bios={bios}
        />
        <div className="flex items-center gap-2">
          {onRetailor && (
            <button onClick={onRetailor} className="flex items-center gap-1.5 glass-card border border-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">
              <RefreshCw className="w-3 h-3"/> Re-generate
            </button>
          )}
          <button onClick={()=>setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
              preview ? 'bg-[#C9A84C]/12 border-[#C9A84C]/25 text-[#C9A84C]' : 'glass-card border-white/10 text-white/50 hover:text-white'
            }`}>
            {preview ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
          {showEmail && (
            <button onClick={()=>setShowEM(true)}
              className="flex items-center gap-1.5 bg-[#0D7C66] hover:bg-[#10A882] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
              <Mail className="w-3 h-3"/> Send Email
            </button>
          )}
        </div>
      </div>

      {/* Two-pane or single editor */}
      <div className={`grid gap-4 ${preview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <span className="text-white/35 text-xs font-mono uppercase tracking-widest">Markdown · Editable</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D7C66] pulse"/>
              <span className="text-[#0D7C66] text-xs">Live</span>
            </div>
          </div>
          <textarea value={content} onChange={e=>onChange(e.target.value)}
            className="w-full p-4 text-white/70 text-xs font-mono bg-transparent focus:outline-none leading-relaxed"
            style={{minHeight:'520px'}}/>
        </div>

        {/* Preview */}
        {preview && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">Preview</span>
              <span className="text-gray-300 text-xs">Nigerian Format</span>
            </div>
            <div className="p-6 overflow-y-auto" style={{maxHeight:'540px'}}>
              <CVPreview markdown={content}/>
            </div>
          </div>
        )}
      </div>

      {showEM && showEmail && (
        <EmailModal
          cvContent={cvContent || content}
          defaultTo={defaultEmailTo}
          defaultFromName={defaultFromName}
          defaultFromEmail={defaultFromEmail}
          jobDescription={jobDescription}
          targetRole={targetRole}
          targetCompany={targetCompany}
          onClose={()=>setShowEM(false)}
        />
      )}
    </div>
  );
}
