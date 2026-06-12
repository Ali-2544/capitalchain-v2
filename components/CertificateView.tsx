'use client';

import { useRef, useState } from 'react';

// Where each value sits ON TOP of the template (percent of the image box).
// Both templates share the same layout, so one set of positions works for both.
// Tweak these to line up perfectly with your template.
const POS = {
  name: { top: '30%', left: '10.5%' }, //  in the band under "awarded to"
  amount: { top: '49%', left: '26.5%' }, // right after the printed "Payout Amount:"
  size: { top: '55%', left: '25%' }, //     right after the printed "Account Size:"
  date: { top: '74%', left: '15%' }, //     above the left signature line, before "Date"
};

interface Props {
  name: string;
  amount: string;
  size: string;
  date: string;
  txUrl?: string;
}

export default function CertificateView({ name, amount, size, date, txUrl }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);

  const fileBase = `capitalchain-certificate-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'payout'}`;

  // Rasterize the certificate node at the template's native resolution.
  async function renderCanvas(): Promise<HTMLCanvasElement> {
    const node = wrapRef.current!;
    // Make sure the web fonts are ready so the text renders correctly.
    if (document.fonts?.ready) await document.fonts.ready;
    const html2canvas = (await import('html2canvas')).default;
    const targetWidth = 3235; // native template width
    const scale = Math.max(2, targetWidth / node.clientWidth);
    return html2canvas(node, {
      scale,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  }

  async function downloadPng() {
    setBusy('png');
    try {
      const canvas = await renderCanvas();
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileBase}.png`;
      a.click();
    } catch {
      alert('Could not generate the image. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  async function downloadPdf() {
    setBusy('pdf');
    try {
      const canvas = await renderCanvas();
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileBase}.pdf`);
    } catch {
      alert('Could not generate the PDF. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="certimg-page">
      <div className="certimg-wrap" ref={wrapRef}>
        {/* Your two templates — the right one shows for the active theme. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/certificate-light.png" alt="Payout Certificate" className="certimg-bg certimg-light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/certificate-dark.png" alt="Payout Certificate" className="certimg-bg certimg-dark" />

        {/* Dynamic data overlaid on the template */}
        <div className="certimg-overlay">
          <span className="co-name" style={POS.name}>
            {name}
          </span>
          <span className="co-val" style={POS.amount}>
            {amount}
          </span>
          <span className="co-val" style={POS.size}>
            {size || '—'}
          </span>
          <span className="co-date" style={POS.date}>
            {date}
          </span>
        </div>
      </div>

      <div className="cert-actions no-print">
        <button className="cert-print" onClick={downloadPng} disabled={busy !== null}>
          {busy === 'png' ? 'Preparing…' : 'Download PNG'}
        </button>
        <button className="cert-print cert-print-2" onClick={downloadPdf} disabled={busy !== null}>
          {busy === 'pdf' ? 'Preparing…' : 'Download PDF'}
        </button>
        <button className="cert-print cert-print-ghost" onClick={() => window.print()} disabled={busy !== null}>
          Print
        </button>
        {txUrl ? (
          <a className="cert-print cert-print-ghost" href={txUrl} target="_blank" rel="noreferrer noopener">
            Verify transaction ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
