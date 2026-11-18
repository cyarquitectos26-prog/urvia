import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { canvas: "#0F0F0F", surface: "#22262b", signal: "#D4B286" } } }, plugins: [] };
export default config;
