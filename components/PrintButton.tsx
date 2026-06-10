'use client';

export default function PrintButton() {
  return (
    <button className="cert-print no-print" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
