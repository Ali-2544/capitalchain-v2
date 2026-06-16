import type { Metadata } from 'next';
import AdminClient from '@/components/AdminClient';

export const metadata: Metadata = {
  title: 'Admin, CapitalChain',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
