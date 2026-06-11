'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

interface BlogListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  coverAssetId: number | null;
  published: boolean;
  updatedAt: string;
}

interface Draft {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  body: string;
  coverAssetId: number | null;
  published: boolean;
}

const EMPTY: Draft = {
  title: '',
  slug: '',
  excerpt: '',
  author: 'Capital Chain',
  body: '',
  coverAssetId: null,
  published: false,
};

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editKey, setEditKey] = useState(0); // forces the editor to re-init on post switch
  const [status, setStatus] = useState('');
  const coverRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/blogs', { cache: 'no-store' });
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setDraft({ ...EMPTY });
    setEditKey((k) => k + 1);
  };

  const openEdit = async (id: number) => {
    const res = await fetch(`/api/admin/blogs/${id}`, { cache: 'no-store' });
    if (!res.ok) return;
    const p = await res.json();
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      author: p.author,
      body: p.body,
      coverAssetId: p.coverAssetId,
      published: p.published,
    });
    setEditKey((k) => k + 1);
  };

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const uploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    const resp = await fetch('/api/admin/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
    if (!resp.ok) {
      const j = await resp.json().catch(() => ({}));
      alert(j.error || 'Cover upload failed');
      return;
    }
    const { id } = await resp.json();
    set('coverAssetId', id);
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      setStatus('Title is required');
      return;
    }
    setStatus('Saving…');
    const res = draft.id
      ? await fetch(`/api/admin/blogs/${draft.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        })
      : await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });
    if (res.ok) {
      setStatus('Saved ✓');
      await load();
      const saved = await res.json();
      setDraft((d) => (d ? { ...d, id: saved.id, slug: saved.slug } : d));
      setTimeout(() => setStatus(''), 1500);
    } else {
      const j = await res.json().catch(() => ({}));
      setStatus(j.error || 'Error saving');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
    if (draft?.id === id) setDraft(null);
    await load();
  };

  // ---- Editor view ----
  if (draft) {
    return (
      <div className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h3>{draft.id ? 'Edit post' : 'New post'}</h3>
            <p>Write the post, add a cover and inline images, then publish when ready.</p>
          </div>
          <div className="adm-actions">
            {status && <span className="adm-status">{status}</span>}
            <button className="btn" onClick={() => setDraft(null)}>← Back</button>
            <button className="btn btn-p" onClick={save}>Save</button>
          </div>
        </div>

        <div className="blog-form">
          <label className="blog-field">
            <span>Title</span>
            <input className="adm-input" value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="Post title" />
          </label>

          <div className="blog-row">
            <label className="blog-field">
              <span>Slug (URL)</span>
              <input className="adm-input" value={draft.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated from title" />
            </label>
            <label className="blog-field">
              <span>Author</span>
              <input className="adm-input" value={draft.author} onChange={(e) => set('author', e.target.value)} />
            </label>
          </div>

          <label className="blog-field">
            <span>Excerpt (optional — listing summary)</span>
            <textarea className="adm-input" rows={2} value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary shown on the blog index" />
          </label>

          <div className="blog-field">
            <span>Cover image</span>
            <div className="blog-cover">
              {draft.coverAssetId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/api/assets/${draft.coverAssetId}`} alt="cover" className="blog-cover-img" />
              ) : (
                <div className="blog-cover-empty">No cover yet</div>
              )}
              <div className="blog-cover-actions">
                <button className="btn" onClick={() => coverRef.current?.click()}>Upload cover</button>
                {draft.coverAssetId && (
                  <button className="btn adm-del" onClick={() => set('coverAssetId', null)}>Remove</button>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" hidden onChange={uploadCover} />
            </div>
          </div>

          <div className="blog-field">
            <span>Body</span>
            <RichTextEditor value={draft.body} resetKey={editKey} onChange={(html) => set('body', html)} />
          </div>

          <label className="blog-switch">
            <input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} />
            <span>Published {draft.published ? '— live on the site' : '— draft (hidden)'}</span>
          </label>
        </div>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <div>
          <h3>Blog</h3>
          <p>Write and publish posts. Published posts appear at <code>/blog</code>; drafts stay hidden.</p>
        </div>
        <div className="adm-actions">
          <button className="btn btn-p" onClick={openNew}>+ New post</button>
        </div>
      </div>

      <div className="blog-list">
        {loading && <div className="adm-empty">Loading…</div>}
        {!loading && posts.length === 0 && <div className="adm-empty">No posts yet — click “New post”.</div>}
        {posts.map((p) => (
          <div className="blog-card" key={p.id}>
            <div className="blog-card-cover">
              {p.coverAssetId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/api/assets/${p.coverAssetId}`} alt="" />
              ) : (
                <span className="blog-card-noimg">No cover</span>
              )}
            </div>
            <div className="blog-card-main">
              <div className="blog-card-top">
                <h4>{p.title}</h4>
                <span className={`blog-badge ${p.published ? 'on' : ''}`}>{p.published ? 'Published' : 'Draft'}</span>
              </div>
              <p className="blog-card-excerpt">{p.excerpt || '—'}</p>
              <div className="blog-card-meta">
                <span>{p.author}</span>
                <span>·</span>
                <span>/{p.slug}</span>
              </div>
            </div>
            <div className="blog-card-actions">
              <button className="btn" onClick={() => openEdit(p.id)}>Edit</button>
              {p.published && (
                <a className="btn" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">View</a>
              )}
              <button className="btn adm-del" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
