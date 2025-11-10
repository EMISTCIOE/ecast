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
    const contentType = req.headers["content-type"] || "";

    const response = await fetch(`${base}/api/ambassador-intake/form/`, {
      method: "POST",
      headers: {
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body: req.body,
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = "Failed to submit form";
      if (responseData.error) {
        if (responseData.error.includes("email must make a unique set")) {
          errorMessage =
            "The email is already used. Please use a unique email.";
        } else if (responseData.error.includes("Enter a valid email address")) {
          errorMessage = "Please enter a valid email address";
        } else {
          errorMessage = responseData.error;
        }
      }
      return res.status(response.status).json({ error: errorMessage });
    }

    return res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error submitting ambassador intake form:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again.",
    });
  }
}

