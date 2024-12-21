import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static export
  output: 'export',

  // Optional: Add trailing slashes for clean URLs
  trailingSlash: true,

  // Disable React strict mode if unnecessary
  reactStrictMode: false,

  // Disable image optimization for static export
  images: {
    unoptimized: true, // Disable image optimization
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'shotcan.com' },
      { protocol: 'https', hostname: 'app.svgator.com' },
      { protocol: 'https', hostname: 'cdn.svgator.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // Add MDX file support as page extensions
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // Extend Webpack configuration to handle MDX files
  webpack(config) {
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
