"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function VariacionPrecios({ data = [] }: { data?: { fecha: string; precio: number }[] }) { return <section className="rounded-card bg-white p-5 shadow-sm"><h2 className="text-xl font-black">Variación de precios</h2><div className="mt-4 h-56"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="fecha"/><YAxis/><Tooltip/><Line type="monotone" dataKey="precio" stroke="#F4A261" strokeWidth={3}/></LineChart></ResponsiveContainer></div></section>; }
