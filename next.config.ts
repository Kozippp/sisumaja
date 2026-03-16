import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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

export default withNextIntl(nextConfig);
