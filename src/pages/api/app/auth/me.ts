import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const r = await fetch(`${base}/api/auth/me/`, {
    headers: { Authorization: req.headers["authorization"] || "" },
  });
  const data = await r.json();
  res.status(r.status).json(data);
}
