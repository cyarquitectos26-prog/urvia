"use client";
import { assetPath } from "@/lib/paths";
import Link from "next/link";
import { ArrowRight, Star, Users } from "lucide-react";
import { agents, properties } from "@/lib/data/mock";
import { compact } from "@/lib/domain";
import { useApp } from "@/components/app-state";
import { VerificationBadge } from "@/components/property";
export default function AgentsPage() { const { follows, toggleFollow } = useApp(); return <div className="page-shell agents-page"><div className="page-heading"><div><span className="eyebrow"><Users size={15} /> CONOCE A LOS EXPERTOS</span><h1>Personas detrás de cada lugar</h1><p>Sigue agentes que comparten espacios, ideas y conocimiento local.</p></div></div><div className="agent-grid">{agents.map(a => <article className="agent-card" key={a.id}><div className="agent-cover" style={{ backgroundImage: `url('${assetPath(`/images/property-${agents.indexOf(a) + 1}.jpg`)}')` }} /><div className="agent-card-body"><img src={assetPath(a.avatar)} alt={a.name} /><h2>{a.name} {a.verified && <VerificationBadge />}</h2><p>@{a.username}</p><div className="agent-metrics"><span><Users size={15} /> {compact(a.followers)} seguidores</span><span><Star size={15} fill="currentColor" /> {a.rating}</span></div><p className="agent-bio">{a.bio}</p><div className="agent-tags">{a.specialties.map(s => <span key={s}>{s}</span>)}</div><div className="agent-card-actions"><button className="button primary" onClick={() => toggleFollow(a.id)}>{follows.includes(a.id) ? "Siguiendo" : "Seguir"}</button><Link href={`/agent/${a.username}`} className="button ghost">Ver perfil <ArrowRight size={16} /></Link></div><small>{properties.filter(p => p.agentId === a.id).length} propiedades activas</small></div></article>)}</div></div>; }
