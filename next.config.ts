import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "shotcan.com",
      },
      {
        protocol: "https",
        hostname: "app.svgator.com",
      },
      {
        protocol: "https",
        hostname: "cdn.svgator.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "ecast-backend.tcioe.edu.np",
      },
      {
        protocol: "http",
        hostname: "ecast-backend.tcioe.edu.np",
      },
    ],
  },
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;
