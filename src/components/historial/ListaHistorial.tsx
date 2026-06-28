"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { useHistorial } from "@/hooks/useHistorial";
import { Button } from "@/components/ui/Button";
import { formatoFecha, formatoQ } from "@/lib/utils";
import { DetalleListaCerrada } from "./DetalleListaCerrada";

export function ListaHistorial() { const { grupo } = useGrupo(); const h = useHistorial(grupo?.id); return <section className="space-y-4"><h1 className="text-3xl font-black">Historial</h1>{h.listas.map((l) => <article key={l.id} className="rounded-card bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-black">{l.nombre}</h2><p>{formatoFecha.format(new Date(l.completada_at ?? l.created_at))} · Total real {formatoQ.format(Number(l.total_real ?? 0))}</p></div><Button variant="secondary" onClick={() => h.detalle(l.id)}>Ver detalle</Button></div>{h.productos[l.id] && <DetalleListaCerrada productos={h.productos[l.id]}/>}<Button className="mt-3" variant="ghost" onClick={() => alert("Copia los productos desde la lista activa usando Supabase RPC en producción.")}>Reutilizar esta lista</Button></article>)}{!h.listas.length && <p className="rounded-card bg-white p-5">Aún no hay listas cerradas.</p>}</section>; }
