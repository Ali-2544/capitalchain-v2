import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
  'info@capitalchain.co,bilal@capitalchain.co,mohammadkhan@capitalchain.co,engineer@capitalchain.co';

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

  // SMTP credentials come from .env — never hard-coded.
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.error('[contact] SMTP env vars missing (SMTP_HOST / SMTP_USER / SMTP_PASS)');
    return NextResponse.json({ error: 'Email is not configured on the server yet.' }, { status: 503 });
  }
  const port = Number(process.env.SMTP_PORT ?? 465);
  const to = process.env.CONTACT_TO || DEFAULT_TO;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implicit SSL, 587 = STARTTLS
    auth: { user, pass },
    // cPanel's local mail server often presents a hostname/self-signed cert
    // that doesn't match `localhost`; don't fail the handshake over it.
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.sendMail({
      from: `"Capital Chain Contact" <${user}>`,
      to,
      replyTo: email,
      subject: `[Contact – ${inquiry}] ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\nMessage:\n${message}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Inquiry:</strong> ${escapeHtml(inquiry)}</p>
        <hr/>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[contact] send failed', e);
    return NextResponse.json(
      { error: 'Could not send your message. Please try again later.' },
      { status: 502 },
    );
  }
}
