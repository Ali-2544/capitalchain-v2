'use client';

import { useCallback, useEffect, useState } from 'react';
import { countryToFlag } from '@/lib/flags';
import BlogManager from '@/components/BlogManager';

type Row = Record<string, unknown> & { id?: number; __isNew?: boolean };

// Payouts: country drives the flag automatically (no manual emoji entry).
const PAYOUT_FIELDS: { k: string; label: string }[] = [
  { k: 'country', label: 'Country' },
  { k: 'traderName', label: 'Trader name' },
  { k: 'amount', label: 'Payout amount' },
  { k: 'accountSize', label: 'Account size' },
  { k: 'plan', label: 'Plan' },
  { k: 'method', label: 'Method' },
  { k: 'txUrl', label: 'Transaction link' },
];

function PayoutsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/payouts', { cache: 'no-store' });
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (i: number, k: string, v: string) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const addRow = () => setRows((rs) => [{ __isNew: true, method: 'USDT (TRC-20)' }, ...rs]);

  const save = async (i: number) => {
    const row = rows[i];
    const body: Record<string, unknown> = {};
    for (const f of PAYOUT_FIELDS) body[f.k] = row[f.k] ?? '';
    setStatus('Saving…');
    const res = row.id
      ? await fetch(`/api/admin/payouts/${row.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch('/api/admin/payouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
    setStatus(res.ok ? 'Saved ✓' : 'Error saving');
    await load();
    setTimeout(() => setStatus(''), 1500);
  };

  const remove = async (i: number) => {
    const row = rows[i];
    if (!row.id) {
      setRows((rs) => rs.filter((_, j) => j !== i));
      return;
    }
    if (!confirm('Delete this payout?')) return;
    await fetch(`/api/admin/payouts/${row.id}`, { method: 'DELETE' });
    await load();
  };

  // Live flag: prefer what the country resolves to, fall back to the stored flag.
  const flagFor = (row: Row) => countryToFlag(String(row.country ?? '')) || String(row.flag ?? '');

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <div>
          <h3>Payouts</h3>
          <p>
            One row = one payout. Feeds the globe, the Live Rewards feed, the leaderboard, and each
            payout’s certificate. The flag is set automatically from the country.
          </p>
        </div>
        <div className="adm-actions">
          {status && <span className="adm-status">{status}</span>}
          <button className="btn btn-p" onClick={addRow}>+ Add</button>
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Flag</th>
              {PAYOUT_FIELDS.map((f) => (
                <th key={f.k}>{f.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? `new-${i}`}>
                <td className="adm-flag-cell" title="Auto from country">
                  {flagFor(row) || '—'}
                </td>
                {PAYOUT_FIELDS.map((f) => (
                  <td key={f.k}>
                    <input
                      className="adm-input"
                      type="text"
                      value={String(row[f.k] ?? '')}
                      placeholder={
                        f.k === 'country'
                          ? 'e.g. United Arab Emirates'
                          : f.k === 'amount'
                            ? 'e.g. 2140 ($ added)'
                            : f.k === 'accountSize'
                              ? 'e.g. 100000 ($ added)'
                              : f.k === 'txUrl'
                                ? 'e.g. https://tronscan.org/#/transaction/…'
                                : ''
                      }
                      onChange={(e) => setField(i, f.k, e.target.value)}
                    />
                  </td>
                ))}
                <td className="adm-row-actions">
                  <button className="btn" onClick={() => save(i)}>Save</button>
                  {row.id ? (
                    <a className="btn" href={`/certificate/${row.id}`} target="_blank" rel="noreferrer" title="View certificate">
                      🎫
                    </a>
                  ) : null}
                  <button className="btn adm-del" onClick={() => remove(i)}>✕</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={PAYOUT_FIELDS.length + 2} className="adm-empty">
                  No payouts yet — click “Add”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoginForm({ onAuthed }: { onAuthed: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) onAuthed();
    else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || 'Login failed');
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <h1>Admin</h1>
        <p>Enter the admin password to manage live content.</p>
        <input
          className="adm-input"
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
        />
        {err && <div className="adm-err">{err}</div>}
        <button className="btn btn-p btn-lg" disabled={busy} type="submit">
          {busy ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function IconPayouts() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  );
}
function IconBlog() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 5h11M4 10h16M4 15h16M4 20h9" />
    </svg>
  );
}
const TABS = [
  { key: 'payouts', label: 'Payouts', icon: IconPayouts },
  { key: 'blog', label: 'Blog', icon: IconBlog },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabKey>('payouts');

  const check = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      const j = await res.json();
      setAuthed(Boolean(j.authed));
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  };

  if (authed === null) return <div className="adm-loading">Loading…</div>;
  if (!authed) return <LoginForm onAuthed={() => setAuthed(true)} />;

  return (
    <div className="adm-shell adm-shell-side">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          Capital<b>Chain</b>
          <span>Dashboard</span>
        </div>
        <nav className="adm-side-nav">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              type="button"
              className={tb.key === tab ? 'on' : undefined}
              onClick={() => setTab(tb.key)}
            >
              <tb.icon />
              <span>{tb.label}</span>
            </button>
          ))}
        </nav>
        <button type="button" className="btn adm-logout-side" onClick={logout}>
          Logout
        </button>
      </aside>
      <div className="adm-content">
        <main className="adm-main">
          {tab === 'payouts' && <PayoutsManager />}
          {tab === 'blog' && <BlogManager />}
        </main>
      </div>
    </div>
  );
}
