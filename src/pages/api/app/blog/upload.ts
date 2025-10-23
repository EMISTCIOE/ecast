import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

async function readBuffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  // Forward auth header; fall back to x-access-token if provided
  let authorization = (req.headers["authorization"] as string) || "";
  if (!authorization) {
    const token = (req.headers["x-access-token"] as string) || "";
    if (token) authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  const body = await readBuffer(req);
  const r = await fetch(`${base}/api/blog/uploads/`, {
    method: "POST",
    headers: {
      Authorization: authorization as string,
      "Content-Type": (req.headers["content-type"] as string) || "",
      "Content-Length": String(body.length),
    },
    body,
  } as any);
  const data = await r
    .json()
    .catch(() => ({ detail: "Upload response was not JSON" }));
  res.status(r.status).json(data);
}
