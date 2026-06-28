"use client";
import { useState } from "react";
import { useGrupo } from "@/hooks/useGrupo";
import { useListaActiva } from "@/hooks/useListaActiva";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AgregarProducto } from "./AgregarProducto";
import { ItemProducto } from "./ItemProducto";
import { ResumenPresupuesto } from "./ResumenPresupuesto";
import { FiltroCategoria } from "./FiltroCategoria";
import { ModoCombra } from "./ModoCombra";
import { BudgetRescuePanel } from "./BudgetRescuePanel";
import { CategoryBudgetSection } from "./CategoryBudgetSection";
import { PasteListSheet } from "./PasteListSheet";
import { RecurringListSuggestion } from "./RecurringListSuggestion";

export function ListaActiva() {
  const { grupo, loading: loadingGrupo, crearGrupo, error } = useGrupo();
  const listaHook = useListaActiva(grupo?.id);
  const [categoria, setCategoria] = useState("Todas");
  const [modoCompra, setModoCompra] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [nombreCierre, setNombreCierre] = useState("");

  if (loadingGrupo || listaHook.loading) return <Skeleton />;

  if (!grupo) {
    return (
      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="eyebrow">Primer paso</p>
        <h1 className="mt-3 text-2xl font-black">Creá un espacio para tu compra</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Trabajá en modo local o creá un grupo sincronizado con Google.</p>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <form className="mt-5 flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); void crearGrupo(nombreGrupo || "Mi familia"); }}>
          <Input value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} placeholder="Familia García" />
          <Button>Crear grupo</Button>
        </form>
        <a className="mt-4 inline-block text-sm font-medium text-[var(--muted)] underline" href="/unirse">Unirme a un grupo existente</a>
      </section>
    );
  }

  const lista = listaHook.lista;
  if (!lista) return <Skeleton />;

  const categorias = Object.keys(listaHook.agrupados);
  const comprados = listaHook.productos.filter((p) => p.estado === "comprado").length;
  const visibles = categoria === "Todas" ? listaHook.agrupados : { [categoria]: listaHook.agrupados[categoria] ?? [] };

  return (
    <>
      <section className="grid gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{grupo.nombre}</p>
                <h1 className="mt-1 text-2xl font-black">{lista.nombre}</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">{comprados} de {listaHook.productos.length} productos</p>
              </div>
              <div className="hidden gap-2 md:flex">
                <AgregarProducto onGuardar={listaHook.agregar} />
                <PasteListSheet onAgregar={listaHook.agregar} />
                <Button variant="secondary" onClick={() => setModoCompra(true)}>Modo compra</Button>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-[var(--line)]">
              <div className="h-full rounded-full bg-[var(--ink)] transition-all" style={{ width: `${listaHook.productos.length ? (comprados / listaHook.productos.length) * 100 : 0}%` }} />
            </div>
          </div>

          <BudgetRescuePanel lista={lista} productos={listaHook.productos} onUpdate={listaHook.actualizar} onDelete={listaHook.eliminar} />
          <RecurringListSuggestion onAgregar={listaHook.agregar} />

          <div className="sticky top-2 z-20 -mx-3 bg-[var(--bg)] px-3 py-1">
            <FiltroCategoria categorias={categorias} activa={categoria} onChange={setCategoria} />
          </div>

          <div className="space-y-2">
            {Object.entries(visibles).map(([cat, items]) => (
              <details key={cat} open className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
                <summary className="cursor-pointer px-1 text-sm font-bold">{cat}</summary>
                <div className="mt-3 grid gap-2" role="list">
                  {items.map((p) => <ItemProducto key={p.id} producto={p} onUpdate={listaHook.actualizar} onDelete={listaHook.eliminar} />)}
                </div>
              </details>
            ))}
          </div>

          <form className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4" onSubmit={(e) => { e.preventDefault(); if (nombreCierre) void listaHook.cerrar(nombreCierre); }}>
            <h2 className="text-sm font-bold">Cerrar lista</h2>
            <div className="mt-3 flex gap-2">
              <Input value={nombreCierre} onChange={(e) => setNombreCierre(e.target.value)} placeholder="Compra semanal" />
              <Button variant="danger">Cerrar</Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <ResumenPresupuesto lista={lista} productos={listaHook.productos} />
          <CategoryBudgetSection listId={lista.id} productos={listaHook.productos} />
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-20 z-30 grid grid-cols-3 gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 md:hidden">
        <AgregarProducto onGuardar={listaHook.agregar} />
        <PasteListSheet onAgregar={listaHook.agregar} />
        <Button variant="secondary" onClick={() => setModoCompra(true)}>Compra</Button>
      </div>

      {modoCompra && <ModoCombra productos={listaHook.productos} onUpdate={listaHook.actualizar} onClose={() => setModoCompra(false)} />}
    </>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-3" aria-live="polite">
      <div className="h-32 animate-pulse rounded-xl bg-[var(--surface)]" />
      <div className="h-20 animate-pulse rounded-xl bg-[var(--surface)]" />
      <div className="h-20 animate-pulse rounded-xl bg-[var(--surface)]" />
    </div>
  );
}
