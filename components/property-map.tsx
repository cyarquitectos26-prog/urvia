"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/types";
import type { MapBounds } from "@/lib/map-search";
import "leaflet/dist/leaflet.css";
import "./property-map.css";

const MapCanvas = dynamic(() => import("./property-map-canvas"), { ssr: false, loading: () => <div className="property-map-loading" role="status">Cargando mapa de Lima…</div> });
export interface PropertyMapProps {
  properties: Property[];
  selected: Property | null;
  onSelect: (id: string | null) => void;
  onSearchArea: (bounds: MapBounds) => void;
  keepView: boolean;
}
export function PropertyMap(props: PropertyMapProps) { return <div className="property-map"><MapCanvas {...props} /></div>; }
