import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const supabaseHostname = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  turbopack: {
    root: __dirname
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.3brothers.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.metub.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bvbjxazsvtvmgpdvtfrf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      ...(supabaseHostname
        ? [{
            protocol: 'https',
            hostname: supabaseHostname,
            pathname: '/storage/v1/object/public/**',
          }]
        : []),
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: [
          '**/.git/**',
          '**/.next/**',
          '**/node_modules/**',
          '**/.chrome-profile/**',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
