import path from 'path';
import type { NextConfig } from 'next';

// Add MDX support by using @next/mdx with custom config
const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'shotcan.com'], // External image domains
  },
  pageExtensions: ['ts', 'tsx', 'mdx'], // Add MDX file support as page extensions
  webpack(config) {
    // Add MDX loader to handle .mdx files
    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        {
          loader: '@mdx-js/loader', // Use MDX loader to process .mdx files
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
