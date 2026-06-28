"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { QRGrupo } from "@/components/grupo/QRGrupo";
import { MiembrosGrupo } from "@/components/grupo/MiembrosGrupo";

export default function GrupoPage() { const g = useGrupo(); if (g.loading) return <p className="surface rounded-[28px] p-5">Cargando grupo...</p>; if (!g.grupo || !g.perfil) return <p className="surface rounded-[28px] p-5">No tienes grupo todavía. Vuelve a la lista para crear uno.</p>; return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="surface rounded-[32px] p-6"><p className="eyebrow">Grupo familiar</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">{g.grupo.nombre}</h1><p className="mt-3 text-tinta/60">Gestiona miembros y el código de invitación.</p></section><QRGrupo grupo={g.grupo} onRegenerar={g.regenerarQR}/><MiembrosGrupo grupo={g.grupo} miembros={g.miembros} perfil={g.perfil} onExpulsar={g.salir} onSalir={() => g.salir(g.perfil!.id)}/></div>; }
