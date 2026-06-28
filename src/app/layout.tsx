import type { Metadata } from "next";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Despensa",
  description: "Comprar mejor, gastar menos.",
};

export const viewport = "width=device-width, initial-scale=1, viewport-fit=cover";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var d=document.documentElement;var r=localStorage.getItem("mi_despensa_local_data");if(r){var p=JSON.parse(r);var t=p?.userPreferences?.theme||"system"}else var t="system";d.dataset.theme=t==="system"?(window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):t}catch(e){document.documentElement.dataset.theme="light"}})()`
        }} />
      </head>
      <body>
        <PreferencesProvider>
          <ToastProvider>{children}</ToastProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
