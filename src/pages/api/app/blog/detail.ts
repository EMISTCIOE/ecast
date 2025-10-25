import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query as { slug: string } as any;
  if (!slug) return res.status(400).json({ detail: "slug required" });
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const r = await fetch(`${base}/api/blog/posts/${slug}/`);
  const data = await r.json();

  // Ensure cover_image is absolute for public rendering
  const absolutize = (u: any) => {
    if (typeof u === "string" && u) {
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      if (u.startsWith("/")) return `${base}${u}`;
    }
    return u;
  };

  const normalized = {
    ...data,
    cover_image: absolutize((data as any)?.cover_image),
  };
  res.status(r.status).json(normalized);
}
