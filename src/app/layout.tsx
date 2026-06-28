import type { Metadata, Viewport } from "next";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Despensa",
  description: "Comprar mejor, gastar menos.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mi Despensa",
  },
  icons: {
    icon: "/icons/icon-512.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
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
