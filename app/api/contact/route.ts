import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ContactInput {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Inquiry <select> values → readable labels used in the email subject line.
const SUBJECTS: Record<string, string> = {
  support: 'General Support & Payouts',
  billing: 'Billing',
  rules: 'Trading Rules',
  partnership: 'Partnership',
};

// Where submissions land. Override with CONTACT_TO="a@x.com,b@x.com" in .env.
const DEFAULT_TO =
  'support@capitalchain.co,bilal@capitalchain.co,mohammadkhan@capitalchain.co,engineer@capitalchain.co';

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );
}

export async function POST(req: Request) {
  const input = (await req.json().catch(() => ({}))) as ContactInput;
  const name = (input.name ?? '').trim();
  const email = (input.email ?? '').trim();
  const message = (input.message ?? '').trim();
  const inquiry = SUBJECTS[input.subject ?? ''] ?? 'General';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Mailgun credentials come from .env — never hard-coded.
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) {
    console.error('[contact] MAILGUN_API_KEY / MAILGUN_DOMAIN not set');
    return NextResponse.json({ error: 'Email is not configured on the server yet.' }, { status: 503 });
  }
  // US region by default. For an EU Mailgun account set
  // MAILGUN_BASE=https://api.eu.mailgun.net in .env.
  const base = process.env.MAILGUN_BASE || 'https://api.mailgun.net';
  const from = process.env.MAILGUN_FROM || `Capital Chain Contact <postmaster@${domain}>`;
  const to = process.env.CONTACT_TO || DEFAULT_TO;

  const form = new URLSearchParams();
  form.append('from', from);
  to.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((addr) => form.append('to', addr));
  form.append('h:Reply-To', email);
  form.append('subject', `[Contact – ${inquiry}] ${name}`);
  form.append('text', `Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\nMessage:\n${message}`);
  form.append(
    'html',
    `<h2>New contact form submission</h2>` +
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
      `<p><strong>Inquiry:</strong> ${escapeHtml(inquiry)}</p>` +
      `<hr/><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
  );

  try {
    const res = await fetch(`${base}/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[contact] mailgun error', res.status, detail);
      return NextResponse.json(
        { error: 'Could not send your message. Please try again later.' },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[contact] send failed', e);
    return NextResponse.json(
      { error: 'Could not send your message. Please try again later.' },
      { status: 502 },
    );
  }
}
