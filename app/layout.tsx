import { assetPath } from "@/lib/paths";
import type { Metadata } from "next";
import "./globals.css";
import "./urvia.css";
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"], display: "swap" });
import { AppStateProvider } from "@/components/app-state";
import { AppShell } from "@/components/shell";
const brand = process.env.NEXT_PUBLIC_APP_NAME || "URVIA";
const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").origin;
export const metadata: Metadata = { metadataBase: new URL(siteOrigin), applicationName: brand, title: { default: `${brand} — descubre tu próximo lugar`, template: `%s | ${brand}` }, icons: { icon: assetPath("/brand/urvia-icon-light.svg"), apple: assetPath("/brand/urvia-apple-touch-icon.png") }, description: "Descubre, guarda, compara y conversa sobre propiedades en Lima. Una nueva forma de vivir el mercado inmobiliario.", openGraph: { title: `${brand} — descubre tu próximo lugar`, description: "Una ciudad inmobiliaria viva para Perú.", images: [{url:assetPath("/brand/urvia-brand-identity.png"),width:1536,height:1024,alt:"Identidad corporativa URVIA"}] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es" className={geist.className} data-scroll-behavior="smooth"><body><AppStateProvider><AppShell>{children}</AppShell></AppStateProvider></body></html>; }
