import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

async function readBuffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const url = `${base}/api/research/${slug}/`;
  const auth =
    (req.headers["authorization"] as string) ||
    (req.headers["x-access-token"] as string) ||
    "";

  // Check if this is FormData (file upload) or JSON
  const contentType = req.headers["content-type"] || "";
  const isFormData = contentType.includes("multipart/form-data");

  const headers: Record<string, string> = {};
  if (auth) {
    headers["Authorization"] = auth;
  }

  // For FormData, preserve the Content-Type with boundary
  if (isFormData) {
    headers["Content-Type"] = contentType;
  } else {
    headers["Content-Type"] = "application/json";
  }

  try {
    let body: any;
    if (isFormData) {
      // Read the raw body for FormData
      body = await readBuffer(req);
    } else {
      // Read and parse JSON body
      const rawBody = await readBuffer(req);
      body = rawBody.length > 0 ? rawBody.toString() : "{}";
    }

    const r = await fetch(url, {
      method: "PATCH",
      headers,
      body: isFormData ? body : body,
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    console.error("Research update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
