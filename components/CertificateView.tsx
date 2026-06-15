'use client';

import { useRef, useState } from 'react';

export type CertVariant = 'payout' | 'phase1' | 'phase2';

// Template images per variant. Phases ship light + dark; the payout template is
// light-only, so it shows the same image in both themes (see `co-on-light` below).
const TEMPLATES: Record<CertVariant, { light: string; dark: string }> = {
  payout: { light: '/certificates/payout-light.png', dark: '/certificates/payout-dark.png' },
  phase1: { light: '/certificates/phase1-light.png', dark: '/certificates/phase1-dark.png' },
  phase2: { light: '/certificates/phase2-light.png', dark: '/certificates/phase2-dark.png' },
};

interface FieldPos {
  top: string;
  left: string;
  size: string; // font size in cqw (container query width)
  center?: boolean; // center horizontally on `left`
}

// Where each value sits ON TOP of the template (percent of the image box).
// Easy to fine-tune — nudge these to line up perfectly with the artwork.
const LAYOUT: Record<CertVariant, { name: FieldPos; size: FieldPos; date: FieldPos; amount?: FieldPos }> = {
  // Payout: left-aligned design with a trophy on the right.
  payout: {
    name: { top: '34%', left: '9.8%', size: '3cqw' },
    amount: { top: '52.6%', left: '23.2%', size: '1.55cqw' },
    size: { top: '58%', left: '21%', size: '1.55cqw' },
    date: { top: '77%', left: '21%', size: '1.5cqw' },
  },
  // Phase certificates are centred. Name sits under "presented to:", the account
  // size under "Account Size:", and the date by the bottom-left "DATE" marker.
  phase1: {
    name: { top: '40%', left: '50%', size: '2.6cqw', center: true },
    size: { top: '54%', left: '50%', size: '2cqw', center: true },
    date: { top: '82.5%', left: '12.5%', size: '1.5cqw' },
  },
  phase2: {
    name: { top: '40%', left: '50%', size: '2.6cqw', center: true },
    size: { top: '54%', left: '50%', size: '2cqw', center: true },
    date: { top: '82.5%', left: '12.5%', size: '1.5cqw' },
  },
};

interface Props {
  variant?: CertVariant;
  name: string;
  amount: string;
  size: string;
  date: string;
  txUrl?: string;
}

function fieldStyle(p: FieldPos): React.CSSProperties {
  return {
    top: p.top,
    left: p.left,
    fontSize: p.size,
    ...(p.center ? { transform: 'translateX(-50%)', textAlign: 'center' as const } : {}),
  };
}

export default function CertificateView({ variant = 'payout', name, amount, size, date, txUrl }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);

  const tpl = TEMPLATES[variant];
  const pos = LAYOUT[variant];
  const isPayout = variant === 'payout';
  const altText = isPayout ? 'Payout Certificate' : `Evaluation Certificate — ${variant === 'phase1' ? 'Phase 1' : 'Phase 2'}`;

  const fileBase = `capitalchain-${variant}-certificate-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'trader'}`;

  // Rasterize the certificate node at roughly 2× the template's native resolution.
  async function renderCanvas(): Promise<HTMLCanvasElement> {
    const node = wrapRef.current!;
    if (document.fonts?.ready) await document.fonts.ready;
    const html2canvas = (await import('html2canvas')).default;
    const targetWidth = 2158; // 2× native template width (1079px)
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
        {/* Each variant ships light + dark artwork; CSS shows the active theme's. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tpl.light} alt={altText} className="certimg-bg certimg-light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tpl.dark} alt={altText} className="certimg-bg certimg-dark" />

        {/* Dynamic data overlaid on the template */}
        <div className="certimg-overlay">
          <span className="co-name" style={fieldStyle(pos.name)}>
            {name}
          </span>
          {isPayout && pos.amount ? (
            <span className="co-val" style={fieldStyle(pos.amount)}>
              {amount}
            </span>
          ) : null}
          <span className="co-val" style={fieldStyle(pos.size)}>
            {size || '—'}
          </span>
          <span className="co-date" style={fieldStyle(pos.date)}>
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
