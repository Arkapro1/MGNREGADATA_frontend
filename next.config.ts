import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Enable standalone build for Docker
  typescript: {
    // Don't fail on TypeScript errors during production builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
