import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, event_name } = req.query;

  // Check for missing parameters
  if (!name || !event_name) {
    return res.status(400).json({ error: "Missing name or event_name parameter" });
  }

  const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000';

  try {
    // Use the environment variable for the base URL
    const response = await fetch(`${apiUrl}/certificates/generate-certificate/?name=${name}&event_name=${event_name}`);

    // Parse the response
    if (!response.ok) {
      throw new Error("Failed to generate certificate from backend");
    }

    const data = await response.json();

    // Check if the URL exists in the response
    if (data.url) {
      return res.status(200).json({ url: data.url });
    } else {
      return res.status(500).json({ error: "Failed to generate certificate" });
    }
  } catch (error) {
    console.error("Error contacting the backend:", error);
    return res.status(500).json({ error: "Error contacting the backend" });
  }
}
