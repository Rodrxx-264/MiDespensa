import type { ResultadoGemini } from "@/types";
import { formatoQ } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function ResultadoPrecios({ resultado, onUsar }: { resultado: ResultadoGemini; onUsar?: (precio: number, tienda: string) => void }) {
  const min = Math.min(...resultado.precios.map((p) => p.precio));
  return <div className="space-y-4" aria-live="polite">{resultado.precios.length > 0 ? <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Tienda</th><th className="p-2">Precio</th><th className="p-2">Presentación</th><th className="p-2">Acción</th></tr></thead><tbody>{resultado.precios.map((p) => <tr key={`${p.tienda}-${p.presentacion}`} className={p.precio === min ? "bg-menta/25" : ""}><td className="p-2 font-semibold">{p.tienda}</td><td className="p-2">{formatoQ.format(p.precio)}</td><td className="p-2">{p.presentacion}</td><td className="p-2">{onUsar && <Button type="button" variant="secondary" onClick={() => onUsar(p.precio, p.tienda)}>Usar</Button>}</td></tr>)}</tbody></table></div> : <p className="rounded-card bg-crema p-3 text-sm">Gemini no devolvió precios estructurados.</p>}<p className="rounded-card bg-crema p-3 text-sm">{resultado.recomendacion}</p></div>;
}
