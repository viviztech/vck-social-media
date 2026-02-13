import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

const nextConfig: NextConfig = {
  // Static export ONLY for Capacitor mobile builds
  // Run: CAPACITOR_BUILD=true npm run build
  ...(isCapacitorBuild && { output: "export" }),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
