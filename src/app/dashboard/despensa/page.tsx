"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { CATEGORIAS, UNIDADES } from "@/lib/constants";
import { useGrupo } from "@/hooks/useGrupo";
import { usePantry } from "@/hooks/usePantry";

export default function DespensaPage() {
  const { grupo } = useGrupo();
  const pantry = usePantry(grupo?.id);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Otros");
  const [unit, setUnit] = useState("unidad");
  const [quantity, setQuantity] = useState(1);

  const items = pantry.items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.category?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      <div><p className="eyebrow">Inventario</p><h1 className="mt-1 text-2xl font-black">Despensa</h1></div>

      <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); void pantry.addItem({ name, category, unit, quantity }); setName(""); }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Producto en casa" required />
        <div className="grid grid-cols-3 gap-2">
          <Input type="number" min="0" step="0.01" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>{UNIDADES.map((u) => <option key={u}>{u}</option>)}</Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</Select>
        </div>
        <Button className="w-full">Agregar</Button>
      </form>

      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en despensa" />

      <div className="space-y-2">
        {items.length ? items.map((item) => (
          <article key={item.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p className="text-sm text-[var(--muted)]">{item.quantity} {item.unit} · {item.category}</p>
              </div>
              <Button variant={item.low_stock ? "primary" : "secondary"} onClick={() => pantry.updateItem(item.id, { low_stock: !item.low_stock })}>
                {item.low_stock ? "Bajo" : "Stock"}
              </Button>
            </div>
            <Button className="mt-2" variant="danger" onClick={() => pantry.deleteItem(item.id)}>Eliminar</Button>
          </article>
        )) : <p className="text-sm text-[var(--muted)]">No hay productos en despensa.</p>}
      </div>
    </div>
  );
}
