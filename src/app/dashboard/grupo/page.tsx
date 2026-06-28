"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGrupo } from "@/hooks/useGrupo";
import { QRGrupo } from "@/components/grupo/QRGrupo";
import { MiembrosGrupo } from "@/components/grupo/MiembrosGrupo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function GrupoPage() {
  const g = useGrupo();
  const router = useRouter();
  const [nuevoGrupo, setNuevoGrupo] = useState("");
  const [codigoUnion, setCodigoUnion] = useState("");

  if (g.loading) return <p className="text-sm text-[var(--muted)]">Cargando...</p>;

  return (
    <div className="space-y-4">
      <div><p className="eyebrow">Grupo</p><h1 className="mt-1 text-2xl font-black">{g.grupo?.nombre ?? "Sin grupo"}</h1></div>

      {g.grupo && g.perfil ? (
        <>
          <QRGrupo grupo={g.grupo} onRegenerar={g.regenerarQR} />
          <MiembrosGrupo grupo={g.grupo} miembros={g.miembros} perfil={g.perfil} onExpulsar={g.salir} onSalir={() => g.salir(g.perfil!.id)} />
        </>
      ) : (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--muted)]">No tenés grupo todavía. Crea uno nuevo o unite a uno existente.</p>
        </div>
      )}

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="font-bold">Crear nuevo grupo</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Si ya estás en un grupo, saldrás del actual para unirte al nuevo.</p>
        {g.error && <p className="mt-2 text-sm text-red-700">{g.error}</p>}
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void g.crearGrupo(nuevoGrupo || "Mi grupo"); setNuevoGrupo(""); }}>
          <Input value={nuevoGrupo} onChange={(e) => setNuevoGrupo(e.target.value)} placeholder="Nombre del grupo" />
          <Button>Crear</Button>
        </form>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="font-bold">Unirse a un grupo</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Si ya estás en un grupo, saldrás del actual para unirte al nuevo.</p>
        <div className="mt-3 flex gap-2">
          <Input value={codigoUnion} onChange={(e) => setCodigoUnion(e.target.value)} placeholder="Código del grupo" />
          <Button variant="secondary" disabled={!codigoUnion} onClick={() => { void g.unirse(codigoUnion); setCodigoUnion(""); }}>Unirse</Button>
        </div>
        <Button className="mt-3 w-full" variant="ghost" onClick={() => router.push("/unirse")}>Escanear QR</Button>
      </section>
    </div>
  );
}
