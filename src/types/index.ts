export type EstadoLista = "activa" | "completada";
export type EstadoProducto = "pendiente" | "comprado";
export type Perfil = { id: string; nombre: string; email: string; avatar_url: string | null; grupo_id: string | null; created_at: string; updated_at: string };
export type Grupo = { id: string; nombre: string; codigo_qr: string; admin_id: string; created_at: string };
export type Lista = { id: string; grupo_id: string; nombre: string; estado: EstadoLista; presupuesto_maximo: number | null; total_estimado: number; total_real: number; notas: string | null; cerrada_por: string | null; created_at: string; completada_at: string | null };
export type Producto = { id: string; lista_id: string; nombre: string; categoria: string; cantidad: number; unidad: string; precio_estimado: number | null; precio_real: number | null; tienda_sugerida: string | null; tienda_compra: string | null; estado: EstadoProducto; notas: string | null; agregado_por: string | null; agregado_por_nombre: string | null; comprado_por: string | null; comprado_por_nombre: string | null; created_at: string; updated_at: string };
