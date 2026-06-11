import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify, sanitizeHtml, htmlToExcerpt } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

interface BlogInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  author?: string;
  coverAssetId?: number | null;
  published?: boolean;
}

async function uniqueSlug(desired: string, excludeId: number): Promise<string> {
  const base = slugify(desired);
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await prisma.blog.findUnique({ where: { slug } });
    if (!clash || clash.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

// Full single post (admin edit — includes the HTML body).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const post = await prisma.blog.findUnique({ where: { id: Number(id) } }).catch(() => null);
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(post);
}

// Update a post.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  const input = (await req.json().catch(() => ({}))) as BlogInput;
  const title = (input.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

  const body = sanitizeHtml(input.body ?? '');
  const slug = await uniqueSlug(input.slug?.trim() || title, numId);
  try {
    const updated = await prisma.blog.update({
      where: { id: numId },
      data: {
        title,
        slug,
        body,
        excerpt: (input.excerpt ?? '').trim() || htmlToExcerpt(body),
        author: (input.author ?? '').trim() || 'Capital Chain',
        coverAssetId: input.coverAssetId ?? null,
        published: Boolean(input.published),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Could not update (not found or DB unreachable).' }, { status: 503 });
  }
}

// Delete a post.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.blog.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not delete.' }, { status: 503 });
  }
}
