'use client';

import { useState } from 'react';
import { useT } from '@/components/LanguageProvider';
import Editable from '@/components/Editable';

export default function ContactForm() {
  const t = useT().contactPage.form;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'support',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'support', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="tile feature" style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '24px', marginTop: 0, marginBottom: '24px' }}><Editable id="contactPage.form.title">{t.title}</Editable></h2>

      {status === 'success' ? (
        <div style={{ padding: '24px', border: '1px solid var(--green)', borderRadius: '14px', background: 'var(--soft)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--green)', fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '8px' }}><Editable id="contactPage.form.successTitle">{t.successTitle}</Editable></h2>
          <p style={{ color: 'var(--dim)', fontSize: '14.5px' }}>
            <Editable id="contactPage.form.successBody">{t.successBody}</Editable>
          </p>
          <button
            className="btn"
            style={{ marginTop: '20px' }}
            onClick={() => setStatus('idle')}
          >
            <Editable id="contactPage.form.another">{t.another}</Editable>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="name" style={{ fontFamily: 'var(--fm)', fontSize: '12px', color: 'var(--dim)', textTransform: 'uppercase' }}>
              <Editable id="contactPage.form.name">{t.name}</Editable>
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder={t.namePh}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                fontFamily: 'var(--fb)',
                fontSize: '15px',
                padding: '13px 18px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg-2)',
                color: 'var(--text)',
                width: '100%',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ fontFamily: 'var(--fm)', fontSize: '12px', color: 'var(--dim)', textTransform: 'uppercase' }}>
              <Editable id="contactPage.form.email">{t.email}</Editable>
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder={t.emailPh}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                fontFamily: 'var(--fb)',
                fontSize: '15px',
                padding: '13px 18px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg-2)',
                color: 'var(--text)',
                width: '100%',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="subject" style={{ fontFamily: 'var(--fm)', fontSize: '12px', color: 'var(--dim)', textTransform: 'uppercase' }}>
              <Editable id="contactPage.form.inquiry">{t.inquiry}</Editable>
            </label>
            <select
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{
                fontFamily: 'var(--fb)',
                fontSize: '15px',
                padding: '13px 18px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg-2)',
                color: 'var(--text)',
                width: '100%',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%2319E6D6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
            >
              <option value="support">{t.subjectSupport}</option>
              <option value="billing">{t.subjectBilling}</option>
              <option value="rules">{t.subjectRules}</option>
              <option value="partnership">{t.subjectPartnership}</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="message" style={{ fontFamily: 'var(--fm)', fontSize: '12px', color: 'var(--dim)', textTransform: 'uppercase' }}>
              <Editable id="contactPage.form.message">{t.message}</Editable>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              placeholder={t.messagePh}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{
                fontFamily: 'var(--fb)',
                fontSize: '15px',
                padding: '13px 18px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--bg-2)',
                color: 'var(--text)',
                width: '100%',
                outline: 'none',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
            />
          </div>

          {status === 'error' && (
            <p style={{ color: '#ff6b6b', fontSize: '14px', margin: 0 }}>
              Could not send your message. Please email support@capitalchain.co directly.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-p"
            style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', marginTop: '8px' }}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? (
              <Editable id="contactPage.form.sending">{t.sending}</Editable>
            ) : (
              <Editable id="contactPage.form.send">{t.send}</Editable>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
