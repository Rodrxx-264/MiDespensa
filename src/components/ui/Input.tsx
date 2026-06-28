import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("touch w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 h-11 placeholder:text-[var(--muted)]", props.className)} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("touch w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 h-11", props.className)} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 placeholder:text-[var(--muted)]", props.className)} />;
}
