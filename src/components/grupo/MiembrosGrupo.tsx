"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Grupo, Perfil } from "@/types";

export function MiembrosGrupo({ grupo, miembros, perfil, onExpulsar, onSalir }: { grupo: Grupo; miembros: Perfil[]; perfil: Perfil; onExpulsar: (id: string) => Promise<void>; onSalir: () => Promise<void> }) {
  const admin = grupo.admin_id === perfil.id;
  const [saliendo, setSaliendo] = useState(false);
  async function salir() {
    if (admin && !confirm("Si salís, el grupo quedará sin admin. ¿Querés salir de todas formas?")) return;
    setSaliendo(true);
    await onSalir();
    setSaliendo(false);
  }
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <p className="eyebrow">Acceso</p>
      <h2 className="mt-2 text-2xl font-black tracking-[-.05em]">Miembros</h2>
      <div className="mt-4 grid gap-3" role="list">
        {miembros.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-2xl bg-[var(--surface)] p-3">
            <span className="font-semibold">{m.nombre} {m.id === grupo.admin_id ? "(admin)" : ""}</span>
            {admin && m.id !== perfil.id && <Button variant="danger" onClick={() => onExpulsar(m.id)}>Expulsar</Button>}
          </div>
        ))}
      </div>
      <Button className="mt-4 w-full" variant="danger" onClick={salir} disabled={saliendo}>Salir del grupo</Button>
    </section>
  );
}
