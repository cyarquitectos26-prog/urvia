import Link from "next/link";
export default function NotFound() { return <div className="page-shell empty-state"><h1>Este lugar no está disponible</h1><p>La dirección puede haber cambiado. Hay mucho más por descubrir.</p><Link className="button primary" href="/explore">Ir a Explorar</Link></div>; }
