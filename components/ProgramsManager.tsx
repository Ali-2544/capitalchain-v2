'use client';

import { useCallback, useEffect, useState } from 'react';

type Row = Record<string, unknown> & { id?: number; __isNew?: boolean };

// k = field key, label = header, type = optional column type, ph = placeholder hint
const FIELDS: { k: string; label: string; type?: 'number'; ph?: string }[] = [
  { k: 'programType', label: 'Type key', ph: 'e.g. standard, atomic, 1step' },
  { k: 'typeLabel', label: 'Tab label', ph: 'e.g. Standard' },
  { k: 'typeOrder', label: 'Tab order', type: 'number' },
  { k: 'size', label: 'Size' },
  { k: 'sizeOrder', label: 'Order', type: 'number' },
  { k: 'fee', label: 'Fee', type: 'number' },
  { k: 'was', label: 'Was', type: 'number' },
  { k: 'target', label: 'Target' },
  { k: 'drawdown', label: 'Drawdown' },
  { k: 'dailyLoss', label: 'Daily loss' },
  { k: 'profitSplit', label: 'Split' },
  { k: 'minDays', label: 'Min days' },
  { k: 'timeLimit', label: 'Time limit' },
  { k: 'newsEas', label: 'News & EAs' },
  { k: 'payouts', label: 'Payouts' },
];

export default function ProgramsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/programs', { cache: 'no-store' });
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (i: number, k: string, v: string) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const addRow = () =>
    setRows((rs) => [
      {
        __isNew: true,
        programType: '',
        typeLabel: '',
        typeOrder: 0,
        profitSplit: '100%',
        minDays: 'None',
        timeLimit: 'Unlimited',
        newsEas: 'Allowed',
        payouts: '4 cycles',
      },
      ...rs,
    ]);

  const save = async (i: number) => {
    const row = rows[i];
    const body: Record<string, unknown> = {};
    for (const f of FIELDS) body[f.k] = row[f.k] ?? '';
    setStatus('Saving…');
    const res = row.id
      ? await fetch(`/api/admin/programs/${row.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch('/api/admin/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
    if (res.ok) {
      setStatus('Saved ✓');
      await load();
      setTimeout(() => setStatus(''), 1500);
    } else {
      const j = await res.json().catch(() => ({}));
      setStatus(j.error || 'Error saving');
    }
  };

  const remove = async (i: number) => {
    const row = rows[i];
    if (!row.id) {
      setRows((rs) => rs.filter((_, j) => j !== i));
      return;
    }
    if (!confirm('Delete this plan?')) return;
    await fetch(`/api/admin/programs/${row.id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <div>
          <h3>Programs</h3>
          <p>
            One row = one account size within a program type. Drives the “Configure your funded
            account” section — tabs, size pills, the spec list and the pricing card. To add a new
            program tab (e.g. Standard, Atomic), give its rows the same <b>Type key</b> + <b>Tab
            label</b>; <b>Tab order</b> sets the left-to-right tab position.
          </p>
        </div>
        <div className="adm-actions">
          {status && <span className="adm-status">{status}</span>}
          <button type="button" className="btn btn-p" onClick={addRow}>+ Add</button>
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table adm-table-wide">
          <thead>
            <tr>
              {FIELDS.map((f) => (
                <th key={f.k}>{f.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? `new-${i}`}>
                {FIELDS.map((f) => (
                  <td key={f.k}>
                    <input
                      className="adm-input"
                      type={f.type === 'number' ? 'number' : 'text'}
                      placeholder={f.ph ?? ''}
                      value={String(row[f.k] ?? '')}
                      onChange={(e) => setField(i, f.k, e.target.value)}
                    />
                  </td>
                ))}
                <td className="adm-row-actions">
                  <button type="button" className="btn" onClick={() => save(i)}>Save</button>
                  <button type="button" className="btn adm-del" onClick={() => remove(i)}>✕</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={FIELDS.length + 1} className="adm-empty">
                  No plans yet — click “Add”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
