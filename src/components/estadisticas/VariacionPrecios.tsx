"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function VariacionPrecios({ data = [] }: { data?: { fecha: string; precio: number }[] }) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="font-bold">Variación de precios</h2>
      <div className="mt-4 h-48">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="precio" stroke="var(--accent)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
