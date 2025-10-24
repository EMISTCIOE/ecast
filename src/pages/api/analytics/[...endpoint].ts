/**
 * Enhanced Umami API Proxy
 * Handles all Umami API endpoints with proper authentication and error handling
 */

import type { NextApiRequest, NextApiResponse } from "next";

const RAW_UMAMI_BASE_URL = process.env.UMAMI_BASE_URL || "https://api.umami.is";
const UMAMI_API_TOKEN = process.env.UMAMI_API_TOKEN;

interface ErrorResponse {
  error: string;
  details?: any;
}

/**
 * Main API handler - routes requests to appropriate Umami endpoints
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET and POST methods
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract path from query
  const { endpoint, ...queryParams } = req.query as Record<string, string>;

  // Validate API credentials
  if (!UMAMI_API_TOKEN) {
    return res.status(500).json({
      error: "Server configuration error: Missing Umami API token",
    });
  }

  try {
    // Normalise base URL and determine correct API prefix
    const base = (RAW_UMAMI_BASE_URL || "").replace(/\/$/, "");
    const isCloud = /(^|\.)api\.umami\.is$/i.test(
      new URL(base).hostname
    );
    const apiBase = `${base}${isCloud ? "/v1" : "/api"}`;

    // Build the Umami API URL
    const umamiEndpoint = endpoint
      ? `/${Array.isArray(endpoint) ? endpoint.join("/") : endpoint}`
      : "";
    const queryString = buildQueryString(queryParams);
    const url = `${apiBase}${umamiEndpoint}${queryString}`;

    // Prepare request headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(isCloud
        ? { "x-umami-api-key": UMAMI_API_TOKEN }
        : { Authorization: `Bearer ${UMAMI_API_TOKEN}` }),
    };

    // Prepare request options
    const options: RequestInit = {
      method: req.method,
      headers,
    };

    // Add body for POST requests
    if (req.method === "POST" && req.body) {
      options.body = JSON.stringify(req.body);
    }

    // Make request to Umami API
    const response = await fetch(url, options);

    // Handle error responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Umami API Error (${response.status}):`, errorText);

      return res.status(response.status).json({
        error: `Umami API returned ${response.status}`,
        details: errorText,
      });
    }

    // Parse and return successful response
    const data = await response.json();

    // Add cache headers for GET requests
    if (req.method === "GET") {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=120"
      );
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Umami proxy error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Helper function to build query string from parameters
 */
function buildQueryString(params: Record<string, string | string[]>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
