import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CV Tailor NG — Nigerian Job Application Suite',
  description: 'AI-powered CV tailoring, cover letters, email templates, resumes and more — built for the Nigerian job market.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-bg min-h-screen">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#16161F',
              color: '#F0EDE6',
              border: '1px solid rgba(201,168,76,.2)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#0D7C66', secondary: '#F0EDE6' } },
            error:   { iconTheme: { primary: '#E76F51', secondary: '#F0EDE6' } },
          }}
        />
      </body>
    </html>
  );
}
