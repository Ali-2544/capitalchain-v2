// Canonical external destinations for every CTA / social link on the site.
// Change a URL here and it updates everywhere it's used.
export const LINKS = {
  // Purchase / start a challenge.
  checkout: 'https://checkout.capitalchain.co/',
  // Login / sign-up / become a partner.
  getStarted: 'https://checkout.capitalchain.co/get-started/',

  // Community + social.
  discord: 'https://discord.com/invite/capitalchain',
  telegram: 'https://t.me/officialcapitalchain',
  telegramCommunity: 'https://t.me/capitalchain_community',
  youtube: 'https://www.youtube.com/@CapitalChainPropFirm',
  x: 'https://x.com/theCapitalChain',
  instagram: 'https://www.instagram.com/capital_chain/',
} as const;

// Spread onto an <a>/EditableLink that points off-site so it opens safely.
export const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;
