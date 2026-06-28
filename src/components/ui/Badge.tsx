import { cn } from "@/lib/utils";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) { return <span className={cn("inline-flex rounded-full border border-tinta/10 bg-white/65 px-3 py-1 text-sm font-semibold text-tinta", className)}>{children}</span>; }
