import type { Metadata } from "next";
import { properties } from "@/lib/data/mock";
import { money } from "@/lib/domain";
import { PropertyDetail } from "@/components/property-detail";
import { PublishedPropertyGate } from "@/components/published-property-gate";
export function generateStaticParams() { return properties.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const p = properties.find(x => x.slug === slug); return p ? { title: `${p.title} en ${p.location.district}`, description: `${money(p.price, p.currency)} · ${p.area} m² · ${p.bedrooms} dormitorios. Descubre esta propiedad en URVIA.`, openGraph: { images: [p.media[0].url] } } : { title: "Propiedad de la comunidad" }; }
export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const property = properties.find(p => p.slug === slug); return property ? <PropertyDetail property={property} /> : <PublishedPropertyGate slug={slug} />; }
