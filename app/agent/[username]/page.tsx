import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { agents } from "@/lib/data/mock";
import { AgentProfile } from "@/components/agent-profile";
export function generateStaticParams() { return agents.map(a => ({ username: a.username })); }
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> { const { username } = await params; const agent = agents.find(a => a.username === username); return { title: agent ? `${agent.name} · Agente inmobiliario` : "Agente no encontrado" }; }
export default async function AgentPage({ params }: { params: Promise<{ username: string }> }) { const { username } = await params; const agent = agents.find(a => a.username === username); if (!agent) notFound(); return <AgentProfile agent={agent} />; }
