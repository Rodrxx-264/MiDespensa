import Link from "next/link";
import { BarChart3, Home, Store, Users, Warehouse } from "lucide-react";

const nav = [{ href: "/dashboard", label: "Lista", icon: Home }, { href: "/dashboard/despensa", label: "Casa", icon: Warehouse }, { href: "/dashboard/tiendas", label: "Tiendas", icon: Store }, { href: "/dashboard/estadisticas", label: "Stats", icon: BarChart3 }, { href: "/dashboard/grupo", label: "Grupo", icon: Users }];
export function NavbarMobile() { return <nav className="surface fixed inset-x-2 bottom-2 z-40 grid grid-cols-5 rounded-[24px] p-1 pb-[calc(.25rem+env(safe-area-inset-bottom))] md:hidden" aria-label="Navegación móvil">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="touch flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[20px] py-2 text-[10px] font-black text-tinta/75 active:bg-tinta active:text-crema"><Icon aria-hidden="true" size={20}/>{label}</Link>)}</nav>; }
