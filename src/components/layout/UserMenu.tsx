"use client";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { createClient } from "@/lib/supabase/client";

export function UserMenu({ user }: { user: { nombre: string; avatar_url?: string | null } }) {
  async function salir() { document.cookie = "mi_despensa_local=; path=/; max-age=0; SameSite=Lax"; await createClient().auth.signOut(); location.href = "/"; }
  return <Dropdown.Root><Dropdown.Trigger className="touch flex w-full items-center gap-3 rounded-card bg-crema p-3 text-left"><span className="grid h-9 w-9 place-items-center rounded-full bg-bosque font-bold text-white">{user.nombre[0]?.toUpperCase()}</span><span className="truncate font-semibold">{user.nombre}</span></Dropdown.Trigger><Dropdown.Portal><Dropdown.Content className="z-50 rounded-card bg-white p-2 shadow-suave"><Dropdown.Item onSelect={salir} className="cursor-pointer rounded-control px-4 py-2 text-red-700">Cerrar sesión</Dropdown.Item></Dropdown.Content></Dropdown.Portal></Dropdown.Root>;
}
