'use client';

import { useCallback, useEffect, useState } from 'react';

interface Field {
  k: string;
  label: string;
  type?: 'number';
}
interface ResourceCfg {
  key: string;
  label: string;
  hint: string;
  fields: Field[];
}

const RESOURCES: ResourceCfg[] = [
  {
    key: 'payouts',
    label: 'Payouts',
    hint: 'One row = one payout. Feeds the globe, the Live Rewards feed, the leaderboard, and each payout’s certificate. Adding a payout here creates its certificate automatically.',
    fields: [
      { k: 'flag', label: 'Flag' },
      { k: 'country', label: 'Country' },
      { k: 'traderName', label: 'Trader name' },
      { k: 'amount', label: 'Payout amount' },
      { k: 'accountSize', label: 'Account size' },
      { k: 'method', label: 'Method' },
    ],
  },
];

type Row = Record<string, unknown> & { id?: number; __isNew?: boolean };

function ResourceManager({ cfg }: { cfg: ResourceCfg }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/${cfg.key}`, { cache: 'no-store' });
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }, [cfg.key]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (i: number, k: string, v: string) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const addRow = () => setRows((rs) => [{ __isNew: true }, ...rs]);

  const save = async (i: number) => {
    const row = rows[i];
    const body: Record<string, unknown> = {};
    for (const f of cfg.fields) body[f.k] = row[f.k] ?? '';
    setStatus('Saving…');
    const res = row.id
      ? await fetch(`/api/admin/${cfg.key}/${row.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch(`/api/admin/${cfg.key}`, {
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
    if (!confirm('Delete this row?')) return;
    await fetch(`/api/admin/${cfg.key}/${row.id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <div>
          <h3>{cfg.label}</h3>
          <p>{cfg.hint}</p>
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
              {cfg.fields.map((f) => (
                <th key={f.k}>{f.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? `new-${i}`}>
                {cfg.fields.map((f) => (
                  <td key={f.k}>
                    <input
                      className="adm-input"
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={String(row[f.k] ?? '')}
                      onChange={(e) => setField(i, f.k, e.target.value)}
                    />
                  </td>
                ))}
                <td className="adm-row-actions">
                  <button className="btn" onClick={() => save(i)}>Save</button>
                  {row.id ? (
                    <a className="btn" href={`/certificate/${row.id}`} target="_blank" rel="noreferrer">
                      🎫
                    </a>
                  ) : null}
                  <button className="btn adm-del" onClick={() => remove(i)}>✕</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={cfg.fields.length + 1} className="adm-empty">
                  No rows yet — click “Add”.
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

export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState(RESOURCES[0].key);

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

  const active = RESOURCES.find((r) => r.key === tab)!;

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <div className="adm-brand">
          Capital<b>Chain</b> <span>· Dashboard</span>
        </div>
        <nav className="adm-tabs">
          {RESOURCES.map((r) => (
            <button
              key={r.key}
              className={r.key === tab ? 'on' : undefined}
              onClick={() => setTab(r.key)}
            >
              {r.label}
            </button>
          ))}
        </nav>
        <button className="btn adm-logout" onClick={logout}>Logout</button>
      </header>
      <main className="adm-main">
        <ResourceManager cfg={active} key={active.key} />
      </main>
    </div>
  );
}
