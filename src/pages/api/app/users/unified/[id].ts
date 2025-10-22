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
  const { id } = req.query as { id: string };
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  let auth = (req.headers['authorization'] as string) || '';
  if (!auth) {
    const token = (req.headers['x-access-token'] as string) || '';
    if (token) auth = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  if (!id) return res.status(400).json({ detail: 'id required' });

  if (req.method === 'GET') {
    const r = await fetch(`${base}/api/auth/unified/${id}/`, { headers: { 'Authorization': auth } });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const body = await readBuffer(req);
    const r = await fetch(`${base}/api/auth/unified/${id}/`, {
      method: req.method,
      headers: {
        'Authorization': auth,
        'Content-Type': (req.headers['content-type'] as string) || '',
        'Content-Length': String(body.length),
      },
      body,
    } as any);
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'DELETE') {
    const r = await fetch(`${base}/api/auth/unified/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': auth }
    });
    return res.status(r.status).end();
  }
  return res.status(405).end();
}
