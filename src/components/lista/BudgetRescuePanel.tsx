"use client";
import { Button } from "@/components/ui/Button";
import { formatoQ } from "@/lib/utils";
import { getBudgetRescueSuggestions } from "@/lib/shopping/budget-rescue";
import type { Lista, Producto } from "@/types";

export function BudgetRescuePanel({ lista, productos, onUpdate, onDelete }: { lista: Lista; productos: Producto[]; onUpdate: (id: string, data: Partial<Producto>) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const result = getBudgetRescueSuggestions({ products: productos, maxBudget: lista.presupuesto_maximo });
  if (!lista.presupuesto_maximo || result.excess <= 0) return null;
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><p className="eyebrow">No me alcanza</p><h2 className="mt-2 text-2xl font-black tracking-[-.05em]">Te estás pasando por {formatoQ.format(result.excess)}</h2><p className="mt-2 text-sm text-[var(--muted)]">Podrías ajustar estos productos y quedar cerca de {formatoQ.format(result.projectedTotal)}.</p><div className="mt-4 grid gap-3">{result.suggestions.map(({ product, savings }) => <article key={product.id} className="rounded-[18px] bg-[var(--surface)] p-3"><div className="flex items-start justify-between gap-3"><div><h3 className="font-black">{product.nombre}</h3><p className="text-sm text-[var(--muted)]">Ahorras {formatoQ.format(savings)}</p></div><Button variant="danger" onClick={() => onDelete(product.id)}>Quitar</Button></div><div className="mt-2 grid grid-cols-2 gap-2"><Button variant="secondary" disabled={Number(product.cantidad) <= 1} onClick={() => onUpdate(product.id, { cantidad: Number(product.cantidad) - 1 })}>Reducir 1</Button><Button variant="secondary" onClick={() => onUpdate(product.id, { priority: "optional" })}>Hacer opcional</Button></div></article>)}</div></section>;
}
