import { formatoQ } from "@/lib/utils";
import type { Lista, Producto } from "@/types";

export function ResumenPresupuesto({ lista, productos }: { lista: Lista; productos: Producto[] }) {
  const estimado = productos.reduce((s, p) => s + Number(p.precio_estimado ?? 0), 0); const real = productos.reduce((s, p) => s + Number(p.precio_real ?? 0), 0); const excede = lista.presupuesto_maximo && estimado > lista.presupuesto_maximo;
  return <aside className="sticky top-4 rounded-card bg-white p-4 shadow-suave"><h2 className="font-black">Presupuesto</h2><dl className="mt-3 grid grid-cols-2 gap-3 text-sm"><dt>Estimado</dt><dd className="text-right font-bold">{formatoQ.format(estimado)}</dd><dt>Real pagado</dt><dd className="text-right font-bold">{formatoQ.format(real)}</dd><dt>Diferencia</dt><dd className="text-right font-bold">{formatoQ.format(real - estimado)}</dd><dt>Máximo</dt><dd className="text-right font-bold">{lista.presupuesto_maximo ? formatoQ.format(lista.presupuesto_maximo) : "No definido"}</dd></dl>{excede && <p className="mt-3 rounded-control bg-red-100 p-3 text-sm font-bold text-red-700">El estimado supera el presupuesto máximo.</p>}</aside>;
}
