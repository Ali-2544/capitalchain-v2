import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import LegalBody from '@/components/LegalBody';
import { RISK_DISCLOSURE } from '@/lib/riskDisclosure';

export const metadata: Metadata = {
  title: 'Risk Disclosure — CapitalChain',
  description: 'Important information about the risks of trading and participation in Capital Chain programs. Please read carefully.',
};

export default function RiskDisclosure() {
  return (
    <>
      <PromoBar />
      <Nav />
      <LegalBody
        eyebrow="Legal"
        titleA="Risk"
        titleB="Disclosure"
        sub="Important information about the risks of trading and participation. Please read carefully before participating in trading programs."
        items={RISK_DISCLOSURE}
      />
      <FinalCTA />
      <Footer />
    </>
  );
}
