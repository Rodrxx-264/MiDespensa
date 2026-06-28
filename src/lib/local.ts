import { hoyLista } from "@/lib/utils";
import { normalizeProductName } from "@/lib/shopping/normalize";
import type { CategoryBudget, Grupo, Lista, PantryItem, Perfil, PriceHistoryEntry, Producto } from "@/types";

const now = () => new Date().toISOString();
export const isLocalMode = () => typeof document !== "undefined" && document.cookie.includes("mi_despensa_local=1");

type LocalState = { perfil: Perfil; grupo: Grupo | null; miembros: Perfil[]; listas: Lista[]; productos: Producto[]; categoryBudgets: CategoryBudget[]; pantryItems: PantryItem[]; priceHistory: PriceHistoryEntry[] };

function initialState(): LocalState {
  const id = "local-user";
  return { perfil: { id, nombre: "Invitado local", email: "local@mi-despensa", avatar_url: null, grupo_id: null, created_at: now(), updated_at: now() }, grupo: null, miembros: [], listas: [], productos: [], categoryBudgets: [], pantryItems: [], priceHistory: [] };
}

export function readLocalState(): LocalState {
  const raw = localStorage.getItem("mi_despensa_local_data");
  if (!raw) return initialState();
  try { return migrateLocalState({ ...initialState(), ...JSON.parse(raw) } as LocalState); } catch { return initialState(); }
}

export function writeLocalState(state: LocalState) { localStorage.setItem("mi_despensa_local_data", JSON.stringify(state)); }

function migrateLocalState(state: LocalState): LocalState {
  state.categoryBudgets ??= [];
  state.pantryItems ??= [];
  state.priceHistory ??= [];
  state.productos = (state.productos ?? []).map((p) => ({ ...p, priority: p.priority ?? "important", status: p.status ?? (p.estado === "comprado" ? "purchased" : "pending"), normalized_name: p.normalized_name ?? normalizeProductName(p.nombre), substitute_name: p.substitute_name ?? null, purchase_note: p.purchase_note ?? null }));
  return state;
}

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

export function addLocalPriceHistory(product: Producto, grupoId: string) {
  const state = readLocalState();
  if (!product.precio_real) return;
  state.priceHistory.push({ id: crypto.randomUUID(), group_id: grupoId, list_id: product.lista_id, product_name: product.substitute_name || product.nombre, normalized_product_name: product.normalized_name || normalizeProductName(product.substitute_name || product.nombre), store: product.tienda_compra, price: Number(product.precio_real), quantity: Number(product.cantidad || 1), unit: product.unidad, purchased_at: now() });
  writeLocalState(state);
}
