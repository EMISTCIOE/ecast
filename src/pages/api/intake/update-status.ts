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

    // Get auth token from request (same pattern as unified user API)
    let auth = (req.headers["authorization"] as string) || "";
    // Fallback: some environments strip Authorization; allow x-access-token
    if (!auth) {
      const token = (req.headers["x-access-token"] as string) || "";
      if (token) auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    if (!auth) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    // Prepare request body based on action
    let requestBody: any;

    if (is_open) {
      // When opening, we need to provide start_datetime
      // Use provided datetime or current time as fallback
      const startDateTime = start_datetime || new Date().toISOString();

      requestBody = {
        action: "open",
        start_datetime: startDateTime,
        create_new_batch: create_new_batch || false,
      };

      // Add optional parameters if provided
      if (end_datetime) {
        requestBody.end_datetime = end_datetime;
      }

      if (available_batches && Array.isArray(available_batches)) {
        requestBody.available_batches = available_batches;
      }
    } else {
      // When closing, just send close action
      requestBody = {
        action: "close",
      };
    }

    // Forward request to backend to update intake status
    const response = await fetch(`${base}/api/intake/toggle/`, {
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

    // Return consistent format with is_open boolean
    return res.status(200).json({
      is_open: is_open,
      message:
        data.message ||
        (is_open
          ? "Enrollment opened successfully"
          : "Enrollment closed successfully"),
      ...data,
    });
  } catch (error) {
    console.error("Error updating intake status:", error);
    return res.status(500).json({
      error: "Failed to update intake status",
    });
  }
}
