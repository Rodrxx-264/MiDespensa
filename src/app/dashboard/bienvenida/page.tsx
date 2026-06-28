"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { UserPreferences } from "@/types";

const usage = [{ v: "personal", l: "Solo para mí" }, { v: "family", l: "Con mi familia" }, { v: "events", l: "Para eventos" }, { v: "small_business", l: "Casa/negocio pequeño" }] as const;
const frequency = [{ v: "daily", l: "Diario" }, { v: "weekly", l: "Semanal" }, { v: "biweekly", l: "Quincenal" }, { v: "monthly", l: "Mensual" }, { v: "as_needed", l: "Cuando se necesita" }] as const;
const stores = ["Supermercado", "Mercado", "Tienda de barrio", "Mayoreo", "Panadería", "Farmacia", "Otro"];
const goals = ["No pasarme del presupuesto", "Evitar comprar repetido", "Comparar precios", "Ahorrar tiempo", "Planear comidas", "Evitar desperdicio"];

export default function BienvenidaPage() {
  const router = useRouter();
  const { preferences, setPreferences } = usePreferences();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserPreferences>(preferences);
  const [customBudget, setCustomBudget] = useState("");

  async function finish() {
    await setPreferences({ ...draft, defaultBudgetAmount: customBudget ? Number(customBudget) : draft.defaultBudgetAmount, onboardingCompleted: true });
    router.replace("/dashboard");
  }

  const screens = [
    <Step key="welcome" title="Bienvenido" text="Una app para comprar mejor, cuidar tu presupuesto y evitar comprar de más." />,
    <Choice key="usage" title="¿Cómo vas a usar la app?" options={usage.map((x) => x.l)} selected={labelFor(usage, draft.usageType)} onPick={(label) => setDraft({ ...draft, usageType: usage.find((x) => x.l === label)?.v })} />,
    <Choice key="freq" title="¿Cada cuánto hacés compras?" options={frequency.map((x) => x.l)} selected={labelFor(frequency, draft.shoppingFrequency)} onPick={(label) => setDraft({ ...draft, shoppingFrequency: frequency.find((x) => x.l === label)?.v })} />,
    <Choice key="budget" title="¿Querés definir un presupuesto base?" options={["No por ahora", "Q100 - Q250", "Q250 - Q500", "Q500 - Q1000", "Más de Q1000", "Personalizado"]} selected={draft.defaultBudgetRange} onPick={(label) => setDraft({ ...draft, defaultBudgetRange: label })}>
      {draft.defaultBudgetRange === "Personalizado" && <Input type="number" placeholder="Monto en quetzales" value={customBudget} onChange={(e) => setCustomBudget(e.target.value)} className="mt-2" />}
    </Choice>,
    <Multi key="stores" title="¿Dónde solés comprar?" options={stores} selected={draft.preferredStoreTypes} onChange={(selected) => setDraft({ ...draft, preferredStoreTypes: selected })} />,
    <Multi key="goals" title="¿Qué querés mejorar?" options={goals} selected={draft.mainGoals} onChange={(selected) => setDraft({ ...draft, mainGoals: selected })} />,
    <Step key="privacy" title="Tus datos son tuyos" text="No vendemos datos, no usamos publicidad. Solo guardamos lo necesario para tus listas." />,
    <Step key="ready" title="Listo" text="Vamos a preparar tu primera compra." />,
  ];

  return (
    <section>
      <p className="eyebrow">Inicio privado</p>
      <div className="mt-4 min-h-[320px]">{screens[step]}</div>
      <div className="mt-6 flex gap-2">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Atrás</Button>
        {step < screens.length - 1 ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>Continuar</Button>
        ) : (
          <Button className="flex-1" onClick={finish}>Ir al dashboard</Button>
        )}
      </div>
    </section>
  );
}

function Step({ title, text }: { title: string; text: string }) {
  return <div><h1 className="text-3xl font-black tracking-[-.05em]">{title}</h1><p className="mt-3 text-[var(--muted)]">{text}</p></div>;
}

function Choice({ title, options, selected, onPick, children }: { title: string; options: string[]; selected?: string; onPick: (v: string) => void; children?: React.ReactNode }) {
  return <div><h1 className="text-xl font-black tracking-[-.03em]">{title}</h1><div className="mt-4 grid gap-2">{options.map((o) => (
    <button key={o} onClick={() => onPick(o)} className={`touch rounded-xl border p-3 text-left font-medium ${selected === o ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]" : "border-[var(--line)] bg-[var(--surface)]"}`}>{o}</button>
  ))}{children}</div></div>;
}

function Multi({ title, options, selected, onChange }: { title: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return <div><h1 className="text-xl font-black tracking-[-.03em]">{title}</h1><div className="mt-4 grid gap-2">{options.map((o) => (
    <button key={o} onClick={() => onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o])} className={`touch rounded-xl border p-3 text-left font-medium ${selected.includes(o) ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]" : "border-[var(--line)] bg-[var(--surface)]"}`}>{o}</button>
  ))}</div></div>;
}

function labelFor<T extends readonly { v: string; l: string }[]>(items: T, value?: string) {
  return items.find((i) => i.v === value)?.l;
}
