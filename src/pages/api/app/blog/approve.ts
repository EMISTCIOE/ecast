import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { slug } = req.body as { slug: string };
  if (!slug) return res.status(400).json({ detail: 'slug required' });
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  let auth = (req.headers['authorization'] as string) || '';
  if (!auth) {
    const token = (req.headers['x-access-token'] as string) || '';
    if (token) auth = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  const r = await fetch(`${base}/api/blog/posts/${slug}/approve/`, {
    method: 'POST',
    headers: { 'Authorization': auth }
  });
  const data = await r.json().catch(()=>({}));
  res.status(r.status).json(data);
}
