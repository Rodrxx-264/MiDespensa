"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Producto } from "@/types";

export function ModoCombra({ productos, onUpdate, onClose }: { productos: Producto[]; onUpdate: (id: string, p: Partial<Producto>) => Promise<void>; onClose: () => void }) {
  return <section className="fixed inset-0 z-50 overflow-auto p-5"><div className="mx-auto max-w-xl"><div className="surface flex items-center justify-between rounded-[28px] p-4"><div><p className="eyebrow">Supermercado</p><h1 className="text-3xl font-black tracking-[-.06em]">Modo compra</h1></div><Button variant="secondary" onClick={onClose} aria-label="Salir del modo compra"><X aria-hidden="true"/></Button></div><div className="mt-6 grid gap-3">{productos.filter((p) => p.estado === "pendiente").map((p) => <button key={p.id} onClick={() => onUpdate(p.id, { estado: "comprado", precio_real: p.precio_estimado })} className="surface touch rounded-[28px] p-5 text-left text-2xl font-black tracking-[-.04em]"><span className="mr-3 inline-grid h-10 w-10 place-items-center rounded-full border-2 border-tinta" aria-hidden="true"/> {p.nombre}<small className="block pl-14 text-base font-normal text-tinta/55">{p.cantidad} {p.unidad}</small></button>)}</div></div></section>;
}
