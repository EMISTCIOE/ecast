import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const url = `${base}/api/research/${slug}/`;
  const auth =
    (req.headers["authorization"] as string) ||
    (req.headers["x-access-token"] as string) ||
    "";

  const r = await fetch(url, {
    method: "DELETE",
    headers: auth ? { Authorization: auth } : {},
  });

  if (r.status === 204) {
    return res.status(204).end();
  }

  let data = await r.json();
  res.status(r.status).json(data);
}
