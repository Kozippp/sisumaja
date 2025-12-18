import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axcetvmpbzlpoosywmdp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
