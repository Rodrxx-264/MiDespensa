import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "md" | "lg" }) {
  return <button className={cn("touch rounded-[18px] px-5 font-black tracking-[-.02em] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50", size === "lg" ? "py-3 text-base" : "py-2 text-sm", variant === "primary" && "bg-tinta text-crema shadow-[0_14px_30px_rgba(24,32,29,.22)] hover:bg-bosque", variant === "secondary" && "border border-tinta/15 bg-[#fafbf6]/80 text-tinta shadow-sm hover:bg-[#fafbf6]", variant === "ghost" && "bg-transparent text-tinta hover:bg-[#fafbf6]/60", variant === "danger" && "bg-[#8b3f2f] text-white shadow-[0_14px_30px_rgba(139,63,47,.18)]", className)} {...props} />;
}
