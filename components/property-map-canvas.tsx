"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { LocateFixed, Minus, Plus, Search, X } from "lucide-react";
import { money } from "@/lib/domain";
import { PropertyCard } from "@/components/property";
import type { Property } from "@/types";
import type { PropertyMapProps } from "./property-map";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function frame(map: L.Map, properties: Property[]) {
  const positions = properties.map(p => L.latLng(p.location.lat, p.location.lng)).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  if (positions.length) map.fitBounds(L.latLngBounds(positions), { padding: [55, 55], maxZoom: 14, animate: false });
}

export default function MapCanvas({ properties, selected, onSelect, onSearchArea, keepView }: PropertyMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [tileError, setTileError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, { zoomControl: false, scrollWheelZoom: false, minZoom: 9, maxZoom: 18 }).setView([-12.13, -76.97], 11);
    instance.attributionControl.setPrefix(false);
    L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      maxZoom: 19, keepBuffer: 1,
    }).on("tileerror", () => setTileError(true)).on("load", () => setLoading(false)).addTo(instance);
    const observer = new ResizeObserver(() => instance.invalidateSize({ pan: false }));
    observer.observe(container.current);
    setMap(instance);
    return () => { observer.disconnect(); instance.remove(); };
  }, []);

  useEffect(() => { if (map && !keepView) frame(map, properties); }, [map, properties, keepView]);
  useEffect(() => {
    if (map && selected) map.setView([selected.location.lat, selected.location.lng], Math.max(map.getZoom(), 15), { animate: !reducedMotion() });
  }, [map, selected]);

  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    function drawMarkers() {
      if (!map) return;
      layer.clearLayers();
      const groups: { point: L.Point; members: Property[] }[] = [];
      for (const p of properties) {
        if (!Number.isFinite(p.location.lat) || !Number.isFinite(p.location.lng)) continue;
        const point = map.latLngToLayerPoint([p.location.lat, p.location.lng]);
        const group = groups.find(g => g.point.distanceTo(point) < 64);
        if (group && selected?.id !== p.id && !group.members.some(item => item.id === selected?.id)) group.members.push(p);
        else groups.push({ point, members: [p] });
      }
      for (const group of groups) {
        const p = group.members[0];
        const clustered = group.members.length > 1;
        const label = clustered ? `${group.members.length} propiedades` : `${p.title} · ${p.location.district} · ${money(p.price, p.currency)}`;
        const content = document.createElement("span");
        content.textContent = clustered ? String(group.members.length) : money(p.price, p.currency);
        const center: L.LatLngExpression = clustered ? [group.members.reduce((sum, item) => sum + item.location.lat, 0) / group.members.length, group.members.reduce((sum, item) => sum + item.location.lng, 0) / group.members.length] : [p.location.lat, p.location.lng];
        const marker = L.marker(center, { title: label, keyboard: true, riseOnHover: true, zIndexOffset: selected?.id === p.id ? 1000 : 0, icon: L.divIcon({ html: content, className: `orbe-map-marker ${clustered ? "cluster" : "price"} ${selected?.id === p.id ? "selected" : ""}`, iconSize: clustered ? [42, 42] : [104, 34], iconAnchor: clustered ? [21, 21] : [52, 17] }) }).addTo(layer);
        const element = marker.getElement();
        element?.setAttribute("aria-label", clustered ? `Ver ${label} en el mapa` : label);
        element?.setAttribute("data-property-ids", group.members.map(item => item.id).join(","));
        element?.setAttribute("aria-pressed", String(!clustered && selected?.id === p.id));
        element?.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            marker.fire("click");
          }
        });
        marker.on("click", () => {
          if (clustered && map.getZoom() < 18) map.fitBounds(L.latLngBounds(group.members.map(item => L.latLng(item.location.lat, item.location.lng))), { padding: [60, 60], maxZoom: 18, animate: !reducedMotion() });
          else if (clustered) {
            const choices = document.createElement("div");
            choices.className = "map-cluster-choices";
            for (const item of group.members) {
              const button = document.createElement("button");
              button.textContent = `${item.title} · ${money(item.price, item.currency)}`;
              button.onclick = () => { map.closePopup(); onSelect(item.id); };
              choices.append(button);
            }
            L.popup({ className: "orbe-cluster-popup" }).setLatLng(center).setContent(choices).openOn(map);
          } else onSelect(p.id);
        });
      }
    }
    drawMarkers();
    map.on("moveend", drawMarkers);
    return () => { map.off("moveend", drawMarkers); layer.remove(); };
  }, [map, properties, selected, onSelect]);

  return <>
    <div ref={container} className="property-map-canvas" aria-label="Mapa interactivo de propiedades en Lima" />
    <button className="map-search-area" disabled={!map} onClick={() => { if (!map) return; const area = map.getBounds(); onSearchArea({ south: area.getSouth(), west: area.getWest(), north: area.getNorth(), east: area.getEast() }); }}><Search size={15} /> Buscar en esta zona</button>
    <div className="property-map-controls"><button aria-label="Acercar mapa" onClick={() => map?.zoomIn()}><Plus size={18} /></button><button aria-label="Alejar mapa" onClick={() => map?.zoomOut()}><Minus size={18} /></button><button aria-label="Mostrar todas las propiedades del resultado" onClick={() => map && frame(map, properties)}><LocateFixed size={18} /></button></div>
    {loading && !tileError && <div className="map-tile-status" role="status">Cargando calles…</div>}
    {tileError && <div className="map-tile-status" role="status">No se pudieron cargar algunas calles. La búsqueda y las propiedades siguen disponibles.</div>}
    {!properties.length && <div className="map-no-pins">Sin propiedades con estos filtros</div>}
    {selected && <div className="property-map-preview"><button aria-label="Cerrar vista previa" onClick={() => onSelect(null)}><X size={16} /></button><PropertyCard property={selected} variant="mini" /></div>}
    <div className="map-demo-note">Ubicaciones referenciales · datos demo</div>
  </>;
}
