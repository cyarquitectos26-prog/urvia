"use client";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Maximize2, Minimize2, Search, X } from "lucide-react";
import { districts } from "@/lib/data/mock";
import { useApp, allProperties } from "@/components/app-state";
import { PropertyMap } from "@/components/property-map";
import { PropertyCard } from "@/components/property";
import { searchMapProperties, type MapBounds } from "@/lib/map-search";
import type { Operation, PropertyType } from "@/types";

export default function MapPage() {
  return <Suspense fallback={<div className="page-shell">Cargando mapa…</div>}><MapContent /></Suspense>;
}

function MapContent() {
  const params = useSearchParams();
  const { published } = useApp();
  const [query, setQuery] = useState(() => params.get("q") || "");
  const [district, setDistrict] = useState(() => params.get("district") || "");
  const [operation, setOperation] = useState(() => params.get("operation") || "");
  const [type, setType] = useState(() => params.get("type") || "");
  const [full, setFull] = useState(false);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectProperty = useCallback((id: string | null) => setSelectedId(id), []);
  const searchArea = useCallback((area: MapBounds) => { setBounds(area); setSelectedId(null); }, []);
  const items = useMemo(() => searchMapProperties(allProperties(published), {
    query, district, operation: operation as Operation, type: type as PropertyType, bounds,
  }), [published, query, district, operation, type, bounds]);
  const selected = items.find(p => p.id === selectedId) || null;
  function clearFilters() { setQuery(""); setDistrict(""); setOperation(""); setType(""); setBounds(null); setSelectedId(null); }
  function resetArea() { setBounds(null); setSelectedId(null); }

  return <div className={`map-page ${full ? "map-full" : ""}`}>
    <div className="map-page-header">
      <div><span className="eyebrow"><MapPin size={14} /> EXPLORA LA CIUDAD</span><h1>Lima, a tu manera</h1><p aria-live="polite">{items.length} {items.length === 1 ? "propiedad" : "propiedades"} en el mapa{bounds ? " · en esta zona" : ""}</p></div>
      <button className="button ghost" aria-pressed={full} onClick={() => setFull(!full)}>{full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}{full ? "Ver lista" : "Ampliar mapa"}</button>
    </div>
    <div className="map-search-bar">
      <label className="map-query"><Search size={18} /><input aria-label="Buscar en el mapa" value={query} onChange={e => { setQuery(e.target.value); resetArea(); }} placeholder="Distrito, propiedad o presupuesto…" />{query && <button aria-label="Borrar búsqueda" onClick={() => { setQuery(""); resetArea(); }}><X size={16} /></button>}</label>
      <select aria-label="Filtrar distrito" value={district} onChange={e => { setDistrict(e.target.value); resetArea(); }}><option value="">Todo Lima</option>{districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select>
      <select aria-label="Filtrar operación" value={operation} onChange={e => { setOperation(e.target.value); resetArea(); }}><option value="">Comprar o alquilar</option><option value="buy">Comprar</option><option value="rent">Alquilar</option></select>
      <select aria-label="Filtrar tipo" value={type} onChange={e => { setType(e.target.value); resetArea(); }}><option value="">Todos los tipos</option>{["Casa", "Departamento", "Terreno", "Oficina", "Local", "Proyecto"].map(t => <option key={t}>{t}</option>)}</select>
      <button className="button ghost map-reset" onClick={clearFilters}>Limpiar</button>
    </div>
    {bounds && <div className="map-area-filter"><MapPin size={14} /> Buscando en el área visible <button onClick={resetArea}>Ver todos los resultados <X size={14} /></button></div>}
    <div className="map-page-layout">
      <div className="map-list">
        <div className="map-list-heading">Propiedades en el mapa <span>{items.length}</span></div>
        {items.length ? items.map(p => <div key={p.id} className={`map-result ${selected?.id === p.id ? "active" : ""}`} data-property-id={p.id}><PropertyCard property={p} variant="mini" /><button className="map-locate" onClick={() => setSelectedId(p.id)} aria-label={`Ubicar ${p.title} en el mapa`}><MapPin size={14} /> Ubicar en el mapa</button></div>) : <div className="map-empty"><MapPin size={30} /><h2>No encontramos propiedades</h2><p>Prueba otro distrito o amplía tu búsqueda.</p><button className="button primary" onClick={clearFilters}>Ver todas las propiedades</button></div>}
      </div>
      <PropertyMap properties={items} selected={selected} onSelect={selectProperty} onSearchArea={searchArea} keepView={!!bounds} />
    </div>
  </div>;
}
