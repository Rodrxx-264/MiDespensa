import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "md" | "lg" }) {
  return (
    <button
      className={cn(
        "touch inline-flex items-center justify-center rounded-xl px-4 font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
        size === "lg" ? "h-12 text-base" : "h-10 text-sm",
        variant === "primary" && "bg-[var(--ink)] text-[var(--bg)]",
        variant === "secondary" && "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]",
        variant === "ghost" && "text-[var(--ink)]",
        variant === "danger" && "bg-[#8b3f2f] text-white",
        className
      )}
      {...props}
    />
  );
}
