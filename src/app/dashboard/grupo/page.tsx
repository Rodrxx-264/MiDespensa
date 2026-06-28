"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { QRGrupo } from "@/components/grupo/QRGrupo";
import { MiembrosGrupo } from "@/components/grupo/MiembrosGrupo";

export default function GrupoPage() {
  const g = useGrupo();
  if (g.loading) return <p className="text-sm text-[var(--muted)]">Cargando...</p>;
  if (!g.grupo || !g.perfil) return <p className="text-sm text-[var(--muted)]">No tenés grupo todavía.</p>;
  return (
    <div className="space-y-4">
      <div><p className="eyebrow">Grupo</p><h1 className="mt-1 text-2xl font-black">{g.grupo.nombre}</h1></div>
      <QRGrupo grupo={g.grupo} onRegenerar={g.regenerarQR} />
      <MiembrosGrupo grupo={g.grupo} miembros={g.miembros} perfil={g.perfil} onExpulsar={g.salir} onSalir={() => g.salir(g.perfil!.id)} />
    </div>
  );
}
