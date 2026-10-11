import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    ORBE_STATIC_EXPORT: "true",
    NEXT_PUBLIC_SITE_URL: process.env.ORBE_PAGES_URL || "https://cyarquitectos26-prog.github.io/",
  },
});
process.exit(result.status ?? 1);
