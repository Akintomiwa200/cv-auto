// components/ui/DownloadBar.tsx
'use client'



import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DocType, DownloadFormat } from '@/lib/types';

interface DownloadBarProps {
  content: string;
  docType: DocType;
  candidateName: string;
  phone?: string;
  email?: string;
  templates?: object[];
  bios?: object;
  // Add any other props that might be passed
  [key: string]: any;
}

const FORMATS: { id: DownloadFormat; label: string; icon?: any }[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'docx', label: 'DOCX' },
  { id: 'txt', label: 'TXT' },
  { id: 'html', label: 'HTML' },
];

export default function DownloadBar({
  content,
  docType,
  candidateName,
  phone = '',
  email = '',
  templates = [],
  bios = {},
  ...rest // Capture any other props
}: DownloadBarProps) {
  const [downloading, setDownloading] = useState<DownloadFormat | null>(null);

  const handleDownload = async (format: DownloadFormat) => {
    setDownloading(format);
    
    try {
      const response = await fetch('/api/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          docType,
          format,
          candidateName,
          phone,
          email,
          templates,
          bios,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Download failed');
      }

      if (result.success) {
        // Convert base64 to binary
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.mimeType });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(`Downloaded as ${format.toUpperCase()}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download file');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-white/40 text-xs uppercase tracking-wider hidden sm:block mr-1">
        Export
      </div>
      {FORMATS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleDownload(id)}
          disabled={downloading !== null}
          className="flex items-center gap-1.5 glass-card border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading === id ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Download className="w-3 h-3" />
          )}
          {label}
        </button>
      ))}
      <div className="text-white/20 text-xs hidden lg:block">
        {content.length} chars
      </div>
    </div>
  );
}