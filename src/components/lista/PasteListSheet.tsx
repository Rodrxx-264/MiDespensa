"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { CATEGORIAS } from "@/lib/constants";
import { parseShoppingText } from "@/lib/shopping/parse-list";
import type { ParsedProduct, Producto, ProductPriority } from "@/types";
import { PrioritySelector, priorityLabel } from "./PrioritySelector";

export function PasteListSheet({ onAgregar }: { onAgregar: (p: Partial<Producto>) => Promise<void> }) {
  const [open, setOpen] = useState(false); const [text, setText] = useState(""); const [items, setItems] = useState<ParsedProduct[]>([]);
  function parse() { setItems(parseShoppingText(text)); }
  async function addAll() { for (const item of items) await onAgregar({ nombre: item.name, cantidad: item.quantity, unidad: item.unit ?? "unidad", categoria: item.category ?? "Otros", priority: item.priority ?? "important", estado: "pendiente" }); setOpen(false); setText(""); setItems([]); }
  return <><Button variant="secondary" onClick={() => setOpen(true)}>Pegar lista</Button><Modal open={open} onOpenChange={setOpen} title="Pegar lista"><div className="grid gap-3"><Textarea rows={6} placeholder="Pega aquí tu lista de WhatsApp" value={text} onChange={(e) => setText(e.target.value)}/><Button onClick={parse}>Detectar productos</Button>{items.length > 0 && <div className="grid gap-2"><p className="text-sm font-black">Detectamos {items.length} productos</p>{items.map((item, index) => <div key={index} className="rounded-[18px] bg-white/65 p-3"><div className="grid grid-cols-[1fr_80px] gap-2"><Input value={item.name} onChange={(e) => setItems(items.map((x, i) => i === index ? { ...x, name: e.target.value } : x))}/><Input type="number" value={item.quantity} onChange={(e) => setItems(items.map((x, i) => i === index ? { ...x, quantity: Number(e.target.value) } : x))}/></div><div className="mt-2 grid gap-2"><Select value={item.category ?? "Otros"} onChange={(e) => setItems(items.map((x, i) => i === index ? { ...x, category: e.target.value } : x))}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</Select><PrioritySelector value={item.priority} onChange={(priority: ProductPriority) => setItems(items.map((x, i) => i === index ? { ...x, priority } : x))}/><p className="text-xs text-tinta/55">{item.quantity} · {item.category} · {priorityLabel(item.priority)}</p></div></div>)}</div>}<Button disabled={!items.length} onClick={addAll}>Agregar productos a la lista</Button></div></Modal></>;
}
