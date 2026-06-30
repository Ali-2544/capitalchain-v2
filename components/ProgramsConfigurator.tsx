'use client';

import { useEffect, useState } from 'react';
import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';
import { LINKS } from '@/lib/links';

/* ────────────────────────────────────────────────────────────────────────────
   "Configure your funded account" — static content ported from the old site:
   Standard/Atomic × One/Two-Step × account size drive the spec table + price.
   Rendered in the new site's light design. "Start Challenge" deep-links to
   checkout with the selection.
   ────────────────────────────────────────────────────────────────────────── */

type ChallengeType = 'Standard' | 'Atomic' | 'Instant';
type StepType = '1' | '2';
type SizeType = '3k' | '5k' | '10k' | '25k' | '50k' | '100k';

interface Trio {
  step1: string;
  step2: string;
  funded: string;
}
interface Details {
  profitTarget: Trio;
  maximumLossLimit: Trio;
  dailyLossLimit: Trio;
  maximumLossLimitType: Trio;
  profitSplit: Trio;
  refundableFee: Trio;
}

const DETAILS: Record<string, Details> = {
  'Standard-1': {
    profitTarget: { step1: '10%', step2: '', funded: 'Unlimited' },
    maximumLossLimit: { step1: '6%', step2: '', funded: '6%' },
    dailyLossLimit: { step1: '3%', step2: '', funded: '3%' },
    maximumLossLimitType: { step1: 'Static', step2: 'Static', funded: 'Static' },
    profitSplit: { step1: '-', step2: '-', funded: '80%' },
    refundableFee: { step1: '100%', step2: '100%', funded: '100%' },
  },
  'Standard-2': {
    profitTarget: { step1: '8%', step2: '5%', funded: 'Unlimited' },
    maximumLossLimit: { step1: '10%', step2: '10%', funded: '10%' },
    dailyLossLimit: { step1: '5%', step2: '5%', funded: '5%' },
    maximumLossLimitType: { step1: 'Static', step2: 'Static', funded: 'Static' },
    profitSplit: { step1: '-', step2: '-', funded: '80%' },
    refundableFee: { step1: '100%', step2: '100%', funded: '100%' },
  },
  'Atomic-1': {
    profitTarget: { step1: '10%', step2: '', funded: 'Unlimited' },
    maximumLossLimit: { step1: '7%', step2: '', funded: '7%' },
    dailyLossLimit: { step1: '3%', step2: '', funded: '3%' },
    maximumLossLimitType: { step1: 'Static', step2: 'Static', funded: 'Static' },
    profitSplit: { step1: '20%', step2: '-', funded: '80%' },
    refundableFee: { step1: '100%', step2: '100%', funded: '100%' },
  },
  'Atomic-2': {
    profitTarget: { step1: '8%', step2: '5%', funded: 'Unlimited' },
    maximumLossLimit: { step1: '12%', step2: '12%', funded: '12%' },
    dailyLossLimit: { step1: '5%', step2: '5%', funded: '5%' },
    maximumLossLimitType: { step1: 'Static', step2: 'Static', funded: 'Static' },
    profitSplit: { step1: '20%', step2: '20%', funded: '80%' },
    refundableFee: { step1: '100%', step2: '100%', funded: '100%' },
  },
  // Instant funding — no evaluation phase, only the live/funded account applies.
  'Instant-1': {
    profitTarget: { step1: '', step2: '', funded: 'Unlimited' },
    maximumLossLimit: { step1: '', step2: '', funded: '5%' },
    dailyLossLimit: { step1: '', step2: '', funded: '5%' },
    maximumLossLimitType: { step1: '', step2: '', funded: 'Static' },
    profitSplit: { step1: '', step2: '', funded: '80%' },
    refundableFee: { step1: '', step2: '', funded: '100%' },
  },
};

// `${type}-${step}-${size}` -> one-time price (USD)
const PRICING: Record<string, number> = {
  'Standard-1-3k': 28, 'Standard-1-5k': 45, 'Standard-1-10k': 85, 'Standard-1-25k': 220, 'Standard-1-50k': 375, 'Standard-1-100k': 545,
  'Standard-2-3k': 22, 'Standard-2-5k': 35, 'Standard-2-10k': 69, 'Standard-2-25k': 170, 'Standard-2-50k': 300, 'Standard-2-100k': 515,
  'Atomic-1-5k': 54, 'Atomic-1-10k': 85, 'Atomic-1-25k': 219, 'Atomic-1-50k': 362, 'Atomic-1-100k': 625,
  'Atomic-2-5k': 48, 'Atomic-2-10k': 79, 'Atomic-2-25k': 199, 'Atomic-2-50k': 328, 'Atomic-2-100k': 603,
  'Instant-1-5k': 99, 'Instant-1-10k': 179, 'Instant-1-25k': 349, 'Instant-1-50k': 699, 'Instant-1-100k': 1399,
};

const SIZES: { value: SizeType; label: string; short: string }[] = [
  { value: '3k', label: '$3,000', short: '3' },
  { value: '5k', label: '$5,000', short: '5' },
  { value: '10k', label: '$10,000', short: '10' },
  { value: '25k', label: '$25,000', short: '25' },
  { value: '50k', label: '$50,000', short: '50' },
  { value: '100k', label: '$100,000', short: '100' },
];

// Average first-payout figure shown on each card's footer (per account size).
const AVG_REWARDS: Record<SizeType, string> = {
  '3k': '$140',
  '5k': '$232',
  '10k': '$475',
  '25k': '$1,076',
  '50k': '$1,897',
  '100k': '$3,614',
};

// Which size card gets the "MOST POPULAR" highlight.
const POPULAR: SizeType = '50k';

const NOTES: Record<string, string> = {
  'Standard-1': 'One profit target. Hit it within the drawdown limits, no minimum days, no deadline.',
  'Standard-2': 'Two evaluation phases with relaxed targets and wider drawdown.',
  'Atomic-1': 'One aggressive phase with a tighter max loss, for confident, fast traders.',
  'Atomic-2': 'Two phases with the widest drawdown buffer in the Atomic line.',
  'Instant-1': 'Skip the evaluation. Get a funded account instantly and start trading right away.',
};

export default function ProgramsConfigurator() {
  const t = useT();
  const [type, setType] = useState<ChallengeType>('Standard');
  const [step, setStep] = useState<StepType>('1');
  const [infoOpen, setInfoOpen] = useState<SizeType | null>(null);

  // Close the details modal on Escape.
  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInfoOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [infoOpen]);

  const isInstant = type === 'Instant';
  const isOne = step === '1';
  const isAtomic = type === 'Atomic';
  const stepName = isInstant ? 'Instant' : isOne ? 'One Step' : 'Two Step';
  const details = DETAILS[isInstant ? 'Instant-1' : `${type}-${step}`];
  const sizes = isAtomic || isInstant ? SIZES.filter((s) => s.value !== '3k') : SIZES;

  const priceFor = (sz: SizeType) => PRICING[isInstant ? `Instant-1-${sz}` : `${type}-${step}-${sz}`];

  const checkoutFor = (sz: SizeType) => {
    const p = new URLSearchParams({
      challenge_type: type,
      challenge_step: isInstant ? 'instant' : step,
      account_size: sz,
      product_name: isInstant ? `Instant ${sz}` : `${type} ${stepName} ${sz}`,
    });
    const pr = priceFor(sz);
    if (pr != null) p.append('price', String(pr));
    return `${LINKS.checkout}?${p.toString()}`;
  };

  // Spec rows are the same across every size card — only price + avg rewards differ.
  const profitSub: [string, string][] = isInstant
    ? [['Funded', details.profitTarget.funded]]
    : isOne
      ? [['Phase 1', details.profitTarget.step1], ['Funded', details.profitTarget.funded]]
      : [['Phase 1', details.profitTarget.step1], ['Phase 2', details.profitTarget.step2], ['Funded', details.profitTarget.funded]];

  const flatRows: [string, string][] = isInstant
    ? [
        ['Max Loss', details.maximumLossLimit.funded],
        ['Risk Per Trade', '2%'],
        ['Max Loss Type', details.maximumLossLimitType.funded],
        ['Split', `Weekly · ${details.profitSplit.funded}`],
        ['Refundable Fee', 'With 3rd payout'],
        ['Leverage', '1:50'],
      ]
    : [
        ['Max Loss', details.maximumLossLimit.funded],
        ['Daily Loss', details.dailyLossLimit.funded],
        ['Max Loss Type', details.maximumLossLimitType.funded],
        ['Split', `Weekly · ${details.profitSplit.funded}`],
        ['Leverage', '1:100'],
      ];

  // Extra details shown in the per-card info popup.
  const planTitle = isInstant ? 'Instant Funded' : `${type} · ${stepName}`;
  const note = NOTES[isInstant ? 'Instant-1' : `${type}-${step}`];
  const infoFacts: [string, string][] = [
    ['Refundable Fee', isInstant ? 'Refunded with 3rd payout' : 'Fully refundable (100%)'],
    ['Min Trading Days', isInstant ? '3 Days' : '4 Days'],
    ['Weekend Holding', 'Allowed'],
    ['News Trading', 'Allowed'],
    ['Payout Cycle', 'Weekly'],
  ];

  return (
    <section className="sec band" id="programs">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="programs.idx">{t.programs.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="programs.title_a">{t.programs.title_a}</Editable>{' '}
              <Editable className="gt" id="programs.title_b">{t.programs.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="programs.sub">{t.programs.sub}</Editable></p>
        </div>

        {/* toggles — top: Instant / One Step / Two Step; bottom: Standard / Atomic */}
        <div className="prog-controls reveal">
          <div className="prog-ctl-row">
            <div className="seg">
              <button
                type="button"
                data-seg="Instant"
                className={isInstant ? 'active' : undefined}
                onClick={() => setType('Instant')}
              >
                Instant
                <span className="seg-new">NEW</span>
              </button>
              {([['1', 'One Step'], ['2', 'Two Step']] as [StepType, string][]).map(([s, label]) => (
                <button
                  key={s}
                  type="button"
                  className={!isInstant && s === step ? 'active' : undefined}
                  onClick={() => {
                    if (isInstant) setType('Standard');
                    setStep(s);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* Instant has no evaluation model, so the Standard/Atomic choice is hidden. */}
          {!isInstant && (
            <div className="prog-ctl-row">
              <div className="seg">
                {(['Standard', 'Atomic'] as ChallengeType[]).map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    data-seg={tp}
                    className={tp === type ? 'active' : undefined}
                    onClick={() => setType(tp)}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="prog-note reveal">{NOTES[isInstant ? 'Instant-1' : `${type}-${step}`]}</p>

        {/* pricing cards — one per account size */}
        <div className="prog-cards reveal">
          {sizes.map((s) => {
            const pr = priceFor(s.value);
            const popular = s.value === POPULAR;
            return (
              <div className={`prog-card${popular ? ' popular' : ''}`} key={s.value}>
                {popular && <span className="pcp-badge">MOST POPULAR</span>}

                <div className="pc-head">
                  <div>
                    <span className="pc-lab">Account Size</span>
                    <span className="pc-size">${s.short}K</span>
                  </div>
                  <div className="pc-head-r">
                    <span className="pc-lab">Price</span>
                    <span className="pc-price"><span className="pc-cur">$</span>{pr ?? '—'}</span>
                  </div>
                </div>

                <div className="pc-specs">
                  <div className="pc-grp">
                    <div className="pc-grp-h">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/challenge/target.png" alt="" width={18} height={18} loading="lazy" />
                      Profit Target
                    </div>
                    {profitSub.map(([l, v]) => (
                      <div className="pc-sub" key={l}>
                        <span>{l}</span>
                        <span className="pc-v">{v || '-'}</span>
                      </div>
                    ))}
                  </div>
                  {flatRows.map(([l, v]) => (
                    <div className="pc-row" key={l}>
                      <span>{l}</span>
                      <span className="pc-v gt">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="pc-foot">
                  Traders earn <b>{AVG_REWARDS[s.value]}</b> avg first rewards
                </div>

                <div className="pc-actions">
                  <button
                    type="button"
                    className="pc-info-btn"
                    aria-expanded={infoOpen === s.value}
                    onClick={() => setInfoOpen(infoOpen === s.value ? null : s.value)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="11" x2="12" y2="16" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Program details
                  </button>
                  <a
                    href={checkoutFor(s.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pc-buy"
                    data-magnetic
                  >
                    Buy Challenge
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Program details — centered modal (room to grow as more data is added) */}
      {infoOpen && (
        <div className="prog-modal" role="dialog" aria-modal="true" onClick={() => setInfoOpen(null)}>
          <div className="prog-modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="pc-info-x" aria-label="Close" onClick={() => setInfoOpen(null)}>
              ×
            </button>
            <h3 className="pcip-title">{planTitle}</h3>
            <p className="pcip-desc">{note}</p>
            <ul className="pcip-list">
              {infoFacts.map(([l, v]) => (
                <li key={l}>
                  <span>{l}</span>
                  <b>{v}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
