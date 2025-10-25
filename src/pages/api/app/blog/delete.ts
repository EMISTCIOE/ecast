import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return res.status(405).end();
  const { slug } = req.query as { slug?: string };
  const targetSlug = (req.headers["x-blog-slug"] as string) || slug;
  if (!targetSlug) return res.status(400).json({ detail: "slug required" });
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  let auth = (req.headers["authorization"] as string) || "";
  if (!auth) {
    const token = (req.headers["x-access-token"] as string) || "";
    if (token) auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  const r = await fetch(`${base}/api/blog/posts/${targetSlug}/`, {
    method: "DELETE",
    headers: { Authorization: auth },
  });
  res.status(r.status).end();
}
