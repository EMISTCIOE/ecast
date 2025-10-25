import type { NextApiRequest, NextApiResponse } from "next";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, category, message } = req.body;

    // Validate required fields
    if (!name || !email || !category || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Forward the request to the backend
    const response = await fetch(`${base}/api/contact/form/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, category, message }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error: responseData.error || "Failed to submit contact form",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
}
