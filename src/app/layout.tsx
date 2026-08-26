import type { Metadata } from 'next';
import './globals.css';
import { CommandPalette } from '@/components/nav/CommandPalette';
import { searchIndex } from '@/lib/content/searchIndex';
import { MODE } from '@/lib/capabilities';

export const metadata: Metadata = {
  title: 'Chainpath',
  description: 'A learning system for blockchain development.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {MODE === 'web' && (
          <div className="border-b border-[var(--color-rule)] bg-[var(--color-warn-soft)] px-4 py-1.5 text-center text-[12px] text-[var(--color-warn)]">
            Read-only web copy — practice checks and saved progress need the local install.
          </div>
        )}
        {children}
        <CommandPalette items={searchIndex()} />
      </body>
    </html>
  );
}
