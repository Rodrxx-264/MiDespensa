"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePreferences } from "@/hooks/usePreferences";
import type { UserPreferences } from "@/types";

const usage = [{ v: "personal", l: "Solo para mí" }, { v: "family", l: "Con mi familia" }, { v: "events", l: "Para eventos" }, { v: "small_business", l: "Casa/negocio pequeño" }] as const;
const frequency = [{ v: "daily", l: "Diario" }, { v: "weekly", l: "Semanal" }, { v: "biweekly", l: "Quincenal" }, { v: "monthly", l: "Mensual" }, { v: "as_needed", l: "Cuando se necesita" }] as const;
const stores = ["Supermercado", "Mercado", "Tienda de barrio", "Mayoreo", "Panadería", "Farmacia", "Otro"];
const goals = ["No pasarme del presupuesto", "Evitar comprar repetido", "Comparar precios", "Ahorrar tiempo", "Planear comidas", "Evitar desperdicio"];

export default function BienvenidaPage() {
  const router = useRouter(); const { preferences, setPreferences } = usePreferences(); const [step, setStep] = useState(0); const [draft, setDraft] = useState<UserPreferences>(preferences); const [customBudget, setCustomBudget] = useState("");
  async function finish() { await setPreferences({ ...draft, defaultBudgetAmount: customBudget ? Number(customBudget) : draft.defaultBudgetAmount, onboardingCompleted: true }); router.push("/dashboard"); }
  const screens = [
    <Step title="Bienvenido a Mi Despensa" text="Una app para ayudarte a comprar mejor, cuidar tu presupuesto y evitar comprar de más." action="Empezar" />,
    <Choice title="¿Cómo vas a usar la app?" options={usage.map((x) => x.l)} selected={labelFor(usage, draft.usageType)} onPick={(label) => setDraft({ ...draft, usageType: usage.find((x) => x.l === label)?.v })}/>,
    <Choice title="¿Cada cuánto hacés compras?" options={frequency.map((x) => x.l)} selected={labelFor(frequency, draft.shoppingFrequency)} onPick={(label) => setDraft({ ...draft, shoppingFrequency: frequency.find((x) => x.l === label)?.v })}/>,
    <Choice title="¿Querés definir un presupuesto base?" options={["No por ahora", "Q100 - Q250", "Q250 - Q500", "Q500 - Q1000", "Más de Q1000", "Personalizado"]} selected={draft.defaultBudgetRange} onPick={(label) => setDraft({ ...draft, defaultBudgetRange: label })}>{draft.defaultBudgetRange === "Personalizado" && <Input type="number" placeholder="Monto en quetzales" value={customBudget} onChange={(e) => setCustomBudget(e.target.value)}/>}</Choice>,
    <Multi title="¿Dónde solés comprar?" options={stores} selected={draft.preferredStoreTypes} onChange={(selected) => setDraft({ ...draft, preferredStoreTypes: selected })}/>,
    <Multi title="¿Qué querés mejorar al comprar?" options={goals} selected={draft.mainGoals} onChange={(selected) => setDraft({ ...draft, mainGoals: selected })}/>,
    <Step title="Tu información es tuya" text="Mi Despensa no vende datos, no usa publicidad y no recolecta información personal innecesaria. Solo guardamos lo que necesitás para tus listas, presupuestos y compras. Podés exportar o borrar tus datos desde ajustes." action="Entendido" />,
    <Step title="Listo" text="Vamos a preparar tu primera compra." action="Ir al dashboard" />
  ];
  return <section className="surface mx-auto max-w-lg rounded-[32px] p-6"><p className="eyebrow">Inicio privado</p><div className="mt-4 min-h-[420px]">{screens[step]}</div><div className="mt-6 flex gap-2"><Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Atrás</Button>{step < screens.length - 1 ? <Button className="flex-1" onClick={() => setStep(step + 1)}>Continuar</Button> : <Button className="flex-1" onClick={finish}>Ir al dashboard</Button>}</div></section>;
}

function Step({ title, text }: { title: string; text: string; action: string }) { return <div><h1 className="text-4xl font-black tracking-[-.06em]">{title}</h1><p className="mt-4 text-tinta/65">{text}</p></div>; }
function Choice({ title, options, selected, onPick, children }: { title: string; options: string[]; selected?: string; onPick: (value: string) => void; children?: React.ReactNode }) { return <div><h1 className="text-3xl font-black tracking-[-.05em]">{title}</h1><div className="mt-5 grid gap-2">{options.map((option) => <button key={option} onClick={() => onPick(option)} className={`touch rounded-[18px] border p-3 text-left font-black ${selected === option ? "border-tinta bg-tinta text-crema" : "border-tinta/10 bg-white/65"}`}>{option}</button>)}{children}</div></div>; }
function Multi({ title, options, selected, onChange }: { title: string; options: string[]; selected: string[]; onChange: (value: string[]) => void }) { return <div><h1 className="text-3xl font-black tracking-[-.05em]">{title}</h1><div className="mt-5 grid gap-2">{options.map((option) => <button key={option} onClick={() => onChange(selected.includes(option) ? selected.filter((x) => x !== option) : [...selected, option])} className={`touch rounded-[18px] border p-3 text-left font-black ${selected.includes(option) ? "border-tinta bg-tinta text-crema" : "border-tinta/10 bg-white/65"}`}>{option}</button>)}</div></div>; }
function labelFor<T extends readonly { v: string; l: string }[]>(items: T, value?: string) { return items.find((item) => item.v === value)?.l; }
