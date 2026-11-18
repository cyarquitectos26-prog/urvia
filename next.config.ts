import type { NextConfig } from "next";
const staticExport = process.env.URVIA_STATIC_EXPORT === "true";
const basePath = staticExport ? "/urvia" : "";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  basePath,
  output: staticExport ? "export" : undefined,
  trailingSlash: staticExport,
  images: { unoptimized: staticExport },
  env: { NEXT_PUBLIC_STATIC_EXPORT: String(staticExport), NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
