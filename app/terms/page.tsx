import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import TermsBody from '@/components/TermsBody';

export const metadata: Metadata = {
  title: 'Terms of Use — CapitalChain',
  description: 'Read the Capital Chain Terms of Use. Understand evaluation guidelines, profit drawdowns, prohibited trading practices, and payout policies.',
};

export default function TermsOfUse() {
  return (
    <>
      <PromoBar />
      <Nav />
      <TermsBody />
      <FinalCTA />
      <Footer />
    </>
  );
}
