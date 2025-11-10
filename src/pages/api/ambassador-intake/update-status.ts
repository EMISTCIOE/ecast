import type { NextApiRequest, NextApiResponse } from "next";
import { authedFetch } from "@/lib/apiClient";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      is_open,
      start_datetime,
      end_datetime,
      create_new_batch,
      available_batches,
    } = req.body;

    if (typeof is_open !== "boolean") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    let auth = (req.headers["authorization"] as string) || "";
    if (!auth) {
      const token = (req.headers["x-access-token"] as string) || "";
      if (token) auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    if (!auth) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    let requestBody: any;
    if (is_open) {
      const startDateTime = start_datetime || new Date().toISOString();
      requestBody = {
        action: "open",
        start_datetime: startDateTime,
        create_new_batch: create_new_batch || false,
      };
      if (end_datetime) requestBody.end_datetime = end_datetime;
      if (available_batches && Array.isArray(available_batches)) {
        requestBody.available_batches = available_batches;
      }
    } else {
      requestBody = { action: "close" };
    }

    const response = await fetch(`${base}/api/ambassador-intake/toggle/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to update status" }));
      console.error("Backend error:", errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();

    return res.status(200).json({
      is_open: is_open,
      message:
        data.message ||
        (is_open
          ? "Ambassador enrollment opened successfully"
          : "Ambassador enrollment closed successfully"),
      ...data,
    });
  } catch (error) {
    console.error("Error updating ambassador intake status:", error);
    return res.status(500).json({
      error: "Failed to update ambassador intake status",
    });
  }
}

