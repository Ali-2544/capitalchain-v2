import type { Metadata } from 'next';
import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import GlobeMount from '@/components/GlobeMount';
import Effects from '@/components/Effects';

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
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CapitalChain — We Connect Traders To Capital',
  description:
    'Trade with straightforward rules and clear challenges at Capital Chain. Join a global community of traders in a simulated environment and earn generous rewards. Start your challenge today.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="light" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {/* Fixed full-viewport WebGL globe — rendered once, persists across routes. */}
            <GlobeMount />
            {/* Fixed scrims + JS-driven chrome + all page micro-interactions. */}
            <Effects />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
