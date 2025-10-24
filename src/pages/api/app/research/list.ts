import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const qs = new URLSearchParams(req.query as any).toString();
  const url = `${base}/api/research/${qs ? `?${qs}` : ""}`;
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
    if (Array.isArray(data)) {
      data = data.map((x) => ({ ...x, document: absolutize(x?.document) }));
    } else if (data && Array.isArray((data as any).results)) {
      data = {
        ...data,
        results: (data as any).results.map((x: any) => ({
          ...x,
          document: absolutize(x?.document),
        })),
      };
    }
  } catch {}

  res.status(r.status).json(data);
}
