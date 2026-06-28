import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const formatoQ = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" });
export const formatoFecha = new Intl.DateTimeFormat("es-GT", { day: "2-digit", month: "2-digit", year: "numeric" });
export function hoyLista() { return `Lista del ${formatoFecha.format(new Date())}`; }
