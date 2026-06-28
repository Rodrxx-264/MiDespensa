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

export function ListaActiva() {
  const { grupo, loading: loadingGrupo, crearGrupo } = useGrupo();
  const listaHook = useListaActiva(grupo?.id); const [categoria, setCategoria] = useState("Todas"); const [modoCompra, setModoCompra] = useState(false); const [nombreGrupo, setNombreGrupo] = useState(""); const [nombreCierre, setNombreCierre] = useState("");
  if (loadingGrupo || listaHook.loading) return <Skeleton />;
  if (!grupo) return <section className="surface overflow-hidden rounded-[32px] p-6 md:p-9"><p className="eyebrow">Primer paso</p><h1 className="mt-3 max-w-2xl text-4xl font-black tracking-[-.06em]">Crea un espacio para tu compra familiar.</h1><p className="mt-3 max-w-xl text-tinta/60">Puedes trabajar en modo local o crear un grupo sincronizado si inicias sesión con Google.</p><form className="mt-7 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void crearGrupo(nombreGrupo || "Mi familia"); }}><Input value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} placeholder="Familia García"/><Button>Crear grupo</Button></form><a className="mt-5 inline-block font-bold text-tinta/70 underline-offset-4 hover:underline" href="/unirse">Unirme a un grupo existente</a></section>;
  const lista = listaHook.lista; if (!lista) return <Skeleton />;
  const categorias = Object.keys(listaHook.agrupados); const comprados = listaHook.productos.filter((p) => p.estado === "comprado").length; const visibles = categoria === "Todas" ? listaHook.agrupados : { [categoria]: listaHook.agrupados[categoria] ?? [] };
  return <><section className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="space-y-5"><div className="surface rounded-[32px] p-5 md:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{grupo.nombre}</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">{lista.nombre}</h1><p className="mt-2 text-tinta/60" aria-live="polite">{comprados} de {listaHook.productos.length} productos comprados</p></div><div className="flex flex-wrap gap-2"><AgregarProducto onGuardar={listaHook.agregar}/><Button variant="secondary" onClick={() => setModoCompra(true)}>Modo compra</Button></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-tinta/10"><div className="h-full rounded-full bg-tinta transition-all" style={{ width: `${listaHook.productos.length ? (comprados / listaHook.productos.length) * 100 : 0}%` }}/></div></div><FiltroCategoria categorias={categorias} activa={categoria} onChange={setCategoria}/>{Object.entries(visibles).map(([cat, items]) => <details key={cat} open className="panel rounded-[28px] p-4"><summary className="cursor-pointer text-lg font-black tracking-[-.03em]">{cat}</summary><div className="mt-3 grid gap-3" role="list">{items.map((p) => <ItemProducto key={p.id} producto={p} onUpdate={listaHook.actualizar} onDelete={listaHook.eliminar}/>)}</div></details>)}<form className="panel rounded-[28px] p-4" onSubmit={(e) => { e.preventDefault(); if (nombreCierre) void listaHook.cerrar(nombreCierre); }}><h2 className="font-black tracking-[-.03em]">Cerrar lista</h2><div className="mt-3 flex flex-col gap-2 sm:flex-row"><Input value={nombreCierre} onChange={(e) => setNombreCierre(e.target.value)} placeholder="Compra semanal"/><Button variant="danger">Cerrar lista</Button></div></form></div><ResumenPresupuesto lista={lista} productos={listaHook.productos}/></section>{modoCompra && <ModoCombra productos={listaHook.productos} onUpdate={listaHook.actualizar} onClose={() => setModoCompra(false)}/>}</>;
}
function Skeleton() { return <div className="grid gap-3" aria-live="polite"><div className="surface h-32 animate-pulse rounded-[32px]"/><div className="panel h-20 animate-pulse rounded-[28px]"/><div className="panel h-20 animate-pulse rounded-[28px]"/></div>; }
