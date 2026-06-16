import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import ContactBody from '@/components/ContactBody';

export const metadata: Metadata = {
  title: 'Contact Us, CapitalChain',
  description: 'Get in touch with the Capital Chain support team. Contact us 24/7 via live chat, email, or join our community Discord server.',
};

export default function ContactUs() {
  return (
    <>
      <PromoBar />
      <Nav />
      <ContactBody />
      <FinalCTA />
      <Footer />
    </>
  );
}
