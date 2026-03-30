// components/ui/EmailModal.tsx
import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailModalProps {
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
  cvContent,
  defaultTo = '',
  defaultFromName = '',
  defaultFromEmail = '',
  jobDescription = '',
  targetRole = '',
  targetCompany = '',
  onClose,
}: EmailModalProps) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(
    `Application for ${targetRole || 'Position'} at ${targetCompany || 'Company'}`
  );
  const [message, setMessage] = useState(
    `Dear Hiring Manager,\n\nPlease find attached my application for the ${targetRole || 'position'} at ${targetCompany || 'your company'}.\n\nI believe my skills and experience align well with your requirements.\n\nBest regards,\n${defaultFromName || 'Candidate'}`
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim()) {
      toast.error('Please enter recipient email');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim(),
          from: defaultFromEmail,
          fromName: defaultFromName,
          subject: subject.trim(),
          body: message,
          cvContent,
          jobDescription,
          targetRole,
          targetCompany,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      toast.success('Email sent successfully!');
      onClose();
    } catch (error) {
      console.error('Send email error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A1A2A] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-[#F0EDE6] font-semibold flex items-center gap-2">
            <Send className="w-4 h-4 text-[#C9A84C]" />
            Send Application by Email
          </h3>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
              To *
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="careers@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:border-[#C9A84C]/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:border-[#C9A84C]/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:border-[#C9A84C]/40 focus:outline-none resize-none"
            />
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/40 text-xs mb-2">📎 Attachment:</p>
            <p className="text-white/70 text-sm">Your tailored CV will be attached as PDF</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !to.trim()}
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C96B] disabled:opacity-50 text-black font-medium px-4 py-2 rounded-lg text-sm transition-all"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}