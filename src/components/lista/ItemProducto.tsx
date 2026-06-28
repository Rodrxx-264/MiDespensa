"use client";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatoQ } from "@/lib/utils";
import { SUPERMERCADOS } from "@/lib/constants";
import type { Producto } from "@/types";
import { AgregarProducto } from "./AgregarProducto";
import { priorityLabel } from "./PrioritySelector";

export function ItemProducto({ producto, onUpdate, onDelete }: { producto: Producto; onUpdate: (id: string, p: Partial<Producto>) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [open, setOpen] = useState(false); const [precio, setPrecio] = useState(producto.precio_real ?? producto.precio_estimado ?? 0); const [tienda, setTienda] = useState(producto.tienda_compra ?? producto.tienda_sugerida ?? "");
  async function comprar() { await onUpdate(producto.id, { estado: "comprado", precio_real: precio, tienda_compra: tienda }); setOpen(false); }
  return <article className={`rounded-[22px] border border-tinta/10 bg-white/65 p-3 shadow-sm transition hover:bg-white/85 md:rounded-3xl md:p-4 ${producto.estado === "comprado" || producto.status === "not_found" ? "line-through-soft" : ""}`}><div className="grid gap-3"><div><div className="flex items-start justify-between gap-2"><h3 className="text-lg font-black leading-tight tracking-[-.03em]">{producto.substitute_name || producto.nombre}</h3><span className="rounded-[10px] bg-tinta/10 px-2 py-1 text-[11px] font-black text-tinta/70">{producto.status === "not_found" ? "No encontrado" : priorityLabel(producto.priority)}</span></div><p className="mt-1 text-sm text-tinta/55">{producto.cantidad} {producto.unidad} · {producto.agregado_por_nombre ?? "Sin autor"}</p><p className="mt-1 text-sm font-semibold text-tinta/75">{producto.precio_estimado ? formatoQ.format(producto.precio_estimado) : "Sin precio"} {producto.tienda_sugerida ? `en ${producto.tienda_sugerida}` : ""}</p>{producto.substitute_name && <p className="mt-1 text-xs text-tinta/50">Original: {producto.nombre}</p>}</div><div className="grid grid-cols-[1fr_auto_auto] gap-2"><Button aria-label={`Marcar ${producto.nombre} como comprado`} variant="secondary" onClick={() => setOpen(true)}><span className="inline-flex items-center justify-center gap-2"><Check aria-hidden="true" size={18}/> Comprar</span></Button><AgregarProducto producto={producto} onGuardar={(p) => onUpdate(producto.id, p)}/><Button aria-label={`Eliminar ${producto.nombre}`} variant="danger" onClick={() => onDelete(producto.id)}><Trash2 aria-hidden="true" size={18}/></Button></div></div><Modal open={open} onOpenChange={setOpen} title="Marcar como comprado"><div className="grid gap-3"><label className="grid gap-1 text-sm font-semibold text-tinta/65">Precio real<Input type="number" min="0" step="0.01" value={precio} onChange={(e) => setPrecio(Number(e.target.value))}/></label><label className="grid gap-1 text-sm font-semibold text-tinta/65">Tienda<Select value={tienda} onChange={(e) => setTienda(e.target.value)}><option value="">Tienda donde se compró</option>{SUPERMERCADOS.map((s) => <option key={s}>{s}</option>)}</Select></label><Button onClick={comprar}>Confirmar compra</Button></div></Modal></article>;
}
