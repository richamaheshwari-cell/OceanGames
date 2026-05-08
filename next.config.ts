import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|css|js|woff|woff2|ttf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/**" },
      { protocol: "https", hostname: "**", pathname: "/**" },
    ],
  },

  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL;
    if (!backend) return [];

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
