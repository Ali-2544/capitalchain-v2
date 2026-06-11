import { prisma } from '@/lib/prisma';

// Serve an image stored in the database. Public + immutable (asset bytes never
// change once uploaded), so it caches aggressively.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.asset
    .findUnique({ where: { id: Number(id) } })
    .catch(() => null);
  if (!asset) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(asset.data), {
    headers: {
      'Content-Type': asset.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
