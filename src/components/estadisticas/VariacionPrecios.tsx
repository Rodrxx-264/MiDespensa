"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function VariacionPrecios({ data = [] }: { data?: { fecha: string; precio: number }[] }) { return <section className="panel rounded-[28px] p-5"><h2 className="text-xl font-black tracking-[-.04em]">Variación de precios</h2><div className="mt-4 h-56"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="fecha"/><YAxis/><Tooltip/><Line type="monotone" dataKey="precio" stroke="#B9945D" strokeWidth={3}/></LineChart></ResponsiveContainer></div></section>; }
