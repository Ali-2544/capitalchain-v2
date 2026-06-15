import nodemailer from 'nodemailer';

// Single shared SMTP transport, built from env. Reused across requests.
let transporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS missing).');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true', // true => 465, false => 587/STARTTLS
    auth: { user, pass },
    // The server is addressed by IP, so its TLS cert won't match a hostname.
    tls: { rejectUnauthorized: false },
  });

  return transporter;
}

// Comma-separated CONTACT_TO -> trimmed list of recipients.
export function contactRecipients(): string[] {
  return (process.env.CONTACT_TO || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
