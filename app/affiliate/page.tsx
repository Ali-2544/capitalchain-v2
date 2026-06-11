import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import AffiliateBody from '@/components/AffiliateBody';

export const metadata: Metadata = {
  title: 'Affiliate Program — CapitalChain',
  description: 'Join the Capital Chain Affiliate Program. Refer traders to our industry-leading prop firm and earn 15% lifetime commission with monthly payouts and real-time dashboards.',
};

export default function AffiliateProgram() {
  return (
    <>
      <PromoBar />
      <Nav />
      <AffiliateBody />
      <FinalCTA />
      <Footer />
    </>
  );
}
