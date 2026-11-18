"use client";
import dynamic from "next/dynamic";
import "./city.css";

const CityExperience = dynamic(() => import("@/components/city3d/CityExperience"), {
  ssr: false,
  loading: () => <div className="city-entry-loading"><span className="city-loading-mark">URVIA<span>·</span>CITY</span><h1>Entrando a City…</h1><div className="city-loading-bar" /><p>Preparando la avenida inmobiliaria</p></div>,
});
export default function CityPage() { return <CityExperience />; }
