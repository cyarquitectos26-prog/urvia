import type { Property } from "@/types";

export function propertyHref(property: Pick<Property, "id" | "slug">): string {
  // A static host cannot generate HTML for a new browser-only publication.
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" && property.id.startsWith("user-")) {
    return `/property/published/?slug=${encodeURIComponent(property.slug)}`;
  }
  return `/property/${property.slug}`;
}
