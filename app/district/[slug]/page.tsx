import { notFound } from "next/navigation";
import { districts, properties } from "@/lib/data/mock";
import { DistrictPageClient } from "@/components/district-page";
export function generateStaticParams() { return districts.map(d => ({ slug: d.slug })); }
export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const district = districts.find(d => d.slug === slug); if (!district) notFound(); return <DistrictPageClient district={district} properties={properties.filter(p => p.location.district === district.name)} />; }
