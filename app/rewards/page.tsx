import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import RewardsBody from '@/components/RewardsBody';

export const metadata: Metadata = {
  title: 'Rewards, CapitalChain',
  description:
    'Every reward Capital Chain has ever paid, logged in real time with on-chain proof for every crypto transaction. No press releases. No audits. Just receipts.',
};

export default function Rewards() {
  return (
    <>
      <PromoBar />
      <Nav />
      <RewardsBody />
      <FinalCTA />
      <Footer />
    </>
  );
}
