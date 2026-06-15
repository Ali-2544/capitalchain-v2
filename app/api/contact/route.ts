import { NextResponse } from 'next/server';
import { getTransporter, contactRecipients } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// Human-readable labels for the inquiry <select> values.
const SUBJECT_LABELS: Record<string, string> = {
  support: 'General Support & Payouts',
  billing: 'Billing & Refund Policy',
  rules: 'Evaluation Rules & Violations',
  partnership: 'Affiliates & Partnerships',
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subjectKey = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();

  // Every required field must be present so nothing is missing from the email.
  if (!name || !email || !subjectKey || !message) {
    return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const subjectLabel = SUBJECT_LABELS[subjectKey] ?? subjectKey;
  const recipients = contactRecipients();
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No recipients configured.' }, { status: 500 });
  }

  const receivedAt = new Date().toISOString();

  // Plain-text + HTML body, both carrying every submitted field.
  const text = [
    'New contact form submission — CapitalChain',
    '',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Inquiry: ${subjectLabel} (${subjectKey})`,
    `Sent at: ${receivedAt}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0f172a;line-height:1.6">
      <h2 style="margin:0 0 16px">New contact form submission</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#64748b">Name</td><td style="padding:4px 0"><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#64748b">Inquiry</td><td style="padding:4px 0">${esc(subjectLabel)} <span style="color:#94a3b8">(${esc(subjectKey)})</span></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#64748b">Sent at</td><td style="padding:4px 0">${esc(receivedAt)}</td></tr>
      </table>
      <p style="margin:18px 0 6px;color:#64748b">Message</p>
      <div style="white-space:pre-wrap;padding:14px 16px;background:#f1f5f9;border-radius:10px">${esc(message)}</div>
    </div>`;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"CapitalChain Contact" <${process.env.SMTP_USER}>`,
      to: recipients,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact] ${subjectLabel} — ${name}`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form email failed:', err);
    return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 502 });
  }
}
