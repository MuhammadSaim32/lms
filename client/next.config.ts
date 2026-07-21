import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
};

export default nextConfig;
