import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: remove this when the issue is resolved
  eslint: {
    ignoreDuringBuilds: true, // ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // ignore TypeScript errors during build
  },
  /* config options here */
  images: {
    // allow all images from the Pexels domain
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
      // allow all images from the Unsplash domain
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**",
      },
      // allow all images from the Picsum domain
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
