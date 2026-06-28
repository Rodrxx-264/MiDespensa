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
import { BuscarPrecios } from "@/components/gemini/BuscarPrecios";

export function ListaActiva() {
  const { grupo, loading: loadingGrupo, crearGrupo } = useGrupo();
  const listaHook = useListaActiva(grupo?.id); const [categoria, setCategoria] = useState("Todas"); const [modoCompra, setModoCompra] = useState(false); const [nombreGrupo, setNombreGrupo] = useState(""); const [nombreCierre, setNombreCierre] = useState("");
  if (loadingGrupo || listaHook.loading) return <Skeleton />;
  if (!grupo) return <section className="rounded-[24px] bg-white p-6 shadow-suave"><h1 className="text-3xl font-black">Bienvenido a Mi Despensa</h1><p className="mt-2 text-tinta/70">Crea tu grupo familiar o únete desde un código QR.</p><form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void crearGrupo(nombreGrupo || "Mi familia"); }}><Input value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} placeholder="Familia García"/><Button>Crear mi grupo</Button></form><a className="mt-4 inline-block font-bold text-bosque" href="/unirse">Unirme a un grupo existente</a></section>;
  const lista = listaHook.lista; if (!lista) return <Skeleton />;
  const categorias = Object.keys(listaHook.agrupados); const comprados = listaHook.productos.filter((p) => p.estado === "comprado").length; const visibles = categoria === "Todas" ? listaHook.agrupados : { [categoria]: listaHook.agrupados[categoria] ?? [] };
  return <><section className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="space-y-5"><div className="rounded-[24px] bg-white p-5 shadow-suave"><p className="text-sm font-bold text-bosque">{grupo.nombre}</p><h1 className="text-3xl font-black">{lista.nombre}</h1><p className="mt-2" aria-live="polite">{comprados} de {listaHook.productos.length} productos comprados</p><div className="mt-3 h-3 overflow-hidden rounded-full bg-crema"><div className="h-full bg-menta transition-all" style={{ width: `${listaHook.productos.length ? (comprados / listaHook.productos.length) * 100 : 0}%` }}/></div><div className="mt-4 flex flex-wrap gap-2"><AgregarProducto onGuardar={listaHook.agregar}/><Button variant="secondary" onClick={() => setModoCompra(true)}>Modo compra</Button><BuscarPrecios lista={listaHook.productos}/></div></div><FiltroCategoria categorias={categorias} activa={categoria} onChange={setCategoria}/>{Object.entries(visibles).map(([cat, items]) => <details key={cat} open className="rounded-card bg-white p-4 shadow-sm"><summary className="cursor-pointer text-lg font-black">{cat}</summary><div className="mt-3 grid gap-3" role="list">{items.map((p) => <ItemProducto key={p.id} producto={p} onUpdate={listaHook.actualizar} onDelete={listaHook.eliminar}/>)}</div></details>)}<form className="rounded-card bg-white p-4 shadow-sm" onSubmit={(e) => { e.preventDefault(); if (nombreCierre) void listaHook.cerrar(nombreCierre); }}><h2 className="font-black">Cerrar lista</h2><div className="mt-3 flex gap-2"><Input value={nombreCierre} onChange={(e) => setNombreCierre(e.target.value)} placeholder="Compra semanal"/><Button variant="danger">Cerrar lista</Button></div></form></div><ResumenPresupuesto lista={lista} productos={listaHook.productos}/></section>{modoCompra && <ModoCombra productos={listaHook.productos} onUpdate={listaHook.actualizar} onClose={() => setModoCompra(false)}/>}</>;
}
function Skeleton() { return <div className="grid gap-3" aria-live="polite"><div className="h-32 animate-pulse rounded-card bg-white/80"/><div className="h-20 animate-pulse rounded-card bg-white/70"/><div className="h-20 animate-pulse rounded-card bg-white/70"/></div>; }
