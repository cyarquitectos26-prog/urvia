import type { Agent, Billboard, Campaign, Collection, Conversation, District, Message, Notification, Post, Promotion, Property, PropertyType, VideoPost } from "@/types";

export const agents: Agent[] = [
  { id: "mariana", name: "Mariana Torres", username: "marianainmuebles", avatar: "https://i.pravatar.cc/160?img=47", verified: true, rating: 4.9, followers: 12400, specialties: ["La Molina", "Surco", "Pachacámac"], bio: "Encuentro espacios que se sienten como un nuevo comienzo. Especialista en casas y terrenos al este de Lima." },
  { id: "diego", name: "Diego Salazar", username: "diegovive", avatar: "https://i.pravatar.cc/160?img=12", verified: true, rating: 4.8, followers: 8200, specialties: ["Miraflores", "Barranco"], bio: "Arquitectura, vida urbana y departamentos con carácter." },
  { id: "valeria", name: "Valeria Rojas", username: "valeriaprop", avatar: "https://i.pravatar.cc/160?img=44", verified: true, rating: 4.9, followers: 6300, specialties: ["San Isidro", "San Borja"], bio: "Te acompaño a tomar decisiones inmobiliarias con información clara." },
  { id: "andres", name: "Andrés Paredes", username: "andresinversiones", avatar: "https://i.pravatar.cc/160?img=14", verified: false, rating: 4.7, followers: 4700, specialties: ["Pachacámac", "Cieneguilla"], bio: "Terrenos e inversiones con potencial real." }
  ,{ id: "demo-agent", name: "Tu perfil", username: "tu-perfil", avatar: "https://i.pravatar.cc/160?img=13", verified: false, rating: 0, followers: 0, specialties: ["Lima"], bio: "Aquí aparecerán tus publicaciones de demostración." }
];

export const districts: District[] = [
  ["La Molina", 1240, 184, 3.2, 1], ["Miraflores", 980, 246, 4.2, 2], ["San Isidro", 870, 210, 2.6, 3], ["Surco", 743, 192, 3.8, 4], ["Barranco", 712, 86, 5.1, 5], ["San Borja", 680, 131, 2.9, 6], ["Pachacámac", 592, 75, 6.4, 7], ["Cieneguilla", 488, 62, 4.7, 8], ["Magdalena", 451, 110, 2.2, 3], ["Jesús María", 423, 96, 2.5, 4], ["Lince", 390, 79, 1.8, 5]
].map(([name, searches, inventory, priceChange, image]) => ({ id: String(name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-"), name: String(name), slug: String(name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-"), searches: Number(searches), inventory: Number(inventory), priceChange: Number(priceChange), image: `/images/property-${image}.jpg` }));

type Seed = [string, string, PropertyType, number, "USD" | "PEN", number, number, number, number, number, "buy" | "rent"];
const seeds: Seed[] = [
  ["Casa contemporánea con vista a la ciudad", "La Molina", "Casa", 395000, "USD", 340, 4, 3, 3, 0, "buy"],
  ["Departamento de autor frente al malecón", "Miraflores", "Departamento", 320000, "USD", 145, 3, 3, 2, 1, "buy"],
  ["Penthouse luminoso en zona financiera", "San Isidro", "Departamento", 450000, "USD", 190, 3, 3, 2, 2, "buy"],
  ["Casa de jardín y doble altura", "Surco", "Casa", 520000, "USD", 410, 4, 4, 3, 3, "buy"],
  ["Loft artístico a pasos del puente", "Barranco", "Departamento", 258000, "USD", 112, 2, 2, 1, 4, "buy"],
  ["Departamento familiar junto al pentagonito", "San Borja", "Departamento", 295000, "USD", 152, 3, 2, 2, 5, "buy"],
  ["Terreno con vista al valle", "Pachacámac", "Terreno", 185000, "USD", 1200, 0, 0, 0, 6, "buy"],
  ["Casa de campo entre árboles", "Cieneguilla", "Casa", 385000, "USD", 540, 4, 4, 4, 7, "buy"],
  ["Dúplex moderno cerca del mar", "Magdalena", "Departamento", 245000, "USD", 132, 3, 2, 1, 1, "buy"],
  ["Departamento práctico con terraza", "Jesús María", "Departamento", 780000, "PEN", 105, 3, 2, 1, 2, "buy"],
  ["Estudio urbano para empezar", "Lince", "Departamento", 395000, "PEN", 54, 1, 1, 0, 3, "buy"],
  ["Casa con piscina y patio interior", "La Molina", "Casa", 850000, "USD", 610, 5, 5, 4, 0, "buy"],
  ["Departamento boutique en Reducto", "Miraflores", "Departamento", 5200, "PEN", 118, 2, 2, 1, 4, "rent"],
  ["Oficina flexible con vista al golf", "San Isidro", "Oficina", 6900, "PEN", 140, 0, 2, 2, 2, "rent"],
  ["Casa familiar cerca de colegios", "Surco", "Casa", 12500, "PEN", 330, 4, 3, 2, 3, "rent"],
  ["Loft industrial en zona creativa", "Barranco", "Departamento", 4300, "PEN", 96, 1, 1, 1, 4, "rent"],
  ["Proyecto Alameda del Parque", "San Borja", "Proyecto", 890000, "PEN", 120, 3, 2, 2, 5, "buy"],
  ["Lote residencial con acceso privado", "Pachacámac", "Terreno", 118000, "USD", 800, 0, 0, 0, 6, "buy"],
  ["Casa de campo para fines de semana", "Cieneguilla", "Casa", 6800, "PEN", 460, 4, 3, 3, 7, "rent"],
  ["Departamento con cocina abierta", "Magdalena", "Departamento", 780000, "PEN", 110, 3, 2, 1, 1, "buy"],
  ["Flat con luz natural y balcón", "Jesús María", "Departamento", 3250, "PEN", 86, 2, 2, 1, 2, "rent"],
  ["Local comercial en avenida principal", "Lince", "Local", 7100, "PEN", 130, 0, 2, 0, 3, "rent"],
  ["Residencia con terraza panorámica", "La Molina", "Casa", 640000, "USD", 480, 4, 4, 3, 0, "buy"],
  ["Departamento frente al parque", "Miraflores", "Departamento", 285000, "USD", 128, 2, 2, 1, 1, "buy"],
  ["Suite ejecutiva amoblada", "San Isidro", "Departamento", 4600, "PEN", 78, 1, 1, 1, 2, "rent"],
  ["Casa de diseño en Las Casuarinas", "Surco", "Casa", 1100000, "USD", 720, 5, 5, 4, 3, "buy"],
  ["Dúplex cerca de galerías", "Barranco", "Departamento", 349000, "USD", 155, 3, 3, 2, 4, "buy"],
  ["Departamento de estreno con rooftop", "San Borja", "Departamento", 915000, "PEN", 126, 3, 2, 2, 5, "buy"],
  ["Terreno agrícola con proyección", "Pachacámac", "Terreno", 248000, "USD", 1800, 0, 0, 0, 6, "buy"],
  ["Casa abierta al jardín", "Cieneguilla", "Casa", 425000, "USD", 570, 4, 4, 3, 7, "buy"]
];
const coords: Record<string, [number, number]> = { "La Molina": [-12.086, -76.94], Miraflores: [-12.121, -77.03], "San Isidro": [-12.097, -77.035], Surco: [-12.14, -76.99], Barranco: [-12.149, -77.02], "San Borja": [-12.105, -77.0], "Pachacámac": [-12.225, -76.865], Cieneguilla: [-12.095, -76.77], Magdalena: [-12.092, -77.07], "Jesús María": [-12.071, -77.05], Lince: [-12.085, -77.03] };
export function districtCenter(district: string): [number, number] { return coords[district] || [-12.09, -77.01]; }
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const properties: Property[] = seeds.map(([title, district, type, price, currency, area, bedrooms, bathrooms, parking, image, operation], index) => {
  const [lat, lng] = coords[district];
  const id = `prop-${String(index + 1).padStart(2, "0")}`;
  const firstImage = index === 0 ? "/images/la-molina-hero.png" : `/images/property-${image + 1}.jpg`;
  return {
    id, slug: `${slugify(title)}-${index + 1}`, title, description: `${title} en ${district}. Un espacio cuidadosamente seleccionado para vivir Lima a tu manera. Distribución funcional, luz natural y acceso cómodo a los principales servicios de la zona. Agenda una visita y descubre todos sus detalles.`, operation, type, price, currency, area, bedrooms, bathrooms, parking,
    location: { district, city: "Lima", address: `${district}, Lima`, lat: lat + (index % 4) * 0.002, lng: lng + (index % 3) * 0.002 },
    amenities: type === "Terreno" ? ["Vista al valle", "Acceso vehicular", "Servicios cercanos"] : ["Terraza", "Seguridad", ...(index % 3 === 0 ? ["Piscina", "Jardín"] : []), ...(index % 2 === 0 ? ["Pet friendly"] : [])],
    media: [{ id: `${id}-1`, url: firstImage, type: "image", alt: `${title} en ${district}` }, { id: `${id}-2`, url: `/images/property-${(image + 2) % 8 + 1}.jpg`, type: "image", alt: `Ambiente de ${title}` }, { id: `${id}-3`, url: `/images/property-${(image + 4) % 8 + 1}.jpg`, type: "image", alt: `Detalle de ${title}` }],
    agentId: agents[index % agents.length].id, status: "available", verified: index === 0 || index % 5 !== 0, featured: index < 3, publishedAt: "2026-09-18", updatedAt: "2026-10-03",
    priceHistory: [{ date: "Jun", price: Math.round(price * 1.09), currency }, { date: "Ago", price: Math.round(price * 1.05), currency }, { date: "Oct", price, currency }],
    analytics: { views: 125 + index * 33, saves: 42 + index * 7, shares: 12 + index * 3, chats: 8 + index, visits: 3 + index % 10 },
    score: { total: 96 - index % 12, photos: 95, description: 92, price: 88, location: 98, documentation: 91, response: 96 }
  };
});

export const posts: Post[] = [
  { id: "post-1", authorId: "mariana", body: "5 detalles de diseño que hacen que una casa se sienta realmente tuya.", image: "/images/property-4.jpg", likes: 342, comments: 28, createdAt: "2026-10-04" },
  { id: "post-2", authorId: "diego", body: "Barranco por dentro: espacios que conectan con la ciudad.", image: "/images/property-5.jpg", likes: 218, comments: 19, createdAt: "2026-10-03" }
];
export const videos: VideoPost[] = [
  { id: "video-1", authorId: "mariana", propertyId: "prop-01", title: "La Molina en 45 segundos", cover: "/images/la-molina-hero.png", likes: 1100, comments: 94, duration: "0:45" },
  { id: "video-2", authorId: "diego", propertyId: "prop-05", title: "Un loft con alma en Barranco", cover: "/images/property-5.jpg", likes: 846, comments: 61, duration: "0:32" },
  { id: "video-3", authorId: "valeria", propertyId: "prop-03", title: "Vista abierta en San Isidro", cover: "/images/property-3.jpg", likes: 670, comments: 38, duration: "0:38" }
];
export const initialCollections: Collection[] = [
  { id: "col-favorites", name: "Casas favoritas", ownerId: "demo", items: [{ propertyId: "prop-01", addedAt: "2026-10-04" }, { propertyId: "prop-04", addedAt: "2026-10-03" }] },
  { id: "col-visit", name: "Para visitar", ownerId: "demo", items: [{ propertyId: "prop-02", addedAt: "2026-10-03" }] },
  { id: "col-invest", name: "Inversiones", ownerId: "demo", items: [{ propertyId: "prop-07", addedAt: "2026-10-02" }] }
];
export const conversations: Conversation[] = [
  { id: "conv-1", participantIds: ["demo", "mariana"], propertyId: "prop-01", updatedAt: "2026-10-05T10:42:00" },
  { id: "conv-2", participantIds: ["demo", "diego"], propertyId: "prop-05", updatedAt: "2026-10-04T16:20:00" },
  { id: "conv-3", participantIds: ["demo", "demo-agent"], updatedAt: "2026-10-05T08:00:00" }
];
export const initialMessages: Message[] = [
  { id: "msg-1", conversationId: "conv-1", senderId: "mariana", body: "¡Hola! La casa de La Molina sigue disponible. ¿Te gustaría conocerla?", sentAt: "2026-10-05T10:40:00" },
  { id: "msg-2", conversationId: "conv-1", senderId: "demo", body: "Sí, ¿podría visitarla esta semana?", sentAt: "2026-10-05T10:42:00" },
  { id: "msg-3", conversationId: "conv-2", senderId: "diego", body: "Te envié los detalles del loft en Barranco. Estoy atento a tus dudas.", sentAt: "2026-10-04T16:20:00" }
];
export const notifications: Notification[] = [
  { id: "n1", title: "Bajó de precio", body: "Una casa guardada en La Molina bajó US$15,000.", href: "/property/casa-contemporanea-con-vista-a-la-ciudad-1", read: false, createdAt: "2026-10-05" },
  { id: "n2", title: "Nuevo en Miraflores", body: "Encontramos un departamento que podría interesarte.", href: "/explore?district=Miraflores", read: false, createdAt: "2026-10-04" },
  { id: "n3", title: "Mariana respondió", body: "Tienes un mensaje sobre tu próxima visita.", href: "/messages", read: true, createdAt: "2026-10-04" }
];
export const billboards: Billboard[] = [
  { id: "bb-1", variant: "property", classification: "sponsored", title: "Un nuevo horizonte para vivir", subtitle: "La Molina · 340 m² · 4 dorm.", image: "/images/la-molina-hero.png", price: "US$ 395,000", cta: "Descubrir", href: `/property/${properties[0].slug}`, badge: "PATROCINADO", sponsor: "Mariana Torres", placement: "city_premium", size: "hero" },
  { id: "bb-2", variant: "district", classification: "trending", title: "Barranco se mueve", subtitle: "+5.1% interés este mes", image: "/images/property-5.jpg", cta: "Explorar distrito", href: "/district/barranco", badge: "EN TENDENCIA", placement: "city_premium", size: "tall" },
  { id: "bb-3", variant: "property", classification: "algorithmic", title: "Espacios para empezar algo nuevo", subtitle: "Miraflores · 145 m²", image: "/images/property-2.jpg", price: "US$ 320,000", cta: "Ver propiedad", href: `/property/${properties[1].slug}`, placement: "feed_wide", size: "wide" },
  { id: "bb-4", variant: "agent", classification: "editorial", title: "Conoce a Mariana", subtitle: "Ideas, recorridos y casas extraordinarias", image: "/images/property-4.jpg", cta: "Ver perfil", href: "/agent/marianainmuebles", placement: "city_premium", size: "small" },
  { id: "bb-5", variant: "project", classification: "sponsored", title: "Alameda del Parque", subtitle: "Un proyecto para vivir cerca de todo", image: "/images/property-6.jpg", price: "Desde S/ 890,000", cta: "Conocer proyecto", href: `/property/${properties[16].slug}`, badge: "PATROCINADO", sponsor: "Alameda", placement: "city_premium", size: "wide" },
  { id: "bb-6", variant: "trend", classification: "local", title: "Pachacámac para ti", subtitle: "8 oportunidades que merecen una mirada", image: "/images/property-7.jpg", cta: "Ver terrenos", href: "/explore?district=Pachacámac", placement: "city_premium", size: "small" }
];
export const campaigns: Campaign[] = [{ id: "camp-1", name: "Casa La Molina", ownerId: "mariana", createdAt: "2026-09-18", promotionIds: ["promo-1"] }];
export const promotions: Promotion[] = [{ id: "promo-1", campaignId: "camp-1", contentId: "prop-01", contentType: "property", placement: "city_premium", cityScreenId: "A01", objective: "contacts", budget: 120, durationDays: 7, status: "active", analytics: { impressions: 24820, views: 7820, clicks: 1482, saves: 221, chats: 43, visits: 11, cost: 120 } }];
