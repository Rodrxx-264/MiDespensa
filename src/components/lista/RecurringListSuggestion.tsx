"use client";
import { Button } from "@/components/ui/Button";
import { useGrupo } from "@/hooks/useGrupo";
import { usePriceHistory } from "@/hooks/usePriceHistory";
import { suggestRecurringProducts } from "@/lib/shopping/recurring-lists";
import type { Producto } from "@/types";

export function RecurringListSuggestion({ onAgregar }: { onAgregar: (p: Partial<Producto>) => Promise<void> }) {
  const { grupo } = useGrupo(); const { history } = usePriceHistory(grupo?.id); const suggestions = suggestRecurringProducts(history).slice(0, 5);
  if (!suggestions.length) return <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><h2 className="font-black">Lista sugerida</h2><p className="mt-2 text-sm text-[var(--muted)]">Cuando cierres algunas listas, aquí aparecerán productos frecuentes.</p></section>;
  async function addAll() { for (const item of suggestions) await onAgregar({ nombre: item.name, categoria: item.category, cantidad: item.suggestedQuantity, precio_estimado: item.estimatedPrice, priority: item.priority, unidad: "unidad", estado: "pendiente" }); }
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><p className="eyebrow">Recurrente</p><h2 className="mt-1 text-xl font-black tracking-[-.04em]">Lista sugerida para esta semana</h2><p className="mt-2 text-sm text-[var(--muted)]">Basada en tus compras frecuentes.</p><ul className="mt-3 grid gap-2">{suggestions.map((item) => <li key={item.normalizedName} className="rounded-[16px] bg-[var(--surface)] p-3 text-sm"><b>{item.name}</b><span className="block text-[var(--muted)]">{item.reason}</span></li>)}</ul><Button className="mt-3 w-full" onClick={addAll}>Crear lista con estos productos</Button></section>;
}
