"use client";
import { useState } from "react";
import { CATEGORIAS, SUPERMERCADOS, UNIDADES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Producto } from "@/types";

export function AgregarProducto({ onGuardar, producto }: { onGuardar: (p: Partial<Producto>) => Promise<void>; producto?: Producto }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Producto>>(producto ?? { categoria: "Otros", cantidad: 1, unidad: "unidad", estado: "pendiente" });
  async function submit(e: React.FormEvent) { e.preventDefault(); if (!form.nombre?.trim()) return; await onGuardar(form); setOpen(false); setForm({ categoria: "Otros", cantidad: 1, unidad: "unidad", estado: "pendiente" }); }
  return <><Button onClick={() => setOpen(true)}>{producto ? "Editar" : "+ Agregar producto"}</Button><Modal open={open} onOpenChange={setOpen} title={producto ? "Editar producto" : "Agregar producto"}><form onSubmit={submit} className="grid gap-3"><Input required placeholder="Nombre" value={form.nombre ?? ""} onChange={(e) => setForm({ ...form, nombre: e.target.value })}/><Select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</Select><div className="grid grid-cols-2 gap-3"><Input type="number" min="0.01" step="0.01" value={form.cantidad ?? 1} onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}/><Select value={form.unidad ?? "unidad"} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>{UNIDADES.map((u) => <option key={u}>{u}</option>)}</Select></div><div className="grid grid-cols-2 gap-3"><Input type="number" min="0" step="0.01" placeholder="Precio estimado" value={form.precio_estimado ?? ""} onChange={(e) => setForm({ ...form, precio_estimado: Number(e.target.value) })}/><Select value={form.tienda_sugerida ?? ""} onChange={(e) => setForm({ ...form, tienda_sugerida: e.target.value })}><option value="">Tienda sugerida</option>{SUPERMERCADOS.map((s) => <option key={s}>{s}</option>)}</Select></div><Textarea placeholder="Notas" value={form.notas ?? ""} onChange={(e) => setForm({ ...form, notas: e.target.value })}/><Button type="submit">Guardar producto</Button></form></Modal></>;
}
