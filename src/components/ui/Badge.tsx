import { cn } from "@/lib/utils";
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) { return <span className={cn("inline-flex rounded-full bg-menta/25 px-3 py-1 text-sm font-semibold text-bosque", className)}>{children}</span>; }
