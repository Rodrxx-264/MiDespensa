import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "md" | "lg" }) {
  return <button className={cn("touch rounded-control px-4 font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50", size === "lg" ? "py-3 text-base" : "py-2 text-sm", variant === "primary" && "bg-bosque text-white shadow-suave", variant === "secondary" && "bg-menta/25 text-bosque", variant === "ghost" && "bg-transparent text-bosque", variant === "danger" && "bg-red-600 text-white", className)} {...props} />;
}
