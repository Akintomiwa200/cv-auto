'use client';

import { useState } from 'react';
import { Download, FileText, File, FileCode, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { DocType, DownloadFormat } from '@/lib/types';

interface Props {
  content: string;
  docType: DocType;
  candidateName: string;
  phone?: string;
  email?: string;
  templates?: object[];
  bios?: object;
  extraPayload?: Record<string, unknown>;
}

const FORMATS: { id: DownloadFormat; label: string; icon: typeof FileText }[] = [
  { id: 'pdf',  label: 'PDF',  icon: FileText },
  { id: 'docx', label: 'DOCX', icon: File },
  { id: 'txt',  label: 'TXT',  icon: FileCode },
  { id: 'html', label: 'HTML', icon: FileCode },
];

export default function DownloadBar({ content, docType, candidateName, phone='', email='', templates, bios, extraPayload }: Props) {
  const [busy, setBusy] = useState<DownloadFormat | null>(null);
  const [done, setDone] = useState<DownloadFormat[]>([]);

  async function download(fmt: DownloadFormat) {
    setBusy(fmt);
    try {
      const res = await fetch('/api/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, docType, format: fmt, candidateName, phone, email, templates, bios, ...extraPayload }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `${candidateName.replace(/\s+/g,'_')}_${docType}.${fmt}` });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDone(d => [...d, fmt]);
      toast.success(`Downloaded as ${fmt.toUpperCase()}`);
    } catch (e) {
      toast.error('Download failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-white/35 text-xs mr-1">Download:</span>
      {FORMATS.map(f => (
        <button key={f.id} onClick={() => download(f.id)} disabled={!!busy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
            done.includes(f.id)
              ? 'bg-[#0D7C66]/15 border-[#0D7C66]/30 text-[#0D7C66]'
              : 'glass-card border-white/10 text-white/60 hover:text-white hover:border-white/20'
          }`}>
          {busy === f.id
            ? <Loader2 className="w-3 h-3 spin"/>
            : done.includes(f.id)
              ? <Check className="w-3 h-3"/>
              : <Download className="w-3 h-3"/>
          }
          {f.label}
        </button>
      ))}
    </div>
  );
}
