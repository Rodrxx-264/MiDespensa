import Link from "next/link";
import { BarChart3, Clock3, Home, Users } from "lucide-react";

const nav = [{ href: "/dashboard", label: "Lista", icon: Home }, { href: "/dashboard/historial", label: "Historial", icon: Clock3 }, { href: "/dashboard/estadisticas", label: "Stats", icon: BarChart3 }, { href: "/dashboard/grupo", label: "Grupo", icon: Users }];
export function NavbarMobile() { return <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-tinta/10 bg-white md:hidden" aria-label="Navegación móvil">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="touch flex flex-col items-center justify-center gap-1 py-2 text-xs font-semibold text-bosque"><Icon aria-hidden="true" size={20}/>{label}</Link>)}</nav>; }
