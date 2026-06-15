import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import LegalBody from '@/components/LegalBody';
import { COOKIE_POLICY } from '@/lib/cookiePolicy';

export const metadata: Metadata = {
  title: 'Cookie Policy — CapitalChain',
  description: 'Understand how Capital Chain uses cookies, local storage, and similar technologies, and the choices available to you.',
};

export default function CookiePolicy() {
  return (
    <>
      <PromoBar />
      <Nav />
      <LegalBody
        eyebrow="Legal"
        titleA="Cookie"
        titleB="Policy"
        sub="Understand how we use cookies and similar technologies — details on cookies, local storage, and similar tech we use."
        items={COOKIE_POLICY}
      />
      <FinalCTA />
      <Footer />
    </>
  );
}
