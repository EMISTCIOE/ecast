import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const r = await fetch(`${base}/api/notice/notices/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers['authorization'] || ''
    },
    body: JSON.stringify(req.body)
  });
  const data = await r.json();
  res.status(r.status).json(data);
}

