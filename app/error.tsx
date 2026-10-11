"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <div className="page-shell empty-state"><h1>Algo no salió como esperábamos</h1><p>Puedes volver a intentar cargar esta vista.</p><button className="button primary" onClick={reset}>Reintentar</button></div>; }
