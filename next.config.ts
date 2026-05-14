import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Enable gzip/brotli compression
  compress: true,

  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
