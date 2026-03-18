'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, ArrowLeft } from 'lucide-react';

interface Props {
  backHref?: string;
  title?: string;
  right?: React.ReactNode;
}

export default function Nav({ backHref = '/', title, right }: Props) {
  const path = usePathname();

  const tabs = [
    { label: 'Dashboard',       href: '/dashboard' },
    { label: 'Resume',          href: '/resume' },
    { label: 'Cover Letter',    href: '/cover-letter' },
    { label: 'Email Templates', href: '/email-templates' },
    { label: 'Bio Sheet',       href: '/bio-sheet' },
    { label: 'Templates',       href: '/templates' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: logo + back */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href={backHref} className="text-white/35 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-4 h-4"/>
          </Link>
          <div className="w-px h-4 bg-white/10"/>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C9A84C] to-[#9E7A2A] flex items-center justify-center">
              <FileText className="w-3 h-3 text-black"/>
            </div>
            <span style={{fontFamily:'Playfair Display,serif'}} className="font-bold text-[#F0EDE6] text-sm hidden sm:block">
              CV Tailor <span className="text-[#C9A84C]">NG</span>
            </span>
          </Link>
        </div>

        {/* Centre: tabs (hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
          {tabs.map(t => (
            <Link key={t.href} href={t.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                path === t.href
                  ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/25'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}>
              {t.label}
            </Link>
          ))}
        </nav>

        {/* Right slot */}
        <div className="flex-shrink-0">{right}</div>
      </div>
    </header>
  );
}
