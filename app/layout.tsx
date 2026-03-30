// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import ClientProviders from './ClientProviders';

export const metadata: Metadata = {
  title: 'CV Tailor NG — Nigerian Job Application Suite',
  description:
    'AI-powered CV tailoring, cover letters, email templates, resumes and more — built for the Nigerian job market.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-bg min-h-screen">
        {/* Wrap children with client components like Toaster */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}