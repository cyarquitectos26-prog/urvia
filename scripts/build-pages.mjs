import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    URVIA_STATIC_EXPORT: "true",
    NEXT_PUBLIC_APP_NAME: "URVIA",
    NEXT_PUBLIC_SITE_URL: process.env.URVIA_PAGES_URL || "https://cyarquitectos26-prog.github.io/urvia/",
  },
});
process.exit(result.status ?? 1);
