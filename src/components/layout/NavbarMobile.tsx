import Link from "next/link";
import { BarChart3, Clock3, Home, Users } from "lucide-react";

const nav = [{ href: "/dashboard", label: "Lista", icon: Home }, { href: "/dashboard/historial", label: "Historial", icon: Clock3 }, { href: "/dashboard/estadisticas", label: "Stats", icon: BarChart3 }, { href: "/dashboard/grupo", label: "Grupo", icon: Users }];
export function NavbarMobile() { return <nav className="surface fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-full p-1 md:hidden" aria-label="Navegación móvil">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="touch flex flex-col items-center justify-center gap-1 rounded-full py-2 text-xs font-semibold text-tinta/70"><Icon aria-hidden="true" size={19}/>{label}</Link>)}</nav>; }
