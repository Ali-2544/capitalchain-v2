import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import LegalBody from '@/components/LegalBody';
import { PRIVACY_POLICY } from '@/lib/privacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy — CapitalChain',
  description: 'Learn how Capital Chain collects, uses, and protects your personal data, and the rights you have over your information.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <PromoBar />
      <Nav />
      <LegalBody
        eyebrow="Legal"
        titleA="Privacy"
        titleB="Policy"
        sub="Learn how we collect, use, and protect your information — our commitment to transparency and data protection."
        items={PRIVACY_POLICY}
      />
      <FinalCTA />
      <Footer />
    </>
  );
}
