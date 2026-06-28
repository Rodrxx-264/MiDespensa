import Link from "next/link";
import { BarChart3, Clock3, Home, Users } from "lucide-react";

const nav = [{ href: "/dashboard", label: "Lista", icon: Home }, { href: "/dashboard/historial", label: "Historial", icon: Clock3 }, { href: "/dashboard/estadisticas", label: "Stats", icon: BarChart3 }, { href: "/dashboard/grupo", label: "Grupo", icon: Users }];
export function NavbarMobile() { return <nav className="surface fixed inset-x-2 bottom-2 z-40 grid grid-cols-4 rounded-[24px] p-1 pb-[calc(.25rem+env(safe-area-inset-bottom))] md:hidden" aria-label="Navegación móvil">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="touch flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[20px] py-2 text-[11px] font-black text-tinta/75 active:bg-tinta active:text-crema"><Icon aria-hidden="true" size={21}/>{label}</Link>)}</nav>; }
