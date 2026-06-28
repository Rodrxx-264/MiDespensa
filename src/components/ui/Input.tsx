import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn("touch w-full rounded-control border border-tinta/15 bg-white px-3 py-2", props.className)} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={cn("touch w-full rounded-control border border-tinta/15 bg-white px-3 py-2", props.className)} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={cn("w-full rounded-control border border-tinta/15 bg-white px-3 py-2", props.className)} />; }
