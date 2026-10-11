import type { Metadata } from "next";
import "./globals.css";
import "./orbe.css";
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"], display: "swap" });
import { AppStateProvider } from "@/components/app-state";
import { AppShell } from "@/components/shell";
const brand = process.env.NEXT_PUBLIC_APP_NAME || "ORBE";
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), title: { default: `${brand} — descubre tu próximo lugar`, template: `%s | ${brand}` }, icons: { icon: "/brand/orbe-icon-light.svg", apple: "/brand/orbe-icon-light.svg" }, description: "Descubre, guarda, compara y conversa sobre propiedades en Lima. Una nueva forma de vivir el mercado inmobiliario.", openGraph: { title: `${brand} — descubre tu próximo lugar`, description: "Una ciudad inmobiliaria viva para Perú.", images: ["/images/orbe-urban-district.webp"] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es" className={geist.className} data-scroll-behavior="smooth"><body><AppStateProvider><AppShell>{children}</AppShell></AppStateProvider></body></html>; }
