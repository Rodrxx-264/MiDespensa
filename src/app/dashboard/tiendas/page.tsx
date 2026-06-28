"use client";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useGrupo } from "@/hooks/useGrupo";
import { usePriceHistory } from "@/hooks/usePriceHistory";
import { formatoFecha, formatoQ } from "@/lib/utils";

export default function TiendasPage() {
  const { grupo } = useGrupo(); const { history } = usePriceHistory(grupo?.id); const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const filtered = history.filter((h) => !query || h.product_name.toLowerCase().includes(query.toLowerCase()) || h.normalized_product_name.includes(query.toLowerCase()));
    const map = new Map<string, typeof history>(); filtered.forEach((h) => { const key = `${h.normalized_product_name}|${h.store ?? "Sin tienda"}`; map.set(key, [...(map.get(key) ?? []), h]); });
    return Array.from(map.entries()).map(([key, items]) => { const [name, store] = key.split("|"); const avg = items.reduce((s, i) => s + Number(i.price), 0) / items.length; const last = items[items.length - 1]; return { name, store, avg, last: Number(last.price), count: items.length, date: last.purchased_at }; }).sort((a, b) => a.avg - b.avg);
  }, [history, query]);
  const cheapest = rows[0]?.store;
  return <section className="space-y-4"><div className="surface rounded-[28px] p-5"><p className="eyebrow">Según tu historial</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">Comparador de tiendas</h1><p className="mt-2 text-tinta/60">Compara precios solo con tus compras registradas.</p></div><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto"/>{rows.length ? <div className="grid gap-2">{rows.map((row) => <article key={`${row.name}-${row.store}`} className="panel rounded-[22px] p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-black capitalize">{row.name}</h2><p className="text-sm text-tinta/60">{row.store}</p></div>{row.store === cheapest && <span className="rounded-[12px] bg-naranja px-2 py-1 text-xs font-black text-tinta">Más barato según tu historial</span>}</div><p className="metric mt-2 text-xl font-black">Promedio {formatoQ.format(row.avg)}</p><p className="text-sm text-tinta/60">Último {formatoQ.format(row.last)} · {row.count} registros · {formatoFecha.format(new Date(row.date))}</p></article>)}</div> : <p className="panel rounded-[22px] p-4 text-tinta/60">Todavía no hay suficientes compras para comparar precios. Cuando registres precios reales, aquí verás qué tiendas te convienen según tu historial.</p>}</section>;
}
