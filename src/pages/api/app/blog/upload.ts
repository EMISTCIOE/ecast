import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  const authorization = req.headers["authorization"] || "";
  const r = await fetch(`${base}/api/blog/uploads/`, {
    method: "POST",
    headers: {
      Authorization: authorization as string,
      "Content-Type": (req.headers["content-type"] as string) || "",
    },
    duplex: "half",
    body: req as any,
  } as any);
  const data = await r.json();
  res.status(r.status).json(data);
}
