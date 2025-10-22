import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

async function readBuffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const auth = (req.headers['authorization'] as string) || '';
  if (req.method === 'GET') {
    const r = await fetch(`${base}/api/auth/me/profile/`, { headers: { 'Authorization': auth } });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'PATCH') {
    const body = await readBuffer(req);
    const r = await fetch(`${base}/api/auth/me/profile/`, {
      method: 'PATCH',
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
