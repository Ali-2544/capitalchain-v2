import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify, sanitizeHtml, htmlToExcerpt } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

// List all posts (admin view — includes drafts). Body omitted to keep it light.
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const rows = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        author: true,
        coverAssetId: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }
}

interface BlogInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  author?: string;
  coverAssetId?: number | null;
  published?: boolean;
}

/** Find a slug that isn't already taken (excluding a given post id on edit). */
async function uniqueSlug(desired: string, excludeId?: number): Promise<string> {
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

// Create a post.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const input = (await req.json().catch(() => ({}))) as BlogInput;
  const title = (input.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

  const body = sanitizeHtml(input.body ?? '');
  const slug = await uniqueSlug(input.slug?.trim() || title);
  try {
    const created = await prisma.blog.create({
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
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }
}
