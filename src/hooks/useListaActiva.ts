"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hoyLista } from "@/lib/utils";
import { ensureLocalList, isLocalMode, readLocalState, recalcLocalList, writeLocalState } from "@/lib/local";
import { normalizeProductName } from "@/lib/shopping/normalize";
import type { Lista, Producto } from "@/types";
import { useToast } from "@/components/ui/Toast";

export function useListaActiva(grupoId?: string | null) {
  const supabase = createClient();
  const toast = useToast();
  const [lista, setLista] = useState<Lista | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [localMode, setLocalMode] = useState(false);
  async function cargar() {
    if (!grupoId) return setLoading(false);
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const usarLocal = !user && isLocalMode();
    setLocalMode(usarLocal);
    if (usarLocal) {
      const l = ensureLocalList(grupoId); const state = readLocalState();
      setLista(l); setProductos(state.productos.filter((p) => p.lista_id === l.id)); setLoading(false); return;
    }
    let { data: l } = await supabase.from("listas").select("*").eq("grupo_id", grupoId).eq("estado", "activa").maybeSingle();
    if (!l) { const r = await supabase.from("listas").insert({ grupo_id: grupoId, nombre: hoyLista() }).select("*").single(); l = r.data; }
    setLista(l as Lista);
    const { data: ps } = await supabase.from("productos").select("*").eq("lista_id", l!.id).order("created_at");
    setProductos(ps ?? []); setLoading(false);
  }
  useEffect(() => { void cargar(); }, [grupoId]);
  useEffect(() => {
    if (!lista?.id || localMode) return;
    const ch = supabase.channel(`lista-activa-${lista.id}`).on("postgres_changes", { event: "*", schema: "public", table: "productos", filter: `lista_id=eq.${lista.id}` }, (payload) => {
      void cargar();
      const nuevo = payload.new as Partial<Producto>;
      if (payload.eventType === "INSERT") toast(`${nuevo.agregado_por_nombre ?? "Alguien"} agregó ${nuevo.nombre}`);
      if (payload.eventType === "UPDATE") toast(`${nuevo.nombre ?? "Producto"} fue actualizado`);
    }).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [lista?.id]);
  const agrupados = useMemo(() => productos.reduce<Record<string, Producto[]>>((acc, p) => { (acc[p.categoria] ??= []).push(p); return acc; }, {}), [productos]);
  async function agregar(data: Partial<Producto>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && localMode) {
      if (!lista) return; const state = readLocalState(); const created = new Date().toISOString();
      state.productos.push({ id: crypto.randomUUID(), lista_id: lista.id, nombre: data.nombre ?? "Producto", categoria: data.categoria ?? "Otros", cantidad: Number(data.cantidad ?? 1), unidad: data.unidad ?? "unidad", precio_estimado: data.precio_estimado ?? null, precio_real: null, tienda_sugerida: data.tienda_sugerida ?? null, tienda_compra: null, estado: "pendiente", status: "pending", priority: data.priority ?? "important", normalized_name: normalizeProductName(data.nombre ?? "Producto"), substitute_name: null, purchase_note: null, notas: data.notas ?? null, agregado_por: state.perfil.id, agregado_por_nombre: state.perfil.nombre, comprado_por: null, comprado_por_nombre: null, created_at: created, updated_at: created });
      writeLocalState(state); recalcLocalList(lista.id); toast(`${data.nombre ?? "Producto"} agregado en modo local`); await cargar(); return;
    }
    if (!lista || !user) return;
    const { data: perfil } = await supabase.from("perfiles").select("nombre").eq("id", user.id).single();
    await supabase.from("productos").insert({ ...data, priority: data.priority ?? "important", status: "pending", normalized_name: normalizeProductName(data.nombre ?? "Producto"), lista_id: lista.id, agregado_por: user.id, agregado_por_nombre: perfil?.nombre ?? user.email }); await cargar();
  }
  async function actualizar(id: string, data: Partial<Producto>) { if (localMode) { const state = readLocalState(); const p = state.productos.find((x) => x.id === id); if (p) { Object.assign(p, data, { normalized_name: normalizeProductName(data.substitute_name || data.nombre || p.substitute_name || p.nombre), updated_at: new Date().toISOString() }); if ((data.estado === "comprado" || data.status === "purchased") && p.precio_real) state.priceHistory.push({ id: crypto.randomUUID(), group_id: grupoId!, list_id: p.lista_id, product_name: p.substitute_name || p.nombre, normalized_product_name: p.normalized_name || normalizeProductName(p.substitute_name || p.nombre), store: p.tienda_compra, price: Number(p.precio_real), quantity: Number(p.cantidad || 1), unit: p.unidad, purchased_at: new Date().toISOString() }); } writeLocalState(state); if (p) recalcLocalList(p.lista_id); await cargar(); return; } const update = { ...data, ...(data.nombre || data.substitute_name ? { normalized_name: normalizeProductName(data.substitute_name || data.nombre || "") } : {}) }; await supabase.from("productos").update(update).eq("id", id); if (data.estado === "comprado" || data.status === "purchased") await guardarHistorialSupabase(id, update); await cargar(); }
  async function eliminar(id: string) { if (localMode) { const state = readLocalState(); const p = state.productos.find((x) => x.id === id); state.productos = state.productos.filter((x) => x.id !== id); writeLocalState(state); if (p) recalcLocalList(p.lista_id); await cargar(); return; } await supabase.from("productos").delete().eq("id", id); await cargar(); }
  async function cerrar(nombre: string) { if (!lista) return; if (localMode) { const state = readLocalState(); const l = state.listas.find((x) => x.id === lista.id); if (l) Object.assign(l, { estado: "completada", nombre, cerrada_por: state.perfil.id, completada_at: new Date().toISOString() }); writeLocalState(state); setLista(null); await cargar(); return; } const { data: { user } } = await supabase.auth.getUser(); await supabase.from("listas").update({ estado: "completada", nombre, cerrada_por: user?.id, completada_at: new Date().toISOString() }).eq("id", lista.id); setLista(null); await cargar(); }
  async function guardarHistorialSupabase(id: string, data: Partial<Producto>) {
    if (!grupoId || !lista) return;
    const current = productos.find((p) => p.id === id);
    const merged = { ...current, ...data } as Producto;
    if (!merged.precio_real) return;
    await supabase.from("historial_precios").insert({ grupo_id: grupoId, list_id: lista.id, producto_nombre: merged.substitute_name || merged.nombre, normalized_product_name: normalizeProductName(merged.substitute_name || merged.nombre), tienda: merged.tienda_compra || "Sin tienda", store: merged.tienda_compra || "Sin tienda", precio: merged.precio_real, quantity: merged.cantidad, unit: merged.unidad, purchased_at: new Date().toISOString(), presentacion: merged.unidad });
  }
  return { lista, productos, agrupados, loading, agregar, actualizar, eliminar, cerrar, recargar: cargar };
}
