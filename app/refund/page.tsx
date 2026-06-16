import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import LegalBody from '@/components/LegalBody';
import { REFUND_POLICY } from '@/lib/refundPolicy';

export const metadata: Metadata = {
  title: 'Refund Policy, CapitalChain',
  description: 'Learn when and how refunds may be issued at Capital Chain, clear guidance on eligibility and the refund process.',
};

export default function RefundPolicy() {
  return (
    <>
      <PromoBar />
      <Nav />
      <LegalBody
        eyebrow="Legal"
        titleA="Refund"
        titleB="Policy"
        sub="Learn when and how refunds may be issued, clear guidance on eligibility and the process for refunds."
        items={REFUND_POLICY}
      />
      <FinalCTA />
      <Footer />
    </>
  );
}
