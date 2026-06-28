"use client";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useGrupo } from "@/hooks/useGrupo";
import { usePriceHistory } from "@/hooks/usePriceHistory";
import { formatoQ } from "@/lib/utils";

export default function TiendasPage() {
  const { grupo } = useGrupo();
  const { history } = usePriceHistory(grupo?.id);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const f = history.filter((h) => !query || h.product_name.toLowerCase().includes(query.toLowerCase()));
    const map = new Map<string, typeof history>();
    f.forEach((h) => { const k = `${h.normalized_product_name}|${h.store ?? ""}`; map.set(k, [...(map.get(k) ?? []), h]); });
    return Array.from(map.entries()).map(([k, items]) => {
      const [name, store] = k.split("|");
      const avg = items.reduce((s, i) => s + Number(i.price), 0) / items.length;
      return { name, store, avg, last: Number(items[items.length - 1].price), count: items.length };
    }).sort((a, b) => a.avg - b.avg);
  }, [history, query]);

  return (
    <div className="space-y-4">
      <div><p className="eyebrow">Según tu historial</p><h1 className="mt-1 text-2xl font-black">Comparador</h1></div>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto" />
      <div className="space-y-2">
        {rows.length ? rows.map((row) => (
          <article key={`${row.name}-${row.store}`} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold capitalize">{row.name}</h2>
                <p className="text-sm text-[var(--muted)]">{row.store}</p>
              </div>
              {row.store === rows[0]?.store && <span className="rounded-lg bg-[var(--accent)] px-2 py-1 text-xs font-bold">Más barato</span>}
            </div>
            <p className="mt-2 text-lg font-bold">{formatoQ.format(row.avg)} promedio</p>
            <p className="text-sm text-[var(--muted)]">{row.count} registros · último {formatoQ.format(row.last)}</p>
          </article>
        )) : <p className="text-sm text-[var(--muted)]">Registrá precios reales en tus listas para ver comparativas.</p>}
      </div>
    </div>
  );
}
