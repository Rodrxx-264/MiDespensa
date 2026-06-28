import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = { title: "Mi Despensa", description: "Gestión familiar de compras con grupos, QR y listas en tiempo real para Guatemala." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es-GT"><body><ToastProvider>{children}</ToastProvider></body></html>;
}
