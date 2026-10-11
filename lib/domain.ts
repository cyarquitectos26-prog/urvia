import type { Billboard, Property, Promotion, SearchIntent } from "@/types";
import { districts, properties } from "@/lib/data/mock";

export function money(value: number, currency: "USD" | "PEN") { return `${currency === "USD" ? "US$" : "S/"} ${new Intl.NumberFormat("es-PE").format(value)}`; }
export function compact(value: number) { return value >= 1000 ? `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}K` : String(value); }
export function propertyMatch(property: Property, intent: SearchIntent = { amenities: [] }): number {
  let score = 88;
  if (intent.district) score += property.location.district.toLowerCase() === intent.district.toLowerCase() ? 8 : -8;
  if (intent.type) score += property.type === intent.type ? 5 : -4;
  if (intent.operation) score += property.operation === intent.operation ? 3 : -6;
  if (intent.maxPrice && (!intent.currency || property.currency === intent.currency)) score += property.price <= intent.maxPrice ? 5 : -8;
  if (intent.bedrooms) score += property.bedrooms >= intent.bedrooms ? 3 : -4;
  score += intent.amenities.filter(a => property.amenities.some(p => p.toLowerCase() === a.toLowerCase())).length * 2;
  score += property.verified ? 3 : 0;
  score += property.score.total >= 90 ? 3 : 0;
  return Math.max(35, Math.min(99, score));
}
export function promotionScore(promotion: Promotion, property: Property, userMatch: number): number {
  const bid = Math.min(100, promotion.budget / Math.max(1, promotion.durationDays)) * 0.15;
  const relevance = userMatch * 0.35;
  const quality = property.score.total * 0.25;
  const engagement = Math.min(100, property.analytics.saves / 3) * 0.15;
  const freshness = property.updatedAt >= "2026-10-01" ? 10 : 4;
  return Math.round(bid + relevance + quality + engagement + freshness);
}
export function generateBillboardCreative(property: Property): Pick<Billboard, "title" | "subtitle" | "price" | "cta" | "image"> {
  return { title: "Tu próximo lugar puede estar aquí", subtitle: `${property.location.district} · ${property.area} m²`, price: money(property.price, property.currency), cta: "Descubrir", image: property.media[0].url };
}
export function priceInsight(property: Property) {
  const zone = properties.filter(p => p.location.district === property.location.district && p.type === property.type && p.operation === property.operation && p.currency === property.currency && p.id !== property.id);
  const average = zone.length ? zone.reduce((sum, p) => sum + p.price / p.area, 0) / zone.length : property.price / property.area;
  const publishedSqm = property.price / property.area;
  return { publishedSqm, zoneAverageSqm: average, low: Math.round(average * property.area * 0.8), high: Math.round(average * property.area * 1.1), label: publishedSqm < average * 0.8 ? "Buen precio" : publishedSqm <= average * 1.1 ? "Precio razonable" : "Por encima del promedio" };
}
export function parseSearch(query: string): SearchIntent {
  const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = normalize(query);
  const district = districts.find(d => q.includes(normalize(d.name)));
  const type = (["Casa", "Departamento", "Terreno", "Oficina", "Local", "Proyecto"] as const).find(t => q.includes(t.toLowerCase()));
  const priceMatch = q.match(/(?:us\$|s\/|\$)\s*([\d,.]+)\s*(mil|k)?/) || q.match(/(?:menos de|hasta|presupuesto de)\s*(?:us\$|s\/|\$)?\s*([\d,.]+)\s*(mil|k)?/);
  const raw = priceMatch ? Number(priceMatch[1].replace(/[,.](?=\d{3}\b)/g, "")) : undefined;
  const maxPrice = raw ? raw * (priceMatch?.[2] ? 1000 : 1) : undefined;
  const bedroomsMatch = q.match(/(\d+)\s*(?:dormitorio|dorm|habitaci)/);
  const bathroomsMatch = q.match(/(\d+)\s*(?:banos?|bath)/);
  const areaMatch = q.match(/(\d+)\s*m²/);
  const amenities = ["piscina", "jardín", "terraza", "pet friendly", "seguridad"].filter(a => q.includes(normalize(a)));
  return { operation: q.includes("alquil") ? "rent" : q.includes("compr") || q.includes("venta") ? "buy" : undefined, type, district: district?.name, currency: q.includes("us$") || q.includes("$") ? "USD" : q.includes("s/") ? "PEN" : undefined, maxPrice: maxPrice && maxPrice > 0 ? maxPrice : undefined, bedrooms: bedroomsMatch ? Number(bedroomsMatch[1]) : undefined, bathrooms: bathroomsMatch ? Number(bathroomsMatch[1]) : undefined, area: areaMatch ? Number(areaMatch[1]) : undefined, amenities };
}
export function filterProperties(intent: SearchIntent, items: Property[] = properties) { return items.filter(p => (!intent.operation || p.operation === intent.operation) && (!intent.type || p.type === intent.type) && (!intent.district || p.location.district === intent.district) && (!intent.currency || p.currency === intent.currency) && (!intent.maxPrice || p.price <= intent.maxPrice) && (!intent.minPrice || p.price >= intent.minPrice) && (!intent.bedrooms || p.bedrooms >= intent.bedrooms) && (!intent.bathrooms || p.bathrooms >= intent.bathrooms) && (!intent.area || p.area >= intent.area) && intent.amenities.every(a => p.amenities.some(x => x.toLowerCase() === a.toLowerCase()))); }
