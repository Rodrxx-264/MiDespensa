"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Warehouse, Store, Users, Settings } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Lista", icon: Home },
  { href: "/dashboard/despensa", label: "Despensa", icon: Warehouse },
  { href: "/dashboard/tiendas", label: "Tiendas", icon: Store },
  { href: "/dashboard/grupo", label: "Grupo", icon: Users },
  { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings },
];

export function NavbarMobile() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--line)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom,0px)]" aria-label="Navegación">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={cn("touch flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors", active ? "text-[var(--ink)]" : "text-[var(--muted)]")}>
            <Icon size={22} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
