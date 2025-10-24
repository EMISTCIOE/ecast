import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
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

  // For JSON requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const r = await fetch(url, {
    method: "PATCH",
    headers,
    body: isFormData ? req.body : JSON.stringify(req.body),
  });

  let data = await r.json();
  res.status(r.status).json(data);
}
