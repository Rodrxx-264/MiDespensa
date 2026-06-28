import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "md" | "lg" }) {
  return <button className={cn("touch rounded-full px-5 font-bold tracking-[-.01em] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50", size === "lg" ? "py-3 text-base" : "py-2 text-sm", variant === "primary" && "bg-tinta text-white shadow-[0_14px_30px_rgba(17,24,39,.20)] hover:bg-bosque", variant === "secondary" && "border border-tinta/10 bg-white/70 text-tinta shadow-sm hover:bg-white", variant === "ghost" && "bg-transparent text-tinta hover:bg-white/60", variant === "danger" && "bg-red-600 text-white shadow-[0_14px_30px_rgba(220,38,38,.18)]", className)} {...props} />;
}
