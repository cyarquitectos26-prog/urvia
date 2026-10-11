import type { Operation, Property, PropertyType } from "@/types";
import { filterProperties, parseSearch } from "@/lib/domain";

export interface MapBounds { south: number; west: number; north: number; east: number }
export function normalizeMapText(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
export function insideMapBounds(property: Property, bounds: MapBounds) {
  const { lat, lng } = property.location;
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}

export function searchMapProperties(items: Property[], filters: { query: string; district?: string; operation?: Operation; type?: PropertyType; bounds?: MapBounds | null }) {
  const intent = parseSearch(filters.query);
  const matches = filterProperties({ ...intent, district: filters.district || intent.district, operation: filters.operation || intent.operation, type: filters.type || intent.type }, items);
  let text = normalizeMapText(filters.query);
  for (const phrase of [intent.district, intent.type, ...intent.amenities].filter(Boolean)) text = text.replaceAll(normalizeMapText(phrase!), " ");
  const words = text.replace(/(?:us\$|s\/|\$)\s*[\d,.]+\s*(?:mil|k)?/g, " ").replace(/\d+[\d,.]*\s*(?:mil|k|m²|dormitorios?|dorm|habitaciones?|banos?)/g, " ").split(/[^a-z]+/).filter(word => word.length > 1 && !["en", "el", "la", "las", "los", "de", "del", "un", "una", "con", "para", "y", "o", "lima", "peru", "comprar", "compra", "venta", "vender", "alquilar", "alquiler", "alquilo", "hasta", "menos", "presupuesto", "propiedad", "propiedades", "casa", "casas", "departamento", "departamentos", "terreno", "terrenos", "oficina", "oficinas", "local", "locales", "proyecto", "proyectos"].includes(word));
  return matches.filter(p => {
    const searchable = normalizeMapText([p.title, p.description, p.location.address, p.location.district, ...p.amenities].join(" "));
    return words.every(word => searchable.includes(word)) && (!filters.bounds || insideMapBounds(p, filters.bounds));
  });
}
