import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Payout Certificate — Capital Chain',
  robots: { index: false, follow: false },
};

// Where each value sits ON TOP of the template (percent of the image box).
// Both templates share the same layout, so one set of positions works for both.
// Tweak these to line up perfectly with your template.
const POS = {
  name: { top: '30%', left: '10.5%' }, //  in the band under "awarded to"
  amount: { top: '49%', left: '26.5%' }, // right after the printed "Payout Amount:"
  size: { top: '55%', left: '25%' }, //     right after the printed "Account Size:"
  date: { top: '74%', left: '15%' }, //     above the left signature line, before "Date"
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
    <div className="certimg-page">
      <div className="certimg-wrap">
        {/* Your two templates — the right one shows for the active theme. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/certificate-light.png" alt="Payout Certificate" className="certimg-bg certimg-light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/certificate-dark.png" alt="Payout Certificate" className="certimg-bg certimg-dark" />

        {/* Dynamic data overlaid on the template */}
        <div className="certimg-overlay">
          <span className="co-name" style={POS.name}>
            {payout.traderName}
          </span>
          <span className="co-val" style={POS.amount}>
            {payout.amount}
          </span>
          <span className="co-val" style={POS.size}>
            {payout.accountSize || '—'}
          </span>
          <span className="co-date" style={POS.date}>
            {date}
          </span>
        </div>
      </div>
      <PrintButton />
    </div>
  );
}
