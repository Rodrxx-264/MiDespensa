"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function GraficaGasto({ data }: { data: { fecha: string; total: number }[] }) { return <section className="rounded-card bg-white p-5 shadow-sm"><h2 className="text-xl font-black">Gasto por período</h2><div className="mt-4 h-72"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="fecha"/><YAxis/><Tooltip/><Bar dataKey="total" fill="#2D6A4F" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></section>; }
