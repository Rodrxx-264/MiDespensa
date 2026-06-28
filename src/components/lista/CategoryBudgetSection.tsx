"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatoQ } from "@/lib/utils";
import { getCategoryBudgetRows } from "@/lib/shopping/category-budgets";
import { useCategoryBudgets } from "@/hooks/useCategoryBudgets";
import type { Producto } from "@/types";

export function CategoryBudgetSection({ listId, productos }: { listId: string; productos: Producto[] }) {
  const { budgets, setBudget } = useCategoryBudgets(listId); const [editing, setEditing] = useState<string | null>(null); const [value, setValue] = useState(0); const rows = getCategoryBudgetRows(productos, budgets);
  if (!rows.length) return <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><h2 className="font-black">Presupuesto por categoría</h2><p className="mt-2 text-sm text-[var(--muted)]">Agrega productos para definir límites por categoría.</p></section>;
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><h2 className="font-black tracking-[-.03em]">Presupuesto por categoría</h2><div className="mt-3 grid gap-2">{rows.map((row) => <article key={row.category} className="rounded-[18px] bg-[var(--surface)] p-3"><div className="flex items-center justify-between gap-3"><div><h3 className="font-black">{row.category}</h3><p className="text-sm text-[var(--muted)]">{formatoQ.format(row.estimated)} / {row.budget ? formatoQ.format(row.budget) : "Sin límite"}</p></div><span className={`rounded-[12px] px-2 py-1 text-xs font-black ${row.state === "over" ? "bg-[#8b3f2f] text-white" : row.state === "warn" ? "bg-[var(--accent)] text-[var(--ink)]" : "bg-[var(--jade)] text-[var(--ink)]"}`}>{row.budget ? (row.difference >= 0 ? `Quedan ${formatoQ.format(row.difference)}` : `Pasado ${formatoQ.format(Math.abs(row.difference))}`) : "Editar"}</span></div>{editing === row.category ? <div className="mt-2 flex gap-2"><Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))}/><Button onClick={() => { void setBudget(row.category, value); setEditing(null); }}>Guardar</Button></div> : <Button className="mt-2" variant="ghost" onClick={() => { setEditing(row.category); setValue(row.budget); }}>Editar presupuesto</Button>}</article>)}</div></section>;
}
