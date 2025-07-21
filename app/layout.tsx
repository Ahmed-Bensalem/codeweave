// app/layout.tsx
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ReactNode, Suspense } from 'react';

export const metadata = {
  title: 'CodeWeave',
  description: 'Your DevOps + GenAI Copilot',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body>
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            {children}
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
