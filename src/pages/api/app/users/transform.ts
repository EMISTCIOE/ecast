import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const r = await fetch(`${base}/api/auth/transform/`, {
    method: "POST",
    headers: {
      Authorization: (req.headers["authorization"] as string) || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  const data = await r.json().catch(() => ({}));
  res.status(r.status).json(data);
}
