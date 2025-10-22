import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

async function readBuffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'PUT') return res.status(405).end();
  const { id } = req.query as { id?: string };
  const targetId = (req.headers['x-gallery-id'] as string) || id;
  if (!targetId) return res.status(400).json({ detail: 'id required' });
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const body = await readBuffer(req);
  const r = await fetch(`${base}/api/event/gallery/${targetId}/`, {
    method: req.method,
    headers: {
      'Authorization': (req.headers['authorization'] as string) || '',
      'Content-Type': (req.headers['content-type'] as string) || '',
      'Content-Length': String(body.length),
    },
    body,
  } as any);
  const data = await r.json();
  res.status(r.status).json(data);
}

