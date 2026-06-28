"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Producto } from "@/types";

export function ModoCombra({ productos, onUpdate, onClose }: { productos: Producto[]; onUpdate: (id: string, p: Partial<Producto>) => Promise<void>; onClose: () => void }) {
  return <section className="fixed inset-0 z-50 overflow-auto bg-crema p-5"><div className="mx-auto max-w-xl"><div className="flex items-center justify-between"><h1 className="text-3xl font-black">Modo compra</h1><Button variant="secondary" onClick={onClose} aria-label="Salir del modo compra"><X aria-hidden="true"/></Button></div><div className="mt-6 grid gap-3">{productos.filter((p) => p.estado === "pendiente").map((p) => <button key={p.id} onClick={() => onUpdate(p.id, { estado: "comprado", precio_real: p.precio_estimado })} className="touch rounded-card bg-white p-5 text-left text-2xl font-black shadow-suave"><span className="mr-3 inline-grid h-9 w-9 place-items-center rounded-control border-2 border-bosque" aria-hidden="true"/> {p.nombre}<small className="block text-base font-normal text-tinta/60">{p.cantidad} {p.unidad}</small></button>)}</div></div></section>;
}
