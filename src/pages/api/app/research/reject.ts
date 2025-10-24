import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const url = `${base}/api/research/${slug}/reject/`;
  const auth =
    (req.headers["authorization"] as string) ||
    (req.headers["x-access-token"] as string) ||
    "";

  const r = await fetch(url, {
    method: "POST",
    headers: auth ? { Authorization: auth } : {},
  });

  let data = await r.json();
  res.status(r.status).json(data);
}
