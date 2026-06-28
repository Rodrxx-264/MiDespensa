import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn("touch w-full rounded-2xl border border-tinta/10 bg-white/75 px-4 py-3 shadow-inner shadow-tinta/[.03] placeholder:text-tinta/35", props.className)} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={cn("touch w-full rounded-2xl border border-tinta/10 bg-white/75 px-4 py-3 shadow-inner shadow-tinta/[.03]", props.className)} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={cn("w-full rounded-2xl border border-tinta/10 bg-white/75 px-4 py-3 shadow-inner shadow-tinta/[.03] placeholder:text-tinta/35", props.className)} />; }
