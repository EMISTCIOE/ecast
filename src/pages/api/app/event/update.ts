import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

async function readBuffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'PUT') return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const slug = (req.headers['x-event-slug'] as string) || (req.query.slug as string);
  if (!slug) return res.status(400).json({ detail: 'slug required' });
  const body = await readBuffer(req);
  const r = await fetch(`${base}/api/event/events/${slug}/`, {
    method: req.method,
    headers: {
      'Authorization': (req.headers['authorization'] as string) || '',
      'Content-Type': (req.headers['content-type'] as string) || '',
      'Content-Length': String(body.length),
    },
    body,
  } as any);
  const data = await r.json();
  return res.status(r.status).json(data);
}

