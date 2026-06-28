"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { useEstadisticas } from "@/hooks/useEstadisticas";
import { GraficaGasto } from "@/components/estadisticas/GraficaGasto";
import { ProductosFrecuentes } from "@/components/estadisticas/ProductosFrecuentes";
import { VariacionPrecios } from "@/components/estadisticas/VariacionPrecios";
import { formatoQ } from "@/lib/utils";

export default function EstadisticasPage() { const { grupo } = useGrupo(); const e = useEstadisticas(grupo?.id); const sube = e.comparativa.diferencia > 0; return <section className="space-y-5"><h1 className="text-3xl font-black">Estadísticas</h1><div className="rounded-card bg-white p-5 shadow-sm"><p className="text-sm font-bold text-bosque">Comparativa entre listas</p><p className={`text-2xl font-black ${sube ? "text-red-700" : "text-bosque"}`}>{sube ? "↑" : "↓"} {formatoQ.format(Math.abs(e.comparativa.diferencia))} ({Math.abs(e.comparativa.porcentaje).toFixed(1)}%)</p></div><GraficaGasto data={e.gasto}/><div className="grid gap-5 lg:grid-cols-2"><ProductosFrecuentes productos={Object.values(e.productos).flat()}/><VariacionPrecios data={[]}/></div><div className="rounded-card bg-white p-5 shadow-sm"><h2 className="text-xl font-black">Tiendas favoritas</h2><p className="text-tinta/70">Se calcula automáticamente cuando cierres listas con tiendas de compra.</p></div></section>; }
