import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // MAIN WEBSITE PAGES
      {
        source: "/((?!_next|api).*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },

      // BLOCK NEXT INTERNAL FILES
      {
        source: "/_next/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // BLOCK API ROUTES
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },

      // STATIC ASSETS
      {
        source:
          "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|css|js|woff|woff2|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.theoceangame.com",
        pathname: "/**",
      },
    ],

    deviceSizes: [640, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64],
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