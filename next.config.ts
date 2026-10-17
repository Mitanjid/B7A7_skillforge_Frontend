import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.BACKEND_URL;
    return [
      { source: "/api/v1/:path*", destination: `${backend}/api/v1/:path*` },
      { source: "/api/health", destination: `${backend}/` },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
