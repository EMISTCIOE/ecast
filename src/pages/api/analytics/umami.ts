import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { websiteId, startAt, endAt } = req.query as Record<string, string>;

  if (!websiteId || !startAt || !endAt) {
    return res.status(400).json({
      error: "Missing required parameters: websiteId, startAt, endAt",
    });
  }

  try {
    const rawBaseUrl = process.env.UMAMI_BASE_URL;
    const token = process.env.UMAMI_API_TOKEN;

    if (!rawBaseUrl || !token) {
      return res.status(500).json({
        error: "Server configuration error: Missing Umami credentials",
      });
    }

    // Normalise base URL and determine correct API prefix
    const base = rawBaseUrl.replace(/\/$/, "");
    const isCloud = /(^|\.)api\.umami\.is$/i.test(new URL(base).hostname);
    const apiBase = `${base}${isCloud ? "/v1" : "/api"}`;

    const headers = (isCloud
      ? { "x-umami-api-key": token }
      : { Authorization: `Bearer ${token}` }) as Record<string, string>;

    // Fetch summary stats
    const r = await fetch(
      `${apiBase}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    if (!r.ok) {
      return res.status(r.status).json({ error: await r.text() });
    }
    const summary = await r.json();

    // Fetch countries data
    const rc = await fetch(
      `${apiBase}/websites/${websiteId}/metrics?type=country&startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    const countries = await rc.json();

    // Fetch pages data
    const rp = await fetch(
      `${apiBase}/websites/${websiteId}/metrics?type=path&startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    const pages = await rp.json();

    // Fetch referrers data
    const rr = await fetch(
      `${apiBase}/websites/${websiteId}/metrics?type=referrer&startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    const referrers = await rr.json();

    // Fetch browsers data
    const rb = await fetch(
      `${apiBase}/websites/${websiteId}/metrics?type=browser&startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    const browsers = await rb.json();

    // Fetch OS data
    const ro = await fetch(
      `${apiBase}/websites/${websiteId}/metrics?type=os&startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    const os = await ro.json();

    // Fetch devices data
    const rd = await fetch(
      `${apiBase}/websites/${websiteId}/metrics?type=device&startAt=${startAt}&endAt=${endAt}`,
      { headers }
    );
    const devices = await rd.json();

    // Transform data to match ChartCard format
    const transformMetrics = (metrics: any[]) => {
      if (!Array.isArray(metrics)) return [];
      return metrics.map((item) => ({
        x: item.x || item.name || item.value || "Unknown",
        y: item.y || item.visits || item.pageviews || item.value || 0,
      }));
    };

    res.json({
      summary,
      countries: transformMetrics(countries),
      pages: transformMetrics(pages),
      referrers: transformMetrics(referrers),
      browsers: transformMetrics(browsers),
      os: transformMetrics(os),
      devices: transformMetrics(devices),
    });
  } catch (error) {
    console.error("Umami API error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
}
