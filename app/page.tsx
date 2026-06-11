import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import TrustBand from '@/components/TrustBand';
import Ticker from '@/components/Ticker';
import WhoWeAre from '@/components/WhoWeAre';
import HowStacking from '@/components/HowStacking';
import ProgramsConfigurator from '@/components/ProgramsConfigurator';
import PayoutCycles from '@/components/PayoutCycles';
import Calculator from '@/components/Calculator';
import WhyBento from '@/components/WhyBento';
import Platforms from '@/components/Platforms';
import Champions from '@/components/Champions';
import ScalingLadder from '@/components/ScalingLadder';
import LiveRewards from '@/components/LiveRewards';
import Testimonials from '@/components/Testimonials';
import Community from '@/components/Community';
import Affiliate from '@/components/Affiliate';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Capital Chain | Get Funded Up to $100,000 with a One-Step Prop Trading Challenge.',
  description:
    "Pass Capital Chain's one-step trading challenge and get funded up to $100,000. Keep up to 80% profit share, enjoy fast payouts, and trade without risking personal capital.",
};

export default function Home() {
  return (
    <>
      <PromoBar />
      <Nav />
      <Hero />
      <TrustBand />
      <Ticker />
      <HowStacking />
      <ProgramsConfigurator />
      <PayoutCycles />
      <Calculator />
      <WhoWeAre />
      <WhyBento />
      <Platforms />
      <Champions />
      <ScalingLadder />
      <LiveRewards />
      <Testimonials />
      <Community />
      <Affiliate />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
