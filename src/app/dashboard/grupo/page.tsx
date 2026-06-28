"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { QRGrupo } from "@/components/grupo/QRGrupo";
import { MiembrosGrupo } from "@/components/grupo/MiembrosGrupo";

export default function GrupoPage() { const g = useGrupo(); if (g.loading) return <p>Cargando grupo...</p>; if (!g.grupo || !g.perfil) return <p>No tienes grupo todavía. Vuelve a la lista para crear uno.</p>; return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="rounded-card bg-white p-5 shadow-suave"><p className="text-sm font-bold text-bosque">Grupo familiar</p><h1 className="text-3xl font-black">{g.grupo.nombre}</h1></section><QRGrupo grupo={g.grupo} onRegenerar={g.regenerarQR}/><MiembrosGrupo grupo={g.grupo} miembros={g.miembros} perfil={g.perfil} onExpulsar={g.salir} onSalir={() => g.salir(g.perfil!.id)}/></div>; }
