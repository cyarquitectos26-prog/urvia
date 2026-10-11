import { propertyHref } from "@/lib/property-link";
import { agents, districts, posts, properties, videos } from "@/lib/data/mock";
import { money, propertyMatch } from "@/lib/domain";
import type { BillboardVariant, Promotion, Property, SearchIntent } from "@/types";

export type CityQuality = "auto" | "low" | "medium" | "high";
export type CityZone = "central-avenue" | "luxury-district" | "project-district" | "land-district" | "creator-district" | "investment-district";
export type CityScreenSize = "mega" | "wide" | "corner" | "video";
export type CityAdProduct = "featured_screen" | "mega_billboard" | "video_billboard" | "corner_screen" | "district_sponsor" | "project_launch" | "agent_spotlight" | "city_takeover";
export interface CitySeason { id: string; title: string; startsAt: string; endsAt: string; focusDistrict?: string; focusType?: Property["type"] }
export interface CityTakeover { id: string; sponsorId: string; seasonId: string; screenIds: string[]; organicMinimum: number }
export interface CityBillboardPlacement {
  id: string;
  cityZone: CityZone;
  building: string;
  facade: "street";
  screenId: string;
  size: CityScreenSize;
  visibilityScore: number;
  orientation: "toward-avenue";
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number];
}
export interface CityStory {
  id: string;
  type: BillboardVariant | "video";
  classification: "editorial" | "algorithmic" | "sponsored" | "trending" | "local";
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  price?: string;
  propertyId?: string;
  agentId?: string;
  promotionId?: string;
  videoId?: string;
  videoSrc?: string;
  searchText?: string;
}
export interface CityScreen { placement: CityBillboardPlacement; story: CityStory }

const rowDepths = [0, -28, -56, -84, -112, -140, -168];
export const cityPlacements: CityBillboardPlacement[] = rowDepths.flatMap((z, row) => {
  const side = row % 2 === 0 ? -1 : 1;
  const base = row * 3;
  return [
    { screenId: `A${String(base + 1).padStart(2, "0")}`, building: `tower-${row * 2 + 1}`, position: [row === 0 ? -13.2 : -5.65, row === 0 ? 12.5 : 10.5 + row % 3, row === 0 ? 0.2 : z - 7], rotation: [0, row === 0 ? 0 : Math.PI / 3, 0], dimensions: row === 0 ? [10, 11] : [8.2, 7.2], size: "mega" as const, visibilityScore: 98 - row * 4 },
    { screenId: `A${String(base + 2).padStart(2, "0")}`, building: `tower-${row * 2 + 2}`, position: [row === 0 ? 13.2 : 5.65, row === 0 ? 10.8 : 10.4 + row % 3, row === 0 ? 0.2 : z - 7], rotation: [0, row === 0 ? 0 : -Math.PI / 3, 0], dimensions: row === 0 ? [9.8, 6.8] : [7.8, 6.4], size: "wide" as const, visibilityScore: 94 - row * 4 },
    { screenId: `A${String(base + 3).padStart(2, "0")}`, building: row === 0 ? "avenue-gate" : `tower-${row * 2 + (side < 0 ? 1 : 2)}`, position: row === 0 ? [0, 12, -13] : [side * 6.1, 17.5 + row % 3, z - 12], rotation: [0, row === 0 ? 0 : -side * Math.PI / 3, 0], dimensions: row === 0 ? [13.5, 5.8] : [5.9, row === 1 || row === 4 ? 7.8 : 3.8], size: row === 1 || row === 4 ? "video" as const : "corner" as const, visibilityScore: 86 - row * 4 },
  ].map((screen): CityBillboardPlacement => ({ ...screen, position: screen.position as [number, number, number], dimensions: screen.dimensions as [number, number], rotation: screen.rotation as [number, number, number], id: `city-main-${screen.screenId.slice(1).padStart(3, "0")}`, cityZone: "central-avenue", facade: "street", orientation: "toward-avenue" }));
});

export const sponsoredScreenIds = ["A01", "A07", "A12", "A16", "A19"];
export const cityAdvertisingInventory: { product: CityAdProduct; screenIds: string[]; availability: "demo" | "future" }[] = [
  { product: "mega_billboard", screenIds: ["A01", "A07"], availability: "demo" },
  { product: "featured_screen", screenIds: ["A12", "A16", "A19"], availability: "demo" },
  { product: "video_billboard", screenIds: ["A06", "A15"], availability: "future" },
  { product: "corner_screen", screenIds: ["A03", "A09"], availability: "future" },
  { product: "district_sponsor", screenIds: [], availability: "future" },
  { product: "project_launch", screenIds: [], availability: "future" },
  { product: "agent_spotlight", screenIds: [], availability: "future" },
  { product: "city_takeover", screenIds: [], availability: "future" },
];

function propertyStory(property: Property, kicker = "DESCUBRE UN LUGAR"): CityStory {
  return { id: `story-${property.id}`, type: property.type === "Proyecto" ? "project" : "property", classification: "algorithmic", kicker, title: property.title, subtitle: `${property.location.district} · ${property.area} m²`, image: property.id === "prop-01" ? "/images/la-molina-hero.webp" : property.media[0]?.url || "/images/la-molina-hero.webp", price: money(property.price, property.currency), href: propertyHref(property), propertyId: property.id, searchText: `${property.type} ${property.location.district} ${property.amenities.join(" ")}` };
}

function seedStories(sorted: Property[]): CityStory[] {
  const pick = (i: number) => sorted[i % sorted.length];
  const project = sorted.find(p => p.type === "Proyecto") || pick(2);
  const districtStory = (i: number): CityStory => { const d = districts[i]; return { id: `district-${d.id}`, type: "district", classification: "trending", kicker: "EN TENDENCIA", title: d.name, subtitle: `${d.inventory} propiedades · ↑ ${d.priceChange}% interés`, image: d.image, href: `/district/${d.slug}` }; };
  const agentStory = (i: number): CityStory => { const a = agents[i]; return { id: `agent-${a.id}`, type: "agent", classification: "editorial", kicker: "AGENTE DESTACADO", title: a.name, subtitle: `${new Intl.NumberFormat("es-PE").format(a.followers)} seguidores · ${a.specialties[0]}`, image: properties[i + 3].media[0].url, href: `/agent/${a.username}`, agentId: a.id }; };
  const videoStory = (i: number): CityStory => { const v = videos[i]; const property = properties.find(p => p.id === v.propertyId); return { id: `video-${v.id}`, type: "video", classification: "editorial", kicker: "REEL · SIN AUDIO", title: v.title, subtitle: `${v.duration} · ${property?.location.district || "Lima"}`, image: i === 0 ? "/images/la-molina-hero.webp" : v.cover, href: "/videos", videoId: v.id, videoSrc: i === 0 ? "/videos/la-molina-loop.mp4" : "/videos/barranco-loop.mp4", propertyId: v.propertyId }; };
  const editorialStory = (i: number): CityStory => { const p = posts[i]; return { id: `editorial-${p.id}`, type: "editorial", classification: "editorial", kicker: "IDEAS ORBE", title: p.body, subtitle: "Historias para vivir mejor", image: p.image || "/images/property-4.jpg", href: "/explore" }; };
  return [
    { ...propertyStory(pick(0), "CASA DEL DÍA"), classification: "sponsored" }, districtStory(0), agentStory(0),
    propertyStory(pick(1)), propertyStory(project, "NUEVO PROYECTO"), videoStory(0),
    propertyStory(pick(3), "LUGARES QUE INSPIRAN"), districtStory(4), propertyStory(pick(7)),
    propertyStory(pick(4)), agentStory(1), propertyStory(pick(5), "PRECIO BAJÓ"),
    propertyStory(pick(6)), editorialStory(0), videoStory(1),
    propertyStory(pick(8), "SELECCIONADO PARA TI"), { ...districtStory(6), type: "trend", kicker: "TRENDING #1" }, agentStory(2),
    propertyStory(pick(9)), editorialStory(1), propertyStory(pick(10)),
  ];
}

export function resolveCityPromotionPlacements(campaigns: Promotion[]): Map<string, Promotion> {
  const activeCityPromotions = campaigns.filter(p => p.status === "active" && p.placement === "city_premium");
  const occupied = new Set<string>();
  const promotionsByScreen = new Map<string, Promotion>();
  for (const promotion of activeCityPromotions) {
    const id = promotion.cityScreenId && sponsoredScreenIds.includes(promotion.cityScreenId) && !occupied.has(promotion.cityScreenId)
      ? promotion.cityScreenId : sponsoredScreenIds.find(screen => !occupied.has(screen));
    if (id) { occupied.add(id); promotionsByScreen.set(id, promotion); }
  }
  return promotionsByScreen;
}

export function buildCityScreens(allProperties: Property[], campaigns: Promotion[], preferences: SearchIntent): CityScreen[] {
  const sorted = [...allProperties].sort((a, b) => propertyMatch(b, preferences) - propertyMatch(a, preferences));
  const seeded = seedStories(sorted);
  const promotionsByScreen = resolveCityPromotionPlacements(campaigns);
  return cityPlacements.map((placement, i) => {
    const promotion = promotionsByScreen.get(placement.screenId);
    const property = promotion && allProperties.find(p => p.id === promotion.contentId);
    const story = property && promotion ? { ...propertyStory(property, "PATROCINADO"), classification: "sponsored" as const, promotionId: promotion.id } : seeded[i];
    return { placement, story };
  });
}

export function findCityScreen(query: string, screens: CityScreen[]) {
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\b(casas|terrenos|departamentos|proyectos)\b/g, word => word.slice(0, -1));
  const q = normalize(query.trim());
  if (!q) return undefined;
  const byId = screens.find(s => s.placement.screenId.toLowerCase() === q);
  if (byId) return byId;
  const words = q.split(/\s+/).filter(word => !["en", "de", "del", "para", "con", "un", "una"].includes(word));
  return words.length ? screens.find(({ story }) => { const text = normalize([story.title, story.subtitle, story.kicker, story.searchText || ""].join(" ")); return words.every(word => text.includes(word)); }) : undefined;
}
