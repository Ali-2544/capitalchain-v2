'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Override {
  type: string;
  value: string;
}
type OverrideMap = Record<string, Override>; // "<locale>::<key>" -> override

interface EditTarget {
  id: string;
  value: string;
  kind: 'text' | 'link';
  href?: string;
}

interface ContentContextValue {
  overrides: OverrideMap;
  authed: boolean;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  /** Save (upsert) an override for the given key + locale, then refresh. */
  save: (key: string, locale: string, type: string, value: string) => Promise<boolean>;
  /** Reset an override back to the i18n fallback. */
  reset: (key: string, locale: string) => Promise<void>;
  /** The item currently being edited in the popover (null = closed). */
  editing: EditTarget | null;
  openEditor: (id: string, value: string) => void;
  /** Open the popover to edit a link's label + URL. */
  openLinkEditor: (id: string, value: string, href: string) => void;
  closeEditor: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [authed, setAuthed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState<EditTarget | null>(null);

  const openEditor = useCallback((id: string, value: string) => setEditing({ id, value, kind: 'text' }), []);
  const openLinkEditor = useCallback(
    (id: string, value: string, href: string) => setEditing({ id, value, href, kind: 'link' }),
    [],
  );
  const closeEditor = useCallback(() => setEditing(null), []);

  // When in edit mode, mark the body so scroll-reveal animations are forced
  // visible (sections re-mount and the reveal observer won't fire on them).
  // Also close any open editor when leaving edit mode.
  useEffect(() => {
    document.body.classList.toggle('cms-editing', editMode);
    if (!editMode) setEditing(null);
  }, [editMode]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) setOverrides(await res.json());
    } catch {
      /* keep current overrides */
    }
  }, []);

  const checkAuth = useCallback(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setAuthed(Boolean(j.authed)))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    refresh();
    checkAuth();
    // Re-check when returning to the tab — so logging in at /admin in another tab
    // makes the Edit button appear here without a manual refresh.
    const onFocus = () => checkAuth();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refresh, checkAuth]);

  const save = useCallback(
    async (key: string, locale: string, type: string, value: string) => {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, locale, type, value }),
      });
      if (res.ok) {
        // Optimistically update so the edit shows immediately.
        setOverrides((m) => ({ ...m, [`${locale}::${key}`]: { type, value } }));
        return true;
      }
      return false;
    },
    [],
  );

  const reset = useCallback(async (key: string, locale: string) => {
    await fetch(`/api/admin/content?key=${encodeURIComponent(key)}&locale=${locale}`, {
      method: 'DELETE',
    });
    setOverrides((m) => {
      const next = { ...m };
      delete next[`${locale}::${key}`];
      return next;
    });
  }, []);

  return (
    <ContentContext.Provider
      value={{ overrides, authed, editMode, setEditMode, save, reset, editing, openEditor, openLinkEditor, closeEditor }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}
