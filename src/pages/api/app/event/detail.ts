import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  let auth = (req.headers["authorization"] as string) || "";
  if (!auth) {
    const token = (req.headers["x-access-token"] as string) || "";
    if (token) auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  try {
    const r = await fetch(
      `${base}/api/event/events/${encodeURIComponent(slug)}/`,
      {
        headers: auth ? { Authorization: auth } : {},
      }
    );

    if (!r.ok) {
      return res.status(r.status).json({ error: "Event not found" });
    }

    const data = await r.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event details" });
  }
}
