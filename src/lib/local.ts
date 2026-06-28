import { hoyLista } from "@/lib/utils";
import type { Grupo, Lista, Perfil, Producto } from "@/types";

const now = () => new Date().toISOString();
export const isLocalMode = () => typeof document !== "undefined" && document.cookie.includes("mi_despensa_local=1");

type LocalState = { perfil: Perfil; grupo: Grupo | null; miembros: Perfil[]; listas: Lista[]; productos: Producto[] };

function initialState(): LocalState {
  const id = "local-user";
  return { perfil: { id, nombre: "Invitado local", email: "local@mi-despensa", avatar_url: null, grupo_id: null, created_at: now(), updated_at: now() }, grupo: null, miembros: [], listas: [], productos: [] };
}

export function readLocalState(): LocalState {
  const raw = localStorage.getItem("mi_despensa_local_data");
  if (!raw) return initialState();
  try { return { ...initialState(), ...JSON.parse(raw) } as LocalState; } catch { return initialState(); }
}

export function writeLocalState(state: LocalState) { localStorage.setItem("mi_despensa_local_data", JSON.stringify(state)); }

export function ensureLocalList(grupoId: string) {
  const state = readLocalState();
  let lista = state.listas.find((l) => l.grupo_id === grupoId && l.estado === "activa");
  if (!lista) {
    lista = { id: crypto.randomUUID(), grupo_id: grupoId, nombre: hoyLista(), estado: "activa", presupuesto_maximo: null, total_estimado: 0, total_real: 0, notas: null, cerrada_por: null, created_at: now(), completada_at: null };
    state.listas.push(lista);
    writeLocalState(state);
  }
  return lista;
}

export function recalcLocalList(listaId: string) {
  const state = readLocalState();
  const lista = state.listas.find((l) => l.id === listaId);
  if (lista) {
    const productos = state.productos.filter((p) => p.lista_id === listaId);
    lista.total_estimado = productos.reduce((s, p) => s + Number(p.precio_estimado ?? 0) * Number(p.cantidad ?? 1), 0);
    lista.total_real = productos.reduce((s, p) => s + Number(p.precio_real ?? 0) * Number(p.cantidad ?? 1), 0);
    writeLocalState(state);
  }
}
