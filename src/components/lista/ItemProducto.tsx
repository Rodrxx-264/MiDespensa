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

export function ItemProducto({ producto, onUpdate, onDelete }: { producto: Producto; onUpdate: (id: string, p: Partial<Producto>) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [open, setOpen] = useState(false); const [precio, setPrecio] = useState(producto.precio_real ?? producto.precio_estimado ?? 0); const [tienda, setTienda] = useState(producto.tienda_compra ?? producto.tienda_sugerida ?? "");
  async function comprar() { await onUpdate(producto.id, { estado: "comprado", precio_real: precio, tienda_compra: tienda }); setOpen(false); }
  return <article className={`rounded-card border border-tinta/10 bg-white p-4 shadow-sm ${producto.estado === "comprado" ? "line-through-soft" : ""}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black">{producto.nombre}</h3><p className="text-sm text-tinta/65">{producto.cantidad} {producto.unidad} · {producto.agregado_por_nombre ?? "Sin autor"}</p><p className="text-sm">{producto.precio_estimado ? formatoQ.format(producto.precio_estimado) : "Sin precio"} {producto.tienda_sugerida ? `en ${producto.tienda_sugerida}` : ""}</p></div><div className="flex gap-2"><Button aria-label={`Marcar ${producto.nombre} como comprado`} variant="secondary" onClick={() => setOpen(true)}><Check aria-hidden="true" size={18}/></Button><AgregarProducto producto={producto} onGuardar={(p) => onUpdate(producto.id, p)}/><Button aria-label={`Eliminar ${producto.nombre}`} variant="danger" onClick={() => onDelete(producto.id)}><Trash2 aria-hidden="true" size={18}/></Button></div></div><Modal open={open} onOpenChange={setOpen} title="Marcar como comprado"><div className="grid gap-3"><Input type="number" min="0" step="0.01" value={precio} onChange={(e) => setPrecio(Number(e.target.value))}/><Select value={tienda} onChange={(e) => setTienda(e.target.value)}><option value="">Tienda donde se compró</option>{SUPERMERCADOS.map((s) => <option key={s}>{s}</option>)}</Select><Button onClick={comprar}>Confirmar compra</Button></div></Modal></article>;
}
