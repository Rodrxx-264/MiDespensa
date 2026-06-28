import { formatoQ } from "@/lib/utils";
import type { Producto } from "@/types";

export function DetalleListaCerrada({ productos }: { productos: Producto[] }) {
  return (
    <div className="mt-4 overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[var(--muted)]">
            <th className="p-3">Producto</th>
            <th className="p-3">Estimado</th>
            <th className="p-3">Real</th>
            <th className="p-3">Tienda</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-t border-[var(--line)]">
              <td className="p-3 font-semibold">{p.nombre}</td>
              <td className="metric p-3">{formatoQ.format(Number(p.precio_estimado ?? 0))}</td>
              <td className="metric p-3">{formatoQ.format(Number(p.precio_real ?? 0))}</td>
              <td className="p-3">{p.tienda_compra ?? p.tienda_sugerida ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
