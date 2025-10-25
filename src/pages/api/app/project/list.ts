import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const qs = new URLSearchParams(req.query as any).toString();
  const auth =
    (req.headers["authorization"] as string) ||
    (req.headers["x-access-token"] as string) ||
    "";
  const r = await fetch(`${base}/api/project/projects/${qs ? `?${qs}` : ""}`, {
    headers: auth ? { Authorization: auth } : undefined,
  });
  const data = await r.json();
  res.status(r.status).json(data);
}
