// Refund Policy content — migrated from the old Capital Chain site.
// Each item's `html` is sanitized before rendering (see sanitizeHtml in lib/blogs).
import type { TermsItem } from '@/lib/terms';

export const REFUND_POLICY: TermsItem[] = [
  {
    id: 1,
    title: 'General Policy',
    html: "<p>Evaluation fees are generally non-refundable. However, we provide a refund pathway tied to performance in our evaluation programs as described below.</p>",
  },
  {
    id: 2,
    title: 'Refund Eligibility',
    html: "<ul> <li>Atomic Accounts (1-Step & 2-Step): Fee is refunded automatically upon the first successful Performance Reward withdrawal.</li> <li>Standard Accounts (1-Step & 2-Step): Fee is refunded automatically upon the third successful Performance Reward withdrawal.</li> <li>All accounts must remain in good standing with no rule violations.</li> </ul>",
  },
  {
    id: 3,
    title: 'Non-Refundable Cases',
    html: "<ul> <li>Breaches of trading rules or risk parameters.</li> <li>Unauthorized trading, platform abuse, or toxic flow behavior.</li> <li>Chargebacks or disputes initiated without contacting support.</li> </ul>",
  },
  {
    id: 4,
    title: 'Requesting Support',
    html: "<p>For billing questions, contact our support team. Provide your order ID, account email, and details of your request for the fastest resolution.</p>",
  },
  {
    id: 5,
    title: 'Contact',
    html: "<p>Capital Chain Group Ltd., Opal Tower, Bussiness Bay, Dubai</p> <p>Email: info@capitalchain.co</p>",
  },
];
