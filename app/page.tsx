import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import HomeSections from '@/components/HomeSections';
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
      {/* The home content sections, reorderable via drag in admin Edit mode. */}
      <main>
        <HomeSections />
      </main>
      <Footer />
    </>
  );
}
