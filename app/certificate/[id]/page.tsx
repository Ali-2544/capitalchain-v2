import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CertificateView, { type CertVariant } from '@/components/CertificateView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Capital Chain Certificate',
  robots: { index: false, follow: false },
};

// `?type=phase1|phase2` renders an evaluation certificate; anything else (default)
// renders the payout certificate. All variants draw from the same payout record.
function parseVariant(type?: string): CertVariant {
  return type === 'phase1' || type === 'phase2' ? type : 'payout';
}

export default async function CertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const { type } = await searchParams;
  const variant = parseVariant(type);

  const payout = await prisma.payout.findUnique({ where: { id: Number(id) } }).catch(() => null);
  if (!payout) notFound();

  const date = new Date(payout.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <CertificateView
      variant={variant}
      name={payout.traderName}
      amount={payout.amount}
      size={payout.accountSize}
      date={date}
      txUrl={payout.txUrl}
    />
  );
}
