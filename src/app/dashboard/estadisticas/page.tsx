"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { useEstadisticas } from "@/hooks/useEstadisticas";
import { GraficaGasto } from "@/components/estadisticas/GraficaGasto";
import { ProductosFrecuentes } from "@/components/estadisticas/ProductosFrecuentes";
import { VariacionPrecios } from "@/components/estadisticas/VariacionPrecios";
import { formatoQ } from "@/lib/utils";

export default function EstadisticasPage() { const { grupo } = useGrupo(); const e = useEstadisticas(grupo?.id); const sube = e.comparativa.diferencia > 0; return <section className="space-y-5"><div className="surface rounded-[32px] p-6"><p className="eyebrow">Lectura financiera</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">Estadísticas</h1><p className="mt-2 text-tinta/60">Indicadores simples para entender gasto, frecuencia y tiendas.</p></div><div className="panel rounded-[28px] p-5"><p className="eyebrow">Comparativa entre listas</p><p className={`metric mt-2 text-3xl font-black ${sube ? "text-red-700" : "text-bosque"}`}>{sube ? "↑" : "↓"} {formatoQ.format(Math.abs(e.comparativa.diferencia))} ({Math.abs(e.comparativa.porcentaje).toFixed(1)}%)</p></div><GraficaGasto data={e.gasto}/><div className="grid gap-5 lg:grid-cols-2"><ProductosFrecuentes productos={Object.values(e.productos).flat()}/><VariacionPrecios data={[]}/></div><div className="panel rounded-[28px] p-5"><h2 className="text-xl font-black tracking-[-.04em]">Tiendas favoritas</h2><p className="text-tinta/60">Se calcula automáticamente cuando cierres listas con tiendas de compra.</p></div></section>; }
