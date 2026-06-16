import type { Metadata } from 'next';
import { Space_Grotesk, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { ContentProvider } from '@/components/ContentProvider';
import EditModeToggle from '@/components/EditModeToggle';
import EditorPopover from '@/components/EditorPopover';
import GlobeMount from '@/components/GlobeMount';
import Effects from '@/components/Effects';
import Intercom from '@/components/Intercom';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const body = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Empowering traders with access to funded capital',
  description:
    'Trade with straightforward rules and clear challenges at Capital Chain. Join a global community of traders in a simulated environment and earn generous rewards. Start your challenge today.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="light" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <ContentProvider>
              {/* Fixed full-viewport WebGL globe, rendered once, persists across routes. */}
              <GlobeMount />
              {/* Fixed scrims + JS-driven chrome + all page micro-interactions. */}
              <Effects />
              {children}
              {/* Admin-only floating inline-edit toggle + editor popover. */}
              <EditModeToggle />
              <EditorPopover />
              {/* Intercom live chat (lazy-loaded on first interaction). */}
              <Intercom />
            </ContentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
