import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const r = await fetch(`${base}/api/notice/notices/`, {
    method: 'POST',
    // Pass through content-type with boundary and auth; set duplex for streaming body
    headers: {
      'Authorization': (req.headers['authorization'] as string) || '',
      'Content-Type': (req.headers['content-type'] as string) || '',
    },
    // @ts-expect-error duplex is required by Node.js when passing a ReadableStream body
    duplex: 'half',
    body: req as any,
  } as any);
  const data = await r.json();
  res.status(r.status).json(data);
}
export const config = {
  api: {
    bodyParser: false,
  },
};
