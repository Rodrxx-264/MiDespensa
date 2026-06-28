"use client";
import { Button } from "@/components/ui/Button";
import type { Grupo, Perfil } from "@/types";

export function MiembrosGrupo({ grupo, miembros, perfil, onExpulsar, onSalir }: { grupo: Grupo; miembros: Perfil[]; perfil: Perfil; onExpulsar: (id: string) => Promise<void>; onSalir: () => Promise<void> }) {
  const admin = grupo.admin_id === perfil.id;
  return <section className="rounded-card bg-white p-5 shadow-suave"><h2 className="text-xl font-black">Miembros</h2><div className="mt-4 grid gap-3" role="list">{miembros.map((m) => <div key={m.id} className="flex items-center justify-between rounded-control bg-crema p-3"><span className="font-semibold">{m.nombre} {m.id === grupo.admin_id ? "(admin)" : ""}</span>{admin && m.id !== perfil.id && <Button variant="danger" onClick={() => onExpulsar(m.id)}>Expulsar</Button>}</div>)}</div>{!admin && <Button className="mt-4" variant="danger" onClick={onSalir}>Salir del grupo</Button>}</section>;
}
