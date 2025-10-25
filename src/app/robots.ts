import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecast.tcioe.edu.np";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/me",
          "/me/*",
          "/login",
          "/account",
          "/account/*",
          "/api/*",
          "/dashboard",
          "/dashboard/*",
          "/reset-password",
          "/reset-password/*",
          "/unsubscribe/*",
          "/_next/*",
          "/static/*",
        ],
        crawlDelay: 0,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/me",
          "/me/*",
          "/login",
          "/account/*",
          "/api/*",
          "/dashboard/*",
          "/reset-password/*",
          "/unsubscribe/*",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/me",
          "/me/*",
          "/login",
          "/account/*",
          "/api/*",
          "/dashboard/*",
          "/reset-password/*",
          "/unsubscribe/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
