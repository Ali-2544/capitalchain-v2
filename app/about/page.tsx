import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import AboutBody from '@/components/AboutBody';

export const metadata: Metadata = {
  title: 'About Us, CapitalChain',
  description: 'Learn about Capital Chain, our mission, vision, and the professional team behind the world\'s leading prop trading platform.',
};

export default function AboutUs() {
  return (
    <>
      <PromoBar />
      <Nav />
      <AboutBody />
      <FinalCTA />
      <Footer />
    </>
  );
}
