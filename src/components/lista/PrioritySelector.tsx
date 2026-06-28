"use client";
import type { ProductPriority } from "@/types";

const OPTIONS: { value: ProductPriority; label: string }[] = [{ value: "essential", label: "Esencial" }, { value: "important", label: "Importante" }, { value: "optional", label: "Opcional" }];

export function PrioritySelector({ value = "important", onChange }: { value?: ProductPriority | null; onChange: (value: ProductPriority) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Prioridad del producto">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`touch rounded-xl border px-2 py-2 text-sm font-medium ${value === option.value ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]" : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function priorityLabel(priority?: ProductPriority | null) { return priority === "essential" ? "Esencial" : priority === "optional" ? "Opcional" : "Importante"; }
