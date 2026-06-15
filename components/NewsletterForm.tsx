'use client';

import { useState } from 'react';
import { useT } from './LanguageProvider';

const ENDPOINT = 'https://checkout.capitalchain.co/wp-json/capitalchain/v1/subscribers';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, status: 'active' }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        setStatus('success');
        setMessage(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        placeholder={t.footer.emailPlaceholder}
        aria-label="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== 'idle') setStatus('idle');
        }}
        disabled={status === 'loading'}
      />
      <button type="submit" className="btn btn-p" data-magnetic disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing…' : t.footer.subscribe}
      </button>
      {message && (
        <p
          className="news-status"
          role="status"
          style={{ color: status === 'error' ? 'var(--red, #e5484d)' : 'var(--green, #30a46c)' }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
