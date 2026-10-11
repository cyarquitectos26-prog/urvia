import type { NextConfig } from "next";
const staticExport = process.env.ORBE_STATIC_EXPORT === "true";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: staticExport ? "export" : undefined,
  trailingSlash: staticExport,
  images: { unoptimized: staticExport },
  env: { NEXT_PUBLIC_STATIC_EXPORT: String(staticExport) },
};
export default nextConfig;
