import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  if (req.method === 'GET') {
    const qs = new URLSearchParams(req.query as any).toString();
    const r = await fetch(`${base}/api/tasks/tasks/${qs ? `?${qs}` : ''}`, {
      headers: { 'Authorization': req.headers['authorization'] || '' }
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === 'POST') {
    const r = await fetch(`${base}/api/tasks/tasks/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': req.headers['authorization'] || '' },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  return res.status(405).end();
}

