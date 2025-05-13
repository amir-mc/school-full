import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // مقدار پیش‌فرض یا سایز مورد نیاز شما
      allowedOrigins: [
        "localhost:3000",
        "185.24.253.55:3000",
        // سایر دامنه‌های مجاز
      ],
    },
  },
  // سایر تنظیمات...
};

export default nextConfig;