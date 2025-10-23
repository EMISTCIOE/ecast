import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const slug = (req.headers['x-event-slug'] as string) || (req.query.slug as string);
  if (!slug) return res.status(400).json({ detail: 'slug required' });
  const r = await fetch(`${base}/api/event/events/${slug}/`, {
    method: 'DELETE',
    headers: { 'Authorization': (req.headers['authorization'] as string) || '' }
  });
  return res.status(r.status).end();
}

