"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PublishedPropertyGate } from "@/components/published-property-gate";

function PublishedPropertyContent() {
  const params = useSearchParams();
  return <PublishedPropertyGate slug={params.get("slug") || ""} />;
}

export default function PublishedPropertyPage() {
  return <Suspense fallback={<div className="page-shell">Cargando publicación…</div>}><PublishedPropertyContent /></Suspense>;
}
