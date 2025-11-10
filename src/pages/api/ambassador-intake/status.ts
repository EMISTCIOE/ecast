import type { NextApiRequest, NextApiResponse } from "next";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(`${base}/api/ambassador-intake/status/`);
    if (!response.ok) {
      throw new Error("Failed to fetch ambassador intake status");
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching ambassador intake status:", error);
    return res.status(500).json({
      error: "Failed to fetch ambassador intake status",
      is_open: false,
      message:
        "Unable to fetch ambassador enrollment status. Please try again later.",
    });
  }
}

