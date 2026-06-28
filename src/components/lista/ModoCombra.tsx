"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SUPERMERCADOS } from "@/lib/constants";
import type { Producto } from "@/types";

export function ModoCombra({ productos, onUpdate, onClose }: { productos: Producto[]; onUpdate: (id: string, p: Partial<Producto>) => Promise<void>; onClose: () => void }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [precioReal, setPrecioReal] = useState(0);
  const [tienda, setTienda] = useState("");
  function abrirCompra(p: Producto) {
    setProducto(p);
    setPrecioReal(Number(p.precio_real ?? p.precio_estimado ?? 0));
    setTienda(p.tienda_compra ?? p.tienda_sugerida ?? "");
  }
  async function confirmarCompra() {
    if (!producto) return;
    await onUpdate(producto.id, { estado: "comprado", precio_real: precioReal, tienda_compra: tienda });
    setProducto(null);
  }
  return <section className="fixed inset-0 z-50 overflow-auto p-5"><div className="mx-auto max-w-xl"><div className="surface flex items-center justify-between rounded-[28px] p-4"><div><p className="eyebrow">Supermercado</p><h1 className="text-3xl font-black tracking-[-.06em]">Modo compra</h1></div><Button variant="secondary" onClick={onClose} aria-label="Salir del modo compra"><X aria-hidden="true"/></Button></div><div className="mt-6 grid gap-3">{productos.filter((p) => p.estado === "pendiente").map((p) => <button key={p.id} onClick={() => abrirCompra(p)} className="surface touch rounded-[28px] p-5 text-left text-2xl font-black tracking-[-.04em]"><span className="mr-3 inline-grid h-10 w-10 place-items-center rounded-full border-2 border-tinta" aria-hidden="true"/> {p.nombre}<small className="block pl-14 text-base font-normal text-tinta/55">{p.cantidad} {p.unidad}</small></button>)}</div></div><Modal open={!!producto} onOpenChange={(open) => !open && setProducto(null)} title="Registrar gasto real"><div className="grid gap-3"><p className="text-sm text-tinta/60">Ingresa cuánto pagaste realmente para comparar contra el presupuesto estimado.</p><label className="grid gap-1 text-sm font-semibold text-tinta/65">Precio real<Input type="number" min="0" step="0.01" value={precioReal} onChange={(e) => setPrecioReal(Number(e.target.value))}/></label><label className="grid gap-1 text-sm font-semibold text-tinta/65">Tienda<Select value={tienda} onChange={(e) => setTienda(e.target.value)}><option value="">Tienda donde se compró</option>{SUPERMERCADOS.map((s) => <option key={s}>{s}</option>)}</Select></label><Button onClick={confirmarCompra}>Confirmar compra</Button></div></Modal></section>;
}
