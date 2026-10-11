"use client";
import Link from "next/link";
import { useApp } from "@/components/app-state";
import { PropertyDetail } from "@/components/property-detail";
export function PublishedPropertyGate({ slug }: { slug: string }) { const { published } = useApp(); const property = published.find(p => p.slug === slug); return property ? <PropertyDetail property={property} /> : <div className="page-shell empty-state"><h1>Propiedad no encontrada</h1><p>La publicación puede no estar disponible en este navegador.</p><Link className="button primary" href="/explore">Explorar propiedades</Link></div>; }
