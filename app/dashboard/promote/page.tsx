"use client";
import { assetPath } from "@/lib/paths";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Heart, MessageCircle, MousePointerClick, Plus, Radio, Target } from "lucide-react";
import { properties } from "@/lib/data/mock";
import { allProperties, useApp } from "@/components/app-state";
import { readCityEvents, type CityEvent } from "@/lib/city/analytics";
import { resolveCityPromotionPlacements } from "@/lib/city/model";
import { promotionScore, propertyMatch } from "@/lib/domain";

export default function PromotePage() {
  const { campaigns, published } = useApp();
  const [cityEvents, setCityEvents] = useState<CityEvent[]>([]);
  useEffect(() => { queueMicrotask(() => setCityEvents(readCityEvents())); }, []);
  const catalog = allProperties(published);
  const cityInventory = resolveCityPromotionPlacements(campaigns);
  const visits = cityEvents.filter(e => e.name === "cityVisit").length;
  const impressions = cityEvents.filter(e => e.name === "billboardImpression").length;
  const clicks = cityEvents.filter(e => e.name === "billboardClick").length;
  const seconds = cityEvents.filter(e => e.name === "visitTime").map(e => e.value || 0);
  const average = seconds.length ? Math.round(seconds.reduce((a, b) => a + b, 0) / seconds.length) : 0;
  return <div className="page-shell promote-page"><div className="page-heading"><div><span className="eyebrow"><Radio size={15} /> ATTENTION MARKETPLACE</span><h1>Haz que te descubran.</h1><p>Amplifica tu contenido en espacios relevantes de la ciudad inmobiliaria.</p></div><Link href="/dashboard/promote/create" className="button primary"><Plus size={17} /> Crear promoción</Link></div>
    <div className="promotion-hero"><div><span>PROMOCIONAR EN URVIA</span><h2>Tu propiedad en el lugar correcto,<br />ante las personas correctas.</h2><p>Feed, distritos, videos y pantallas digitales. Cada espacio tiene un propósito.</p><Link href="/dashboard/promote/create" className="button primary">Elegir un espacio <ArrowRight size={17} /></Link></div><img src={assetPath("/images/la-molina-hero.png")} alt="Casa contemporánea" /></div>
    <div className="section-heading"><h2>Resultados de tus campañas</h2><span>Datos de demostración</span></div><div className="promotion-metrics">{[["Impresiones", "24,820", Eye], ["Clics", "1,482", MousePointerClick], ["Guardados", "221", Heart], ["Chats", "43", MessageCircle]].map(([label, value, Icon]) => { const I = Icon as typeof Eye; return <div key={label as string}><I size={19} /><small>{label as string}</small><strong>{value as string}</strong></div>; })}</div>
    <div className="campaign-table"><div className="campaign-table-head"><span>Campaña</span><span>Espacio</span><span>Presupuesto</span><span>Rendimiento</span></div>{campaigns.map(c => { const property = catalog.find(p => p.id === c.contentId); const screenId = [...cityInventory].find(([, promotion]) => promotion.id === c.id)?.[0]; const liveImpressions = cityEvents.filter(e => e.name === "billboardImpression" && e.promotionId === c.id).length; const liveClicks = cityEvents.filter(e => e.name === "billboardClick" && e.promotionId === c.id).length; return <div className="campaign-table-row" key={c.id}><span><img src={assetPath(property?.media[0]?.url || properties[0].media[0].url)} alt="" /><b>{property?.title || "Campaña nueva"}</b></span><span>{screenId ? <Link href={`/city?billboard=${screenId}`}>City · Screen {screenId} ↗</Link> : c.placement.replaceAll("_", " ")}</span><span>S/ {c.budget}</span><span>{c.analytics.impressions ? `${(c.analytics.clicks / c.analytics.impressions * 100).toFixed(1)}% CTR demo` : `${liveImpressions} vistas · ${liveClicks} aperturas`}</span></div>; })}</div>
    <div className="city-analytics-panel"><div><span className="eyebrow"><Radio size={14} /> CITY · ESTA DEMO LOCAL</span><h3>Atención medida en la avenida</h3><p>La impresión requiere pantalla visible, distancia adecuada y al menos 1,2 segundos de exposición. Estos datos se guardan solo en este navegador.</p></div><div className="city-analytics-stats"><span><b>{visits}</b>entradas</span><span><b>{impressions}</b>impresiones visibles</span><span><b>{clicks}</b>pantallas abiertas</span><span><b>{average}s</b>visita media</span></div></div>
    <div className="promotion-note"><Target size={20} /><span>La promoción combina relevancia, calidad y rendimiento. Una mayor inversión no garantiza el primer lugar.</span><strong>Score demo: {promotionScore(campaigns[0], properties[0], propertyMatch(properties[0]))}</strong></div>
  </div>;
}
