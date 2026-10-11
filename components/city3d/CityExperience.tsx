"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bookmark, Building2, Check, ExternalLink, Heart, Map, Maximize2, Minimize2, Move, Pause, Play, Radio, RotateCcw, Search, Settings2, Share2, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { allProperties, useApp } from "@/components/app-state";
import { CityScene, type CityDrive, type CityPosition } from "@/components/city3d/CityScene";
import { CityErrorBoundary } from "@/components/city3d/CityErrorBoundary";
import { recordCityEvent } from "@/lib/city/analytics";
import { buildCityScreens, findCityScreen, type CityQuality, type CityScreen } from "@/lib/city/model";
import { money, propertyMatch } from "@/lib/domain";

function canUseWebGL() { try { const canvas = document.createElement("canvas"); return !!(canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true })); } catch { return false; } }
function autoQuality(): Exclude<CityQuality, "auto"> {
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = window.matchMedia("(max-width: 700px)").matches;
  return mobile || cores <= 4 ? "low" : cores < 8 ? "medium" : "high";
}

function CityFallback({ screens, onSelect }: { screens: CityScreen[]; onSelect: (screenId: string) => void }) {
  return <div className="city-2d" aria-label="City en vista editorial">
    <div className="city-2d-intro"><span className="city-overline"><Radio size={15} /> CENTRAL AVENUE · VISTA EDITORIAL</span><h1>Una avenida llena de posibilidades.</h1><p>Explora las mismas pantallas y campañas de la ciudad en una vista ligera.</p></div>
    <div className="city-2d-grid">{screens.map(({ placement, story }, i) => <button key={placement.id} className={`city-2d-card ${i === 0 ? "large" : ""} ${story.classification === "sponsored" ? "sponsored" : ""}`} onClick={() => onSelect(placement.screenId)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}<img src={story.image} alt="" loading="lazy" /><span className="city-2d-shade" /><span className="city-2d-screen">{placement.screenId} · {placement.size.toUpperCase()}</span><span className="city-2d-copy"><small>{story.kicker}</small><strong>{story.title}</strong><em>{story.subtitle}</em>{story.price && <b>{story.price}</b>}</span>
    </button>)}</div>
  </div>;
}

function CityMiniMap({ position, screens, onFocus }: { position: CityPosition; screens: CityScreen[]; onFocus: (id: string) => void }) {
  const progress = Math.min(98, Math.max(2, ((29 - position.z) / 203) * 100));
  return <div className="city-minimap"><div className="city-minimap-head"><span><Map size={14} /> CITY MAP</span><small>CENTRAL AVENUE</small></div><div className="city-map-track"><div className="city-map-road" /><span className="city-map-user" style={{ top: `${progress}%` }} title="Tu posición" />{screens.filter((_, i) => i % 3 !== 2).map(({ placement, story }) => <button key={placement.id} className={`city-map-dot ${story.classification === "sponsored" ? "sponsored" : ""}`} style={{ left: placement.position[0] < 0 ? "19%" : "74%", top: `${Math.max(2, ((29 - placement.position[2]) / 203) * 100)}%` }} onClick={() => onFocus(placement.screenId)} title={`${placement.screenId}: ${story.title}`} aria-label={`Ir a pantalla ${placement.screenId}: ${story.title}`} />)}</div><div className="city-map-ends"><span>INICIO</span><span>FINAL</span></div></div>;
}

function CityPropertyPreview({ screen, all, isSaved, isFollowed, preferences, soundOn, onAmbient, onClose, onSave, onFollow, onOpen }: { screen: CityScreen; all: ReturnType<typeof allProperties>; isSaved: boolean; isFollowed: boolean; preferences: ReturnType<typeof useApp>["preferences"]; soundOn: boolean; onAmbient: () => void; onClose: () => void; onSave: () => void; onFollow: () => void; onOpen: () => void }) {
  const { placement, story } = screen;
  const property = all.find(p => p.id === story.propertyId);
  const match = property ? propertyMatch(property, preferences) : null;
  const [copied, setCopied] = useState(false);
  async function copy() { try { const url = new URL(window.location.href); url.searchParams.set("billboard", placement.screenId); await navigator.clipboard.writeText(url.toString()); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } }
  return <aside className="city-preview" role="dialog" aria-label={`Pantalla ${placement.screenId}: ${story.title}`}>
    <button className="city-preview-close" onClick={onClose} aria-label="Cerrar panel"><X size={17} /></button>
    <div className="city-preview-cover">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={story.image} alt="" /><span>{story.classification === "sponsored" ? "PATROCINADO" : story.kicker}</span></div>
    <div className="city-preview-body"><small className="city-preview-screen">CITY CENTER · SCREEN {placement.screenId} · {placement.size.toUpperCase()}</small><h2>{story.title}</h2><p>{story.subtitle}</p>{property && <><strong className="city-preview-price">{money(property.price, property.currency)}</strong><div className="city-preview-facts"><span>{property.area} m²</span><span>{property.bedrooms} dorm.</span><span>{property.bathrooms} baños</span></div>{match !== null && <div className="city-preview-match"><Sparkles size={15} /> {match}% para ti</div>}</>}
      <div className="city-preview-actions"><Link href={property ? `/property/${property.slug}` : story.href} className="city-action-primary" onClick={onOpen}>{property ? "Ver propiedad" : story.type === "agent" ? "Ver agente" : story.type === "video" ? "Ver videos" : "Explorar"} <ExternalLink size={15} /></Link>{property && <button className={`city-action-icon ${isSaved ? "active" : ""}`} onClick={onSave} aria-label={isSaved ? "Quitar de guardados" : "Guardar propiedad"}><Heart size={19} fill={isSaved ? "currentColor" : "none"} /></button>}{story.agentId && <button className="city-action-secondary" onClick={onFollow}>{isFollowed ? "Siguiendo" : "Seguir agente"}</button>}<button className="city-action-icon" onClick={copy} aria-label="Copiar enlace a esta pantalla">{copied ? <Check size={18} /> : <Share2 size={18} />}</button></div>
      {story.type === "video" && <><button className="city-preview-ambient" onClick={onAmbient}>{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}{soundOn ? "Silenciar ambiente" : "Activar ambiente"}</button><p className="city-preview-note">Clip visual de 6 segundos creado a partir de la portada. La pantalla reproduce el loop sin audio.</p></>}
      {story.classification === "sponsored" && <p className="city-preview-note">Espacio publicitario de demostración. La visibilidad se mide después de aparecer en pantalla durante al menos 1,2 segundos.</p>}
    </div>
  </aside>;
}

export default function CityExperience() {
  const { campaigns, published, preferences, saved, toggleSave, follows, toggleFollow } = useApp();
  const all = useMemo(() => allProperties(published), [published]);
  const screens = useMemo(() => buildCityScreens(all, campaigns, preferences), [all, campaigns, preferences]);
  const [mode, setMode] = useState<"checking" | "3d" | "2d">("checking");
  const [quality, setQuality] = useState<CityQuality>("auto");
  const [detectedQuality] = useState<Exclude<CityQuality, "auto">>(() => typeof navigator === "undefined" ? "medium" : autoQuality());
  const resolvedQuality = quality === "auto" ? detectedQuality : quality;
  const [ready, setReady] = useState(false); const [intro, setIntro] = useState(false);
  const [autoTour, setAutoTour] = useState(false); const [showMap, setShowMap] = useState(false); const [showSettings, setShowSettings] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); const [focusId, setFocusId] = useState<string | null>(null); const [lookedAt, setLookedAt] = useState<string | null>(null);
  const [position, setPosition] = useState<CityPosition>({ x: 0, z: 28, yaw: 0 });
  const [query, setQuery] = useState(""); const [searchMessage, setSearchMessage] = useState(""); const [soundOn, setSoundOn] = useState(false);
  const drive = useRef<CityDrive>({ forward: 0, side: 0 });
  const audio = useRef<{ context: AudioContext; source: AudioBufferSourceNode } | null>(null);
  const selected = screens.find(s => s.placement.screenId === selectedId);
  useEffect(() => {
    let live = true;
    queueMicrotask(() => { if (!live) return; setMode(canUseWebGL() ? "3d" : "2d"); try { setIntro(localStorage.getItem("urba-city-entered-v1") !== "yes"); } catch { setIntro(true); } });
    recordCityEvent({ name: "cityVisit" }); const started = Date.now();
    return () => { live = false; recordCityEvent({ name: "visitTime", value: Math.round((Date.now() - started) / 1000) }); };
  }, []);
  useEffect(() => { const id = new URLSearchParams(window.location.search).get("billboard"); if (id && screens.some(s => s.placement.screenId === id)) queueMicrotask(() => { setSelectedId(id); setFocusId(id); }); }, [screens]);
  useEffect(() => () => { if (audio.current) { audio.current.source.stop(); void audio.current.context.close(); audio.current = null; } }, []);
  const select = useCallback((id: string) => { const screen = screens.find(s => s.placement.screenId === id); if (!screen) return; setSelectedId(id); setSearchMessage(""); const url = new URL(window.location.href); url.searchParams.set("billboard", id); window.history.replaceState({}, "", url); recordCityEvent({ name: "billboardClick", screenId: id, promotionId: screen.story.promotionId }); }, [screens]);
  const focus = useCallback((id: string) => { setFocusId(`${id}:${Date.now()}`); setAutoTour(false); select(id); }, [select]);
  function closePanel() { setSelectedId(null); const url = new URL(window.location.href); url.searchParams.delete("billboard"); window.history.replaceState({}, "", url); }
  function searchCity(e: React.FormEvent) { e.preventDefault(); const found = findCityScreen(query, screens); if (found) { focus(found.placement.screenId); setSearchMessage(`Pantalla ${found.placement.screenId} encontrada`); } else setSearchMessage("No hay una pantalla para esa búsqueda. Prueba con un distrito o propiedad."); }
  function enter(tour = false) { setIntro(false); setAutoTour(tour); try { localStorage.setItem("urba-city-entered-v1", "yes"); } catch { /* first-entry note may reappear */ } }
  function setAmbient(enabled: boolean) {
    if (!enabled) { if (audio.current) { audio.current.source.stop(); void audio.current.context.close(); audio.current = null; } setSoundOn(false); return; }
    try { const context = new AudioContext(); const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.13; const source = context.createBufferSource(); source.buffer = buffer; source.loop = true; const filter = context.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 210; const gain = context.createGain(); gain.gain.value = 0.18; source.connect(filter).connect(gain).connect(context.destination); source.start(); audio.current = { context, source }; setSoundOn(true); } catch { setSoundOn(false); }
  }
  const fallback = mode === "2d";
  return <div className={`city-experience ${fallback ? "is-2d" : ""}`}>
    {mode === "checking" && <div className="city-entry-loading"><span className="city-loading-mark">ORBE<span>·</span>CITY</span><h1>Entrando a City…</h1><div className="city-loading-bar" /><p>Preparando la avenida inmobiliaria</p></div>}
    {mode === "3d" && <div className="city-canvas-wrap"><CityErrorBoundary onFailure={() => { setMode("2d"); setSearchMessage("WebGL no está disponible; abrimos la vista ligera."); }}><CityScene screens={screens} quality={resolvedQuality} autoTour={autoTour} focusScreenId={focusId} selectedScreenId={selectedId} drive={drive} onPosition={setPosition} onSelect={select} onLookAt={setLookedAt} onLowFps={() => { if (quality === "auto") { setMode("2d"); setSearchMessage("Cambiamos a la vista ligera para cuidar el rendimiento."); } }} onReady={() => setReady(true)} /></CityErrorBoundary>{!ready && <div className="city-scene-loading"><div className="city-loading-bar" /><span>Entrando a City…</span></div>}</div>}
    {fallback && <CityFallback screens={screens} onSelect={select} />}
    <div className="city-night-vignette" aria-hidden="true" />
    <header className="city-hud-top"><Link href="/" className="city-brand" aria-label="ORBE · Volver al inicio"><img src="/brand/orbe-horizontal-dark.svg" alt="ORBE" width={115} height={38}/><em>CITY</em></Link><form className="city-search" onSubmit={searchCity}><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Encuentra algo en la ciudad…" aria-label="Buscar en City" /><button type="submit" aria-label="Buscar"><ArrowRight size={17} /></button></form><div className="city-hud-top-actions"><span className="city-live"><i /> LIMA · NOCHE</span><Link href="/explore" className="city-exit"><X size={17} /> Salir de City</Link></div></header>
    {searchMessage && <div className="city-search-feedback" role="status">{searchMessage}<button onClick={() => setSearchMessage("")} aria-label="Cerrar mensaje"><X size={13} /></button></div>}
    {!fallback && <><div className={`city-reticle ${lookedAt ? "active" : ""}`} aria-hidden="true"><span /></div><div className="city-view-caption"><span className="city-overline"><Radio size={13} /> CENTRAL AVENUE · 01</span><h1>El mercado <em>cobra vida.</em></h1><p>Recorre la avenida y toca una pantalla para descubrir qué hay detrás.</p><span className="city-progress">{Math.round(((29 - position.z) / 203) * 100)}% DEL RECORRIDO <b>·</b> 21 PANTALLAS</span></div></>}
    {!fallback && showMap && <CityMiniMap position={position} screens={screens} onFocus={focus} />}
    {selected && <CityPropertyPreview key={selected.placement.screenId} screen={selected} all={all} isSaved={!!selected.story.propertyId && saved.includes(selected.story.propertyId)} isFollowed={!!selected.story.agentId && follows.includes(selected.story.agentId)} preferences={preferences} soundOn={soundOn} onAmbient={() => setAmbient(!soundOn)} onClose={closePanel} onSave={() => { if (selected.story.propertyId) { const adding = !saved.includes(selected.story.propertyId); toggleSave(selected.story.propertyId); if (adding) recordCityEvent({ name: "save", screenId: selected.placement.screenId, promotionId: selected.story.promotionId }); } }} onFollow={() => { if (selected.story.agentId) toggleFollow(selected.story.agentId); }} onOpen={() => { if (selected.story.propertyId) recordCityEvent({ name: "propertyOpen", screenId: selected.placement.screenId, promotionId: selected.story.promotionId }); }} />}
    <div className="city-hud-bottom"><div className="city-bottom-actions"><button onClick={() => { if (fallback) document.querySelector(".city-2d")?.scrollTo({ top: 0, behavior: "smooth" }); else { setAutoTour(false); setFocusId(`START:${Date.now()}`); } closePanel(); }} title="Volver al inicio"><RotateCcw size={17} /><span>Inicio</span></button>{!fallback && <><button className={autoTour ? "active" : ""} onClick={() => setAutoTour(v => !v)} title="Recorrido automático">{autoTour ? <Pause size={18} /> : <Play size={18} />}<span>{autoTour ? "Pausar" : "Recorrido automático"}</span></button><button onClick={() => setShowMap(v => !v)} title="Mostrar u ocultar mapa"><Map size={17} /><span>Mapa</span></button></>}<Link href="/collections" title="Guardados"><Bookmark size={17} /><span>Guardados</span></Link><button onClick={() => setShowSettings(v => !v)} title="Ajustes"><Settings2 size={17} /><span>Ajustes</span></button></div><div className="city-control-hint"><Move size={16} /> {fallback ? "Selecciona una pantalla" : "WASD / flechas · arrastra · scroll"}</div></div>
    {!fallback && <div className="city-touch-controls"><button onPointerDown={() => { drive.current.forward = -1; }} onPointerUp={() => { drive.current.forward = 0; }} onPointerLeave={() => { drive.current.forward = 0; }} aria-label="Retroceder"><ArrowDown size={19} /></button><button onPointerDown={() => { drive.current.side = -1; }} onPointerUp={() => { drive.current.side = 0; }} onPointerLeave={() => { drive.current.side = 0; }} aria-label="Mover izquierda"><ArrowLeft size={19} /></button><button className="primary" onPointerDown={() => { drive.current.forward = 1; }} onPointerUp={() => { drive.current.forward = 0; }} onPointerLeave={() => { drive.current.forward = 0; }} aria-label="Avanzar"><ArrowUp size={22} /></button><button onPointerDown={() => { drive.current.side = 1; }} onPointerUp={() => { drive.current.side = 0; }} onPointerLeave={() => { drive.current.side = 0; }} aria-label="Mover derecha"><ArrowRight size={19} /></button></div>}
    {showSettings && <div className="city-settings"><div><strong><Settings2 size={16} /> Ajustes de City</strong><button onClick={() => setShowSettings(false)} aria-label="Cerrar ajustes"><X size={16} /></button></div><label>Calidad gráfica</label><div className="city-quality-options">{(["auto", "low", "medium", "high"] as CityQuality[]).map(value => <button key={value} className={quality === value ? "active" : ""} onClick={() => setQuality(value)}>{({ auto: "Auto", low: "Baja", medium: "Media", high: "Alta" })[value]}</button>)}</div><button className="city-settings-line" onClick={() => setAmbient(!soundOn)}>{soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />} Ambiente {soundOn ? "activado" : "silenciado"}</button><button className="city-settings-line" onClick={() => { setMode(fallback ? "3d" : "2d"); setReady(false); }}>{fallback ? <Maximize2 size={17} /> : <Minimize2 size={17} />} {fallback ? "Entrar a la avenida 3D" : "Vista ligera 2D"}</button><Link href="/dashboard/promote/create" className="city-settings-line"><Building2 size={17} /> Promocionar en una pantalla</Link></div>}
    {intro && mode !== "checking" && <div className="city-intro-backdrop"><div className="city-intro"><span className="city-overline"><Sparkles size={15} /> BIENVENIDO A ORBE CITY</span><h2>La ciudad inmobiliaria<br /><em>se recorre.</em></h2><p>Avanza por la avenida y selecciona las pantallas para descubrir propiedades, agentes y lugares. Puedes usar teclado, scroll o los controles táctiles.</p><div className="city-intro-actions"><button className="city-intro-primary" onClick={() => enter(false)}>Entrar a City <ArrowRight size={17} /></button><button className="city-intro-secondary" onClick={() => enter(true)}><Play size={16} /> Recorrido automático</button></div><small>La experiencia empieza en silencio. La vista 2D está siempre disponible en Ajustes.</small></div></div>}
  </div>;
}
