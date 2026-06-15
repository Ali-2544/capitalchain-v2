import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import LegalBody from '@/components/LegalBody';
import { KYC_AML_POLICY } from '@/lib/kycAmlPolicy';

export const metadata: Metadata = {
  title: 'KYC & AML Policy — CapitalChain',
  description: 'Capital Chain identity verification (KYC) requirements and anti-money laundering (AML) compliance measures.',
};

export default function KycAmlPolicy() {
  return (
    <>
      <PromoBar />
      <Nav />
      <LegalBody
        eyebrow="Legal"
        titleA="KYC & AML"
        titleB="Policy"
        sub="Our requirements for identity verification and anti-money laundering compliance across our operations and partnerships."
        items={KYC_AML_POLICY}
      />
      <FinalCTA />
      <Footer />
    </>
  );
}
