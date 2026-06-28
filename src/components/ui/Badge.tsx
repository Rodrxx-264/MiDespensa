import { cn } from "@/lib/utils";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) { return <span className={cn("inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--ink)]", className)}>{children}</span>; }
