import { formatoQ } from "@/lib/utils";
import type { Producto } from "@/types";

export function DetalleListaCerrada({ productos }: { productos: Producto[] }) { return <div className="mt-3 overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Producto</th><th className="p-2">Estimado</th><th className="p-2">Real</th><th className="p-2">Tienda</th></tr></thead><tbody>{productos.map((p) => <tr key={p.id} className="border-t"><td className="p-2">{p.nombre}</td><td className="p-2">{formatoQ.format(Number(p.precio_estimado ?? 0))}</td><td className="p-2">{formatoQ.format(Number(p.precio_real ?? 0))}</td><td className="p-2">{p.tienda_compra ?? p.tienda_sugerida ?? "-"}</td></tr>)}</tbody></table></div>; }
