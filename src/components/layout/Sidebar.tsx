import Link from "next/link";
import { BarChart3, Clock3, Home, Users } from "lucide-react";
import { UserMenu } from "./UserMenu";

const nav = [{ href: "/dashboard", label: "Lista", icon: Home }, { href: "/dashboard/historial", label: "Historial", icon: Clock3 }, { href: "/dashboard/estadisticas", label: "Estadísticas", icon: BarChart3 }, { href: "/dashboard/grupo", label: "Grupo", icon: Users }];
export function Sidebar({ user }: { user: { nombre: string; avatar_url?: string | null } }) { return <aside className="hidden border-r border-tinta/10 bg-white p-5 md:block"><Link href="/dashboard" className="text-2xl font-black text-bosque">Mi Despensa</Link><nav className="mt-8 grid gap-2" aria-label="Dashboard">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex min-h-11 items-center gap-3 rounded-control px-3 font-semibold text-tinta/80 hover:bg-menta/20"><Icon aria-hidden="true" size={20}/>{label}</Link>)}</nav><div className="absolute bottom-5 w-[200px]"><UserMenu user={user}/></div></aside>; }
