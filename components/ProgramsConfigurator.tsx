'use client';

import { useEffect, useMemo, useState } from 'react';
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

const PAYMENTS = [
  { name: 'Visa', img: '/challenge/visa.jpg' },
  { name: 'MasterCard', img: '/challenge/master-card.jpg' },
  { name: 'UPI', img: '/challenge/upi.jpg' },
  { name: 'Korapay', img: '/challenge/korepay.jpg' },
  { name: 'Bitolo', img: '/challenge/bitolo.jpg' },
  { name: 'Crypto', img: '/challenge/crypto.jpg' },
];

const NOTES: Record<string, string> = {
  'Standard-1': 'One profit target. Hit it within the drawdown limits, no minimum days, no deadline.',
  'Standard-2': 'Two evaluation phases with relaxed targets and wider drawdown.',
  'Atomic-1': 'One aggressive phase with a tighter max loss, for confident, fast traders.',
  'Atomic-2': 'Two phases with the widest drawdown buffer in the Atomic line.',
  'Instant-1': 'Skip the evaluation. Get a funded account instantly and start trading right away.',
};

const Check = () => (
  <svg width="15" height="11" viewBox="0 0 19 15" fill="none" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.421 0.336783C19.0748 0.87877 19.1926 1.88306 18.684 2.5799L10.67 13.5599C9.42258 15.2692 7.07618 15.4909 5.56599 14.0424L0.49656 9.18053C-0.119199 8.58995 -0.169119 7.57929 0.38508 6.92307C0.939259 6.26684 1.8877 6.21377 2.50345 6.80435L7.57278 11.6663C7.78858 11.8732 8.12378 11.8414 8.30198 11.5972L16.316 0.617176C16.8246 -0.0796701 17.767 -0.205204 18.421 0.336783Z"
      fill="currentColor"
    />
  </svg>
);

export default function ProgramsConfigurator() {
  const t = useT();
  const [type, setType] = useState<ChallengeType>('Standard');
  const [step, setStep] = useState<StepType>('1');
  const [size, setSize] = useState<SizeType>('5k');

  // $3,000 is Standard-only — bump to 5k when switching to Atomic/Instant.
  useEffect(() => {
    if (type !== 'Standard' && size === '3k') setSize('5k');
  }, [type, size]);

  const isInstant = type === 'Instant';
  const isOne = step === '1';
  const isAtomic = type === 'Atomic';
  const stepName = isInstant ? 'Instant' : step === '1' ? 'One Step' : 'Two Step';
  const planLabel = isInstant ? 'Instant Funded' : `${type} · ${stepName}`;
  const details = DETAILS[isInstant ? 'Instant-1' : `${type}-${step}`];
  const price = PRICING[isInstant ? `Instant-1-${size}` : `${type}-${step}-${size}`];
  const sizes = isAtomic || isInstant ? SIZES.filter((s) => s.value !== '3k') : SIZES;

  const checkoutUrl = useMemo(() => {
    const p = new URLSearchParams({
      challenge_type: type,
      challenge_step: isInstant ? 'instant' : step,
      account_size: size,
      product_name: isInstant ? `Instant ${size}` : `${type} ${stepName} ${size}`,
    });
    if (price != null) p.append('price', String(price));
    return `${LINKS.checkout}?${p.toString()}`;
  }, [type, step, size, stepName, price, isInstant]);

  const rows = [
    { name: 'Profit Target', icon: '/challenge/target.png', v: details.profitTarget },
    { name: 'Maximum Loss Limit', icon: '/challenge/speed-limit.png', v: details.maximumLossLimit },
    ...(!isInstant ? [{ name: 'Daily Loss Limit', icon: '/challenge/sun-energy.png', v: details.dailyLossLimit }] : []),
    ...(isInstant ? [{ name: 'Risk Per Trade', icon: '/challenge/sun-energy.png', v: { step1: '', step2: '', funded: '2%' } }] : []),
    { name: 'Maximum Loss Limit Type', icon: '/challenge/coding.png', v: details.maximumLossLimitType },
    ...(!isAtomic ? [{ name: 'Profit Split', icon: '/challenge/division.png', v: details.profitSplit }] : []),
    { name: 'Refundable Fee', icon: '/challenge/recycle.png', v: { step1: details.refundableFee.step1, step2: '-', funded: isInstant ? 'With 3rd payout' : '-' } },
    { name: 'Leverage', icon: '/challenge/division.png', v: { step1: '1:100', step2: '1:100', funded: isInstant ? '1:50' : '1:100' } },
  ];

  const Val = ({ value }: { value: string }) =>
    value === '100%' ? (
      <span className="v ok"><Check /></span>
    ) : (
      <span className={`v${value === 'Unlimited' || value === '80%' ? ' ok' : ''}`}>{value}</span>
    );

  const cols = isInstant ? ['Funded'] : isOne ? ['Step 1', 'Funded'] : ['Step 1', 'Step 2', 'Funded'];

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

        <div className="config">
          {/* LEFT: selectors + spec table */}
          <div className="reveal">
            <div className="seg-row">
              <div className="seg">
                {(['Standard', 'Atomic', 'Instant'] as ChallengeType[]).map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    data-seg={tp}
                    className={tp === type ? 'active' : undefined}
                    onClick={() => {
                      setType(tp);
                      if (tp === 'Instant') setStep('1');
                    }}
                  >
                    {tp}
                    {tp === 'Instant' && <span className="seg-new">NEW</span>}
                  </button>
                ))}
              </div>
              {!isInstant && (
                <div className="seg">
                  {([['1', 'One Step'], ['2', 'Two Step']] as [StepType, string][]).map(([s, label]) => (
                    <button key={s} type="button" className={s === step ? 'active' : undefined} onClick={() => setStep(s)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="seg-note">{NOTES[`${type}-${step}`]}</div>

            <div className="size-track">
              {sizes.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`size-pill ${s.value === size ? 'active' : ''}`}
                  onClick={() => setSize(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* spec table with Step / Funded columns */}
            <div className="spec-cols">
              <div className="spec-cols-head">
                <span className="sc-name">
                  {planLabel}
                </span>
                <span className="sc-vals">
                  {cols.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </span>
              </div>
              {rows.map((r) => (
                <div className="scol-row" key={r.name}>
                  <span className="scol-name">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.icon} alt="" width={20} height={20} loading="lazy" />
                    {r.name}
                  </span>
                  <span className="scol-vals">
                    {isInstant ? (
                      <Val value={r.v.funded} />
                    ) : (
                      <>
                        <Val value={r.v.step1} />
                        {!isOne && <Val value={r.v.step2} />}
                        <Val value={r.v.funded} />
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* feature pills */}
            <div className="feat-pills">
              {['Weekend Holding', 'News Trading'].map((f) => (
                <div className="feat-pill" key={f}>
                  <span>{f}</span>
                  <span className="chk"><Check /></span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: pricing + payment methods */}
          <div className="buy reveal">
            <div>
              <div className="now">
                {price != null ? (
                  <>
                    <span className="gt">${price}</span>
                    <small><Editable id="programs.oneTime">{t.programs.oneTime}</Editable></small>
                  </>
                ) : (
                  <span className="gt">—</span>
                )}
              </div>
              <div className="pstep">{planLabel}</div>
            </div>
            {isAtomic && <div className="refund"><Editable id="programs.refund">{t.programs.refund}</Editable></div>}
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-p btn-lg" data-magnetic>
              Start Challenge →
            </a>

            <div className="pay-grid">
              {PAYMENTS.map((m) => (
                <div className="pay-tile" key={m.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.name} width={34} height={34} loading="lazy" />
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
