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
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  let auth = (req.headers['authorization'] as string) || '';
  // Fallback: some environments strip Authorization; allow x-access-token
  if (!auth) {
    const token = (req.headers['x-access-token'] as string) || '';
    if (token) auth = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  if (req.method === 'GET') {
    const qs = new URLSearchParams(req.query as any).toString();
    const r = await fetch(`${base}/api/auth/unified/${qs ? `?${qs}` : ''}`, {
      headers: { 'Authorization': auth }
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'POST') {
    const body = await readBuffer(req);
    const r = await fetch(`${base}/api/auth/unified/`, {
      method: 'POST',
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
  return res.status(405).end();
}
