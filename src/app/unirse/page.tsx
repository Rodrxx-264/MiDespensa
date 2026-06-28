import { Suspense } from "react";
import { UnirseGrupo } from "@/components/grupo/UnirseGrupo";
export default function UnirsePage() { return <main className="min-h-screen bg-crema p-5"><Suspense><UnirseGrupo /></Suspense></main>; }
