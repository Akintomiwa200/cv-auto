'use client'; // This runs on the client only

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
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
          error: { iconTheme: { primary: '#E76F51', secondary: '#F0EDE6' } },
        }}
      />
    </>
  );
}