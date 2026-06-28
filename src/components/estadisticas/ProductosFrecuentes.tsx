import type { Producto } from "@/types";
export function ProductosFrecuentes({ productos }: { productos: Producto[] }) {
  const top = Object.entries(productos.reduce<Record<string, number>>((a, p) => { a[p.nombre] = (a[p.nombre] ?? 0) + 1; return a; }, {})).sort((a,b)=>b[1]-a[1]).slice(0,10);
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="font-bold">Productos más comprados</h2>
      <ol className="mt-4 space-y-2">
        {top.map(([n,c]) => (
          <li key={n} className="flex justify-between rounded-lg bg-[var(--bg)] p-3 text-sm">
            <span>{n}</span>
            <b className="font-bold">{c}</b>
          </li>
        ))}
      </ol>
    </section>
  );
}
