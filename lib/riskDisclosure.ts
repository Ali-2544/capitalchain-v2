// Risk Disclosure content — migrated from the old Capital Chain site.
// Each item's `html` is sanitized before rendering (see sanitizeHtml in lib/blogs).
import type { TermsItem } from '@/lib/terms';

export const RISK_DISCLOSURE: TermsItem[] = [
  {
    id: 1,
    title: "General Risk Warning",
    html: "<p>Trading in financial markets involves substantial risk of loss and is not suitable for all investors. You may lose some or all of your initial investment. Past performance does not guarantee future results.</p>",
  },
  {
    id: 2,
    title: "Evaluation Nature",
    html: "<p>Our evaluation programs assess trading discipline and risk management on simulated environments. Results achieved during evaluations are not indicative of live trading results.</p>",
  },
  {
    id: 3,
    title: "Market Risks",
    html: "<ul> <li>Volatility and slippage during news or illiquid conditions.</li> <li>Platform outages, latency, and connectivity issues.</li> <li>Pricing discrepancies between different venues and feeds.</li> <li>Leverage magnifying both profits and losses.</li> </ul>",
  },
  {
    id: 4,
    title: "No Advice",
    html: "<p>Capital Chain does not provide investment, legal, or tax advice. Any educational content is for informational purposes only. You are solely responsible for your trading decisions.</p>",
  },
  {
    id: 5,
    title: "Responsibility",
    html: "<p>By participating in our programs, you acknowledge and accept all trading risks. Capital Chain is not liable for direct or indirect losses arising from the use of our services.</p>",
  },
  {
    id: 6,
    title: "Contact",
    html: "<p>Capital Chain Group Ltd., Opal Tower, Bussiness Bay, Dubai</p> <p>Email: support@capitalchain.co</p>",
  },
];
