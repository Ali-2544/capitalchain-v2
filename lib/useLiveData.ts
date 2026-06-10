'use client';

import { useEffect, useState } from 'react';

/**
 * Fetch a list from an API route and re-poll on an interval. Until the first
 * successful, non-empty response arrives, the provided `fallback` is returned —
 * so the UI always renders (even before the database is configured).
 */
export function useLiveData<T>(url: string, fallback: T[], intervalMs = 30_000): T[] {
  const [data, setData] = useState<T[]>(fallback);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (alive && Array.isArray(json) && json.length > 0) setData(json as T[]);
      } catch {
        /* keep current data on network error */
      }
    };
    load();
    const t = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [url, intervalMs]);

  return data;
}

/** "8m" / "3h" / "2d" relative-time label from an ISO timestamp. */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.floor(diff / 60_000));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
