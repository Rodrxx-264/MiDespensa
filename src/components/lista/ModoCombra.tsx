"use client";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SUPERMERCADOS } from "@/lib/constants";
import { formatoQ } from "@/lib/utils";
import { readLocalState } from "@/lib/local";
import { isLocalMode } from "@/lib/local";
import { createClient } from "@/lib/supabase/client";
import { normalizeProductName } from "@/lib/shopping/normalize";
import { calculatePriceInsight } from "@/lib/shopping/price-insights";
import type { PriceHistoryEntry, Producto } from "@/types";

export function ModoCombra({ productos, onUpdate, onClose }: { productos: Producto[]; onUpdate: (id: string, p: Partial<Producto>) => Promise<void>; onClose: () => void }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [precioReal, setPrecioReal] = useState(0);
  const [tienda, setTienda] = useState("");
  const [similar, setSimilar] = useState(false);
  const [substituteName, setSubstituteName] = useState("");
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const pending = useMemo(() => productos.filter((p) => p.estado === "pendiente" && (p.status ?? "pending") === "pending"), [productos]);
  const realGastado = productos.reduce((s, p) => s + Number(p.precio_real ?? 0) * Number(p.cantidad ?? 1), 0);
  const estimadoTotal = productos.reduce((s, p) => s + Number(p.precio_estimado ?? 0) * Number(p.cantidad ?? 1), 0);
  const insight = calculatePriceInsight(history, precioReal);
  function abrirCompra(p: Producto) {
    setProducto(p);
    setPrecioReal(Number(p.precio_real ?? p.precio_estimado ?? 0));
    setTienda(p.tienda_compra ?? p.tienda_sugerida ?? "");
    setSubstituteName(p.substitute_name ?? "");
    setSimilar(false);
  }
  async function confirmarCompra() {
    if (!producto) return;
    await onUpdate(producto.id, { estado: "comprado", status: "purchased", precio_real: precioReal, tienda_compra: tienda, substitute_name: similar ? substituteName : producto.substitute_name });
    abrirSiguiente(producto.id);
  }
  async function noEncontrado() { if (!producto) return; await onUpdate(producto.id, { status: "not_found", purchase_note: "No encontrado" }); abrirSiguiente(producto.id); }
  async function quitar() { if (!producto) return; await onUpdate(producto.id, { status: "not_found", purchase_note: "Quitado en compra" }); abrirSiguiente(producto.id); }
  function saltar() { if (producto) abrirSiguiente(producto.id); }
  function abrirSiguiente(currentId: string) { const index = pending.findIndex((p) => p.id === currentId); const next = pending[index + 1]; if (next) abrirCompra(next); else setProducto(null); }
  useEffect(() => { if (!producto) return; void cargarHistorial(producto); }, [producto?.id]);
  async function cargarHistorial(p: Producto) { const normalized = normalizeProductName(p.substitute_name || p.nombre); if (isLocalMode()) { setHistory(readLocalState().priceHistory.filter((h) => h.normalized_product_name === normalized)); return; } const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; const { data: perfil } = await supabase.from("perfiles").select("grupo_id").eq("id", user.id).single(); if (!perfil?.grupo_id) return; const { data } = await supabase.from("historial_precios").select("id, grupo_id, list_id, producto_nombre, normalized_product_name, tienda, store, precio, quantity, unit, purchased_at, fecha_consulta").eq("grupo_id", perfil.grupo_id).eq("normalized_product_name", normalized).order("purchased_at", { ascending: true }); setHistory((data ?? []).map((h: any) => ({ id: h.id, group_id: h.grupo_id, list_id: h.list_id, product_name: h.producto_nombre, normalized_product_name: h.normalized_product_name, store: h.store ?? h.tienda, price: h.precio, quantity: h.quantity ?? 1, unit: h.unit, purchased_at: h.purchased_at ?? h.fecha_consulta }))); }
  return <section className="fixed inset-0 z-50 overflow-auto p-4"><div className="mx-auto max-w-xl"><div className="sticky top-2 z-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><div className="flex items-center justify-between"><div><p className="eyebrow">Supermercado</p><h1 className="text-3xl font-black tracking-[-.06em]">Modo compra</h1></div><Button variant="secondary" onClick={onClose} aria-label="Salir del modo compra"><X aria-hidden="true"/></Button></div><p className="metric mt-3 text-lg font-black">{formatoQ.format(realGastado)} / {formatoQ.format(estimadoTotal)} · {realGastado <= estimadoTotal ? `Quedan ${formatoQ.format(estimadoTotal - realGastado)}` : `Te pasaste por ${formatoQ.format(realGastado - estimadoTotal)}`}</p></div><div className="mt-4 grid gap-3">{pending.map((p) => <button key={p.id} onClick={() => abrirCompra(p)} className="touch rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 text-left text-2xl font-black tracking-[-.04em]"><span className="mr-3 inline-grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--ink)]" aria-hidden="true"/> {p.nombre}<small className="block pl-14 text-base font-normal text-[var(--muted)]">{p.cantidad} {p.unidad} · {p.precio_estimado ? formatoQ.format(p.precio_estimado) : "Sin precio"}</small></button>)}</div></div><Modal open={!!producto} onOpenChange={(open) => !open && setProducto(null)} title="Registrar gasto real"><div className="grid gap-3"><div className="rounded-[18px] bg-[var(--surface)] p-3"><h3 className="text-2xl font-black tracking-[-.05em]">{producto?.nombre}</h3><p className="text-sm text-[var(--muted)]">{producto?.cantidad} {producto?.unidad} · estimado {formatoQ.format(Number(producto?.precio_estimado ?? 0))}</p></div><label className="grid gap-1 text-sm font-semibold text-[var(--muted)]">Precio real<Input className="text-3xl font-black" inputMode="decimal" type="number" min="0" step="0.01" value={precioReal} onChange={(e) => setPrecioReal(Number(e.target.value))}/></label>{insight.status !== "none" && <p className={`rounded-[18px] p-3 text-sm font-semibold ${insight.status === "good" ? "bg-[var(--jade)] text-[var(--ink)]" : "bg-[var(--accent)] text-[var(--ink)]"}`}>{insight.message}</p>}<label className="grid gap-1 text-sm font-semibold text-[var(--muted)]">Tienda<Select value={tienda} onChange={(e) => setTienda(e.target.value)}>{SUPERMERCADOS.map((s) => <option key={s}>{s}</option>)}</Select></label><label className="flex items-center gap-2 text-sm text-[var(--muted)]"><input type="checkbox" checked={similar} onChange={(e) => setSimilar(e.target.checked)}/>Es un sustituto</label>{similar && <label className="grid gap-1 text-sm font-semibold text-[var(--muted)]">Nombre real<Input value={substituteName} onChange={(e) => setSubstituteName(e.target.value)}/></label>}<div className="grid grid-cols-3 gap-2"><Button onClick={noEncontrado}>No encontré</Button><Button onClick={quitar}>Quitar</Button><Button onClick={saltar}>Saltar</Button></div><Button onClick={confirmarCompra}>Confirmar</Button></div></Modal></section>;
}
