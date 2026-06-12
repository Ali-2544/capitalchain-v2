import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CertificateView from '@/components/CertificateView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Payout Certificate — Capital Chain',
  robots: { index: false, follow: false },
};

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payout = await prisma.payout.findUnique({ where: { id: Number(id) } }).catch(() => null);
  if (!payout) notFound();

  const date = new Date(payout.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <CertificateView
      name={payout.traderName}
      amount={payout.amount}
      size={payout.accountSize}
      date={date}
      txUrl={payout.txUrl}
    />
  );
}
