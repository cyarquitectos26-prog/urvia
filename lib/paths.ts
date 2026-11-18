/** Next prefixes navigation links; browser-loaded media need the same prefix explicitly. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetPath(src: string): string;
export function assetPath(src: string | undefined): string | undefined;
export function assetPath(src: string | undefined): string | undefined {
  if (!src || !src.startsWith("/") || src.startsWith("//") || !basePath || src === basePath || src.startsWith(`${basePath}/`)) return src;
  return `${basePath}${src}`;
}

export function appPathname(path: string): string {
  const local = basePath && (path === basePath || path.startsWith(`${basePath}/`)) ? path.slice(basePath.length) : path;
  return local.replace(/\/$/, "") || "/";
}
