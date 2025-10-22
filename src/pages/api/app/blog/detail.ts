import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string } as any;
  if (!slug) return res.status(400).json({ detail: 'slug required' });
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const r = await fetch(`${base}/api/blog/posts/${slug}/`);
  const data = await r.json();
  res.status(r.status).json(data);
}

