"use client";
import { useGrupo } from "@/hooks/useGrupo";
import { usePriceHistory } from "@/hooks/usePriceHistory";
import { formatoQ } from "@/lib/utils";

export function PriceHistoryHighlights() {
  const { grupo } = useGrupo(); const { history } = usePriceHistory(grupo?.id);
  const grouped = new Map<string, typeof history>();
  history.forEach((h) => grouped.set(h.normalized_product_name, [...(grouped.get(h.normalized_product_name) ?? []), h]));
  const rows = Array.from(grouped.entries()).filter(([, items]) => items.length >= 2).map(([name, items]) => {
    const first = Number(items[0].price); const last = Number(items[items.length - 1].price); return { name, first, last, change: first ? ((last - first) / first) * 100 : 0 };
  });
  const up = rows.filter((r) => r.change > 0).sort((a, b) => b.change - a.change).slice(0, 3);
  const deals = rows.filter((r) => r.change < 0).sort((a, b) => a.change - b.change).slice(0, 3);
  return <section className="grid gap-4"><Card title="Productos que más subieron" rows={up}/><Card title="Mejores precios recientes" rows={deals}/></section>;
}

function Card({ title, rows }: { title: string; rows: { name: string; first: number; last: number; change: number }[] }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="font-bold">{title}</h2>
      {rows.length ? (
        <div className="mt-3 grid gap-2">
          {rows.map((row) => (
            <div key={row.name} className="rounded-lg bg-[var(--bg)] p-3">
              <p className="font-bold capitalize">{row.name}</p>
              <p className="text-sm text-[var(--muted)]">Antes {formatoQ.format(row.first)} · Último {formatoQ.format(row.last)} · {Math.abs(row.change).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--muted)]">Todavía no hay suficiente historial.</p>
      )}
    </div>
  );
}
