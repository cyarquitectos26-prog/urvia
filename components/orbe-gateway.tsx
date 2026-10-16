"use client";
import { propertyHref } from "@/lib/property-link";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Layers, MapPin, Pause, Play, Plus, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SmartSearchBar } from "@/components/shell";
import { properties } from "@/lib/data/mock";
import { money } from "@/lib/domain";

/** Visual entry point; the existing marketplace feed remains directly below. */
export function OrbeGateway() {
  const [layers,setLayers]=useState(false); const reduced=useReducedMotion(); const featured=properties[2];
  const videoRef=useRef<HTMLVideoElement>(null);
  const gatewayRef=useRef<HTMLElement>(null);
  const [playRequested,setPlayRequested]=useState<boolean|null>(null);
  const [playing,setPlaying]=useState(false);
  const wantsPlayback=playRequested ?? !reduced;

  useEffect(()=>{
    const video=videoRef.current; const gateway=gatewayRef.current;
    if(!video || !gateway) return;
    let inView=true;
    const syncPlayback=()=>{
      if(wantsPlayback && inView && !document.hidden){
        // Autoplay can be blocked by a browser; keep the poster and play control available.
        void video.play().catch(()=>{});
      }else video.pause();
    };
    const observer=new IntersectionObserver(([entry])=>{
      inView=entry.isIntersecting;
      syncPlayback();
    },{threshold:0});
    observer.observe(gateway);
    document.addEventListener("visibilitychange",syncPlayback);
    syncPlayback();
    return ()=>{
      observer.disconnect();
      document.removeEventListener("visibilitychange",syncPlayback);
      video.pause();
    };
  },[wantsPlayback]);

  const playbackLabel=playing ? "Pausar video de fondo" : "Reproducir video de fondo";
  return <>
    <div className="gateway-search-sticky"><div className="gateway-search"><SmartSearchBar/></div></div>
    <section ref={gatewayRef} className="orbe-gateway" aria-label="Descubre tu universo inmobiliario">
    <video ref={videoRef} className="gateway-scene" src="/videos/orbe-lima-background.mp4?v=5-clips" poster="/images/orbe-lima-poster.webp" width={1920} height={1080} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} disablePictureInPicture onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setPlaying(false)}>
      Tu navegador no puede reproducir el fondo de Lima.
    </video>
    <div className="gateway-shade"/>
    <div className="gateway-tools"><Link href="/publish" aria-label="Publicar propiedad" className="gateway-plus"><Plus size={21}/></Link><button onClick={()=>setLayers(!layers)} aria-label="Explorar capas de la ciudad" aria-expanded={layers}><Layers size={19}/></button><button onClick={()=>setPlayRequested(!playing)} aria-label={playbackLabel} title={playbackLabel}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button></div>
    {layers && <div className="gateway-layers"><div><strong>Tu ciudad, a tu manera</strong><button onClick={()=>setLayers(false)} aria-label="Cerrar capas"><X size={16}/></button></div><Link href="/map">Propiedades en el mapa <MapPin size={16}/></Link><Link href="/city">Recorrer ORBE City <ArrowUpRight size={16}/></Link><Link href="/explore?type=Proyecto">Nuevos proyectos <ArrowUpRight size={16}/></Link></div>}
    <span className="gateway-coordinate">12° 05′ S / 77° 02′ O <i/> LIMA, PERÚ</span>
    <motion.div className="gateway-copy" initial={reduced?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.65,delay:.15}}>
      <span className="gateway-kicker">UN NUEVO UNIVERSO INMOBILIARIO</span><h1>Tu próxima propiedad<br/>no se busca.<br/><em>Se descubre.</em></h1>
      <Link href="/city" className="gateway-cta"><span><ArrowRight size={20}/></span>Explorar ORBE City<ArrowUpRight size={18}/></Link>
    </motion.div>
    <Link className="gateway-property" href={propertyHref(featured)}><img src={featured.media[0].url} alt=""/><span><small><MapPin size={12}/> {featured.location.district}</small><strong>{money(featured.price,featured.currency)}</strong><em>Descubrir propiedad <ArrowUpRight size={12}/></em></span></Link>
    <div className="gateway-caption"><i/> Lima, Perú · Explora propiedades en el feed</div>
    </section>
  </>;
}
