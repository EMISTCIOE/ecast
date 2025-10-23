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
  const { id } = (req.query as any) as { id?: string };
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  // Forward Authorization header; fall back to x-access-token if needed
  let auth = (req.headers['authorization'] as string) || '';
  if (!auth) {
    const token = (req.headers['x-access-token'] as string) || '';
    if (token) auth = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  const body = await readBuffer(req);
  if (!req.headers['x-notice-id'] && !id) return res.status(400).json({ detail: 'id required' });
  const targetId = (req.headers['x-notice-id'] as string) || id as string;
  const r = await fetch(`${base}/api/notice/notices/${targetId}/`, {
    method: req.method,
    headers: {
      'Authorization': auth,
      'Content-Type': (req.headers['content-type'] as string) || '',
      'Content-Length': String(body.length),
    },
    body,
  } as any);
  const data = await r.json();
  res.status(r.status).json(data);
}
