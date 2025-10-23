import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const qs = new URLSearchParams(req.query as any).toString();
  const auth = (req.headers['authorization'] as string) || '';
  const r = await fetch(`${base}/api/event/gallery/${qs ? `?${qs}` : ''}`, {
    headers: auth ? { 'Authorization': auth } : undefined
  });
  let data = await r.json();

  // Normalize image URL to absolute for Next/Image
  const absolutize = (u: any) => {
    if (typeof u === 'string' && u) {
      if (u.startsWith('http://') || u.startsWith('https://')) return u;
      if (u.startsWith('/')) return `${base}${u}`;
    }
    return u;
  };

  try {
    if (Array.isArray(data)) {
      data = data.map((x) => ({ ...x, image: absolutize(x?.image) }));
    } else if (data && Array.isArray((data as any).results)) {
      data = { ...data, results: (data as any).results.map((x: any) => ({ ...x, image: absolutize(x?.image) })) };
    }
  } catch {}

  res.status(r.status).json(data);
}
