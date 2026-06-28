"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { useHistorial } from "@/hooks/useHistorial";
import { Button } from "@/components/ui/Button";
import { formatoFecha, formatoQ } from "@/lib/utils";
import { DetalleListaCerrada } from "./DetalleListaCerrada";

export function ListaHistorial() { const { grupo } = useGrupo(); const h = useHistorial(grupo?.id); return <section className="space-y-4"><div className="surface rounded-[32px] p-6"><p className="eyebrow">Archivo</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">Historial</h1><p className="mt-2 text-tinta/60">Revisa compras cerradas y compara estimados contra gastos reales.</p></div>{h.listas.map((l) => <article key={l.id} className="panel rounded-[28px] p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-black tracking-[-.04em]">{l.nombre}</h2><p className="text-tinta/60">{formatoFecha.format(new Date(l.completada_at ?? l.created_at))} · Total real <b className="metric text-tinta">{formatoQ.format(Number(l.total_real ?? 0))}</b></p></div><Button variant="secondary" onClick={() => h.detalle(l.id)}>Ver detalle</Button></div>{h.productos[l.id] && <DetalleListaCerrada productos={h.productos[l.id]}/>}<Button className="mt-3" variant="ghost" onClick={() => alert("Copia los productos desde la lista activa usando Supabase RPC en producción.")}>Reutilizar esta lista</Button></article>)}{!h.listas.length && <p className="panel rounded-[28px] p-5">Aún no hay listas cerradas.</p>}</section>; }
