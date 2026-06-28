"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function GraficaGasto({ data }: { data: { fecha: string; total: number }[] }) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="font-bold">Gasto por período</h2>
      <div className="mt-4 h-60">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="var(--ink)" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
