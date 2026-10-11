import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { canvas: "#101318", surface: "#22262b", signal: "#d3a676" } } }, plugins: [] };
export default config;
