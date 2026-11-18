"use client";
import { assetPath } from "@/lib/paths";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Radio, Sparkles } from "lucide-react";
import { properties } from "@/lib/data/mock";
import { generateBillboardCreative, money } from "@/lib/domain";
import { allProperties, useApp } from "@/components/app-state";
import { cityPlacements, resolveCityPromotionPlacements, sponsoredScreenIds } from "@/lib/city/model";
import type { BillboardPlacement, Promotion } from "@/types";

const steps = ["Contenido", "Formato", "Preview", "Audiencia", "Presupuesto", "Lanzar"];
const placements: [BillboardPlacement, string, string][] = [
  ["feed_standard", "For You", "En el feed de descubrimiento"],
  ["explore_grid", "Explorar", "Entre resultados relevantes"],
  ["video_break", "Videos", "Pausa editorial vertical"],
  ["district_hero", "Distrito", "Contexto local"],
  ["city_premium", "City premium", "Una pantalla física de Central Avenue"],
];
const screenInventory = cityPlacements.filter(p => sponsoredScreenIds.includes(p.screenId));

export default function CreatePromotionPage() {
  const [step, setStep] = useState(0);
  const [propertyId, setPropertyId] = useState(properties[0].id);
  const [placement, setPlacement] = useState<BillboardPlacement>("city_premium");
  const [cityScreenId, setCityScreenId] = useState("");
  const [objective, setObjective] = useState<Promotion["objective"]>("contacts");
  const [budget, setBudget] = useState(60); const [duration, setDuration] = useState(3); const [done, setDone] = useState(false);
  const { addPromotion, campaigns, published } = useApp();
  const candidates = allProperties(published);
  const property = candidates.find(p => p.id === propertyId) || candidates[0];
  const creative = generateBillboardCreative(property);
  const occupied = new Set(resolveCityPromotionPlacements(campaigns).keys());
  const chosenScreen = screenInventory.find(p => p.screenId === cityScreenId);
  function launch() {
    const selectedScreen = placement === "city_premium" && cityScreenId && !occupied.has(cityScreenId) ? cityScreenId : undefined;
    if (placement === "city_premium" && !selectedScreen) return;
    addPromotion({ id: `promo-${Date.now()}`, campaignId: `camp-${Date.now()}`, contentId: propertyId, contentType: "property", placement, cityScreenId: selectedScreen, objective, budget, durationDays: duration, status: "active", analytics: { impressions: 0, views: 0, clicks: 0, saves: 0, chats: 0, visits: 0, cost: budget } });
    setCityScreenId(selectedScreen || cityScreenId); setDone(true);
  }
  return <div className="page-shell create-promotion"><div className="page-heading"><div><span className="eyebrow"><Radio size={15} /> NUEVA PROMOCIÓN</span><h1>Ocupa tu espacio en la ciudad.</h1><p>Crea una campaña relevante y visual en pocos pasos.</p></div></div>
    {done ? <div className="publish-success"><span><Check size={35} /></span><h2>Tu promoción está activa en la demo</h2><p>{placement === "city_premium" ? `Tu propiedad ya ocupa la pantalla ${cityScreenId} de Central Avenue.` : "La campaña aparece en tu panel con métricas iniciales."} No se ha realizado ningún cobro.</p><div className="step-actions"><Link className="button primary" href={placement === "city_premium" ? `/city?billboard=${cityScreenId}` : "/dashboard/promote"}>{placement === "city_premium" ? "Ver en City" : "Ver campañas"} <ArrowRight size={16} /></Link><Link className="button outline" href="/dashboard/promote">Ver campañas</Link></div></div>
      : <div className="promotion-create-layout"><div><div className="step-progress">{steps.map((s, i) => <span key={s} className={i <= step ? "active" : ""}>{i + 1}<small>{s}</small></span>)}</div><div className="step-card">
        {step === 0 && <><h2>¿Qué quieres promocionar?</h2><p>Selecciona una propiedad para crear su anuncio.</p><div className="select-property-list">{[...published, ...properties.slice(0, 5)].map(p => <button className={propertyId === p.id ? "selected" : ""} key={p.id} onClick={() => setPropertyId(p.id)}><img src={assetPath(p.media[0].url)} alt="" /><span>{p.title}<small>{p.location.district} · {money(p.price, p.currency)}</small></span></button>)}</div></>}
        {step === 1 && <><h2>¿Dónde quieres aparecer?</h2><p>Elige un espacio con el contexto adecuado.</p><div className="placement-options">{placements.map(([id, label, desc]) => <button className={placement === id ? "selected" : ""} key={id} onClick={() => setPlacement(id)}><Radio size={21} /><span><strong>{label}</strong><small>{desc}</small></span></button>)}</div>{placement === "city_premium" && <div className="city-inventory-select"><h3>Elige una pantalla en Central Avenue</h3><p>Una posición real de la demo, con visibilidad estimada y enlace directo.</p><div>{screenInventory.map(p => <button key={p.screenId} disabled={occupied.has(p.screenId)} className={cityScreenId === p.screenId ? "selected" : ""} onClick={() => setCityScreenId(p.screenId)}><strong>SCREEN {p.screenId}</strong><small>{p.size.toUpperCase()} · VISIBILIDAD {p.visibilityScore}/100</small><em>{occupied.has(p.screenId) ? "Ocupada" : "Disponible"}</em></button>)}</div></div>}</>}
        {step === 2 && <><h2>Tu creativo, listo para destacar</h2><p>Generado a partir de la propiedad. Vista previa de la demo.</p><div className="creative-preview" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.9),transparent),url('${creative.image}')` }}><span>PATROCINADO · {placement === "city_premium" ? `SCREEN ${cityScreenId}` : placement.replaceAll("_", " ")}</span><div><h3>{creative.title}</h3><p>{creative.subtitle}</p><strong>{creative.price}</strong><small>{creative.cta} →</small></div></div></>}
        {step === 3 && <><h2>¿Qué resultado buscas?</h2><p>Tu anuncio se mostrará a personas con intereses relacionados.</p><div className="option-grid">{[["views", "Más visualizaciones"], ["contacts", "Más contactos"], ["visits", "Más visitas"], ["followers", "Más seguidores"]].map(([id, label]) => <button key={id} className={objective === id ? "selected" : ""} onClick={() => setObjective(id as Promotion["objective"])}>{label}</button>)}</div><div className="audience-note"><Sparkles size={18} /> Audiencia demo: interesados en {property.location.district} y propiedades similares.</div></>}
        {step === 4 && <><h2>Define tu inversión</h2><p>Presupuesto total de la campaña. El lanzamiento es simulado.</p><div className="option-grid">{[30, 60, 120].map(n => <button key={n} className={budget === n ? "selected" : ""} onClick={() => setBudget(n)}>S/ {n}</button>)}<label className="custom-budget">Personalizado<input type="number" min="1" value={[30, 60, 120].includes(budget) ? "" : budget} onChange={e => setBudget(Number(e.target.value))} placeholder="S/" /></label></div><h3>Duración</h3><div className="segmented">{[[1, "24 h"], [3, "3 días"], [7, "7 días"], [14, "14 días"]].map(([value, label]) => <button key={value} className={duration === value ? "selected" : ""} onClick={() => setDuration(Number(value))}>{label}</button>)}</div></>}
        {step === 5 && <><h2>Lista para entrar en escena</h2><div className="publish-summary"><span>{placement === "city_premium" ? `CITY CENTER · SCREEN ${cityScreenId}` : placement.replaceAll("_", " ")}</span><strong>{property.title}</strong><b>S/ {budget} · {duration} días</b></div><p>La publicidad estará identificada como «Patrocinado». Sin pagos reales en esta demo.</p></>}
        <div className="step-actions"><button className="button ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Atrás</button><button className="button primary" disabled={(step === 1 || step === 5) && placement === "city_premium" && (!cityScreenId || occupied.has(cityScreenId))} onClick={() => step === 5 ? launch() : setStep(step + 1)}>{step === 5 ? "Lanzar promoción" : "Continuar"} <ArrowRight size={16} /></button></div>
      </div></div><aside className="campaign-summary"><span className="eyebrow">TU CAMPAÑA</span><img src={assetPath(property.media[0].url)} alt="" /><h3>{property.title}</h3><p>{property.location.district} · {money(property.price, property.currency)}</p><div><span>Espacio</span><strong>{placement === "city_premium" ? cityScreenId ? `City · ${cityScreenId}` : "City · por elegir" : placement.replaceAll("_", " ")}</strong></div>{placement === "city_premium" && <div><span>Visibilidad estimada</span><strong>{chosenScreen?.visibilityScore || 0}/100</strong></div>}<div><span>Inversión</span><strong>S/ {budget}</strong></div><div><span>Duración</span><strong>{duration} días</strong></div></aside></div>}
  </div>;
}
