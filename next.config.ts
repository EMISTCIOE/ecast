import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static export
  output: 'export',

  // Add trailing slashes to URLs for clean URLs
  trailingSlash: true,

  // Disable React strict mode (adjust as needed)
  reactStrictMode: false,

  // Configure external image sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'shotcan.com' },
      { protocol: 'https', hostname: 'app.svgator.com' },
      { protocol: 'https', hostname: 'cdn.svgator.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // Enable MDX as page extensions
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // Extend Webpack configuration
  webpack(config) {
    // Add MDX loader to handle .mdx files
    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        {
          loader: '@mdx-js/loader', // MDX loader
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
