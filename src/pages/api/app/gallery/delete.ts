import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return res.status(405).end();
  const { id } = req.query as { id?: string };
  const targetId = (req.headers["x-gallery-id"] as string) || id;
  if (!targetId) return res.status(400).json({ detail: "id required" });
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  let auth = (req.headers["authorization"] as string) || "";
  if (!auth) {
    const token = (req.headers["x-access-token"] as string) || "";
    if (token) auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  const r = await fetch(`${base}/api/event/gallery/${targetId}/`, {
    method: "DELETE",
    headers: { Authorization: auth },
  });
  res.status(r.status).end();
}
