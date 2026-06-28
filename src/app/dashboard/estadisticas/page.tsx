"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { useEstadisticas } from "@/hooks/useEstadisticas";
import { GraficaGasto } from "@/components/estadisticas/GraficaGasto";
import { ProductosFrecuentes } from "@/components/estadisticas/ProductosFrecuentes";
import { VariacionPrecios } from "@/components/estadisticas/VariacionPrecios";
import { PriceHistoryHighlights } from "@/components/estadisticas/PriceHistoryHighlights";
import { formatoQ } from "@/lib/utils";

export default function EstadisticasPage() {
  const { grupo } = useGrupo();
  const e = useEstadisticas(grupo?.id);
  const sube = e.comparativa.diferencia > 0;
  return (
    <div className="space-y-4">
      <div><p className="eyebrow">Lectura financiera</p><h1 className="mt-1 text-2xl font-black">Estadísticas</h1></div>
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
        <p className="text-sm text-[var(--muted)]">Comparativa</p>
        <p className={`mt-1 text-2xl font-bold ${sube ? "text-red-700" : ""}`}>{sube ? "↑" : "↓"} {formatoQ.format(Math.abs(e.comparativa.diferencia))} ({Math.abs(e.comparativa.porcentaje).toFixed(1)}%)</p>
      </div>
      <GraficaGasto data={e.gasto} />
      <PriceHistoryHighlights />
      <div className="grid gap-4">
        <ProductosFrecuentes productos={Object.values(e.productos).flat()} />
        <VariacionPrecios data={[]} />
      </div>
    </div>
  );
}
