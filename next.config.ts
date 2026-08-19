import { dirname } from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const currentDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: currentDir,
  },
  typescript: {
    // ignoreBuildErrors: true, // ignore TypeScript errors during build
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
      // allow all images from Clerk avatars
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        port: "",
        pathname: "/**",
      },
      // allow Google & GitHub OAuth avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      // allow all remote images from the Vercel Blob domain
      {
        protocol: "https",
        hostname: "vercel.blob",
        port: "",
        pathname: "/**",
      },
      // allow all images from the Vercel Blob storage domain
      {
        protocol: "https",
        hostname: "vercel.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      // allow all images from any public vercel-storage domain
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bvchjdsex1t3pg17.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
