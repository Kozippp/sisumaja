import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axcetvmpbzlpoosywmdp.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "i9.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
