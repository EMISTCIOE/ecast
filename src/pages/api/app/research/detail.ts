import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const url = `${base}/api/research/${slug}/`;
  const auth =
    (req.headers["authorization"] as string) ||
    (req.headers["x-access-token"] as string) ||
    "";
  const r = await fetch(url, {
    headers: auth ? { Authorization: auth } : undefined,
  });
  let data = await r.json();

  // Normalize media URLs to absolute
  const absolutize = (u: any) => {
    if (typeof u === "string" && u) {
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      if (u.startsWith("/")) return `${base}${u}`;
    }
    return u;
  };

  try {
    if (data && typeof data === "object") {
      data = { ...data, document: absolutize(data?.document) };
    }
  } catch {}

  res.status(r.status).json(data);
}
