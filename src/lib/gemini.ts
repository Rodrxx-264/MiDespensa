import type { Producto, ResultadoGemini } from "@/types";

export async function buscarPreciosGemini(producto?: string, lista?: Producto[]): Promise<ResultadoGemini> {
  const objetivo = lista?.length ? lista.map((p) => `${p.nombre} (${p.cantidad} ${p.unidad})`).join(", ") : producto;
  const prompt = lista?.length ? `Busca precios actuales de esta lista en supermercados de Guatemala: ${objetivo}. Basándote en los precios encontrados, sugiere en qué tienda(s) conviene hacer la compra para optimizar el gasto total. Puede ser una sola tienda o dos si conviene dividir. Devuelve JSON con precios [{tienda, precio, presentacion}], recomendacion y texto.` : `Busca el precio actual de ${objetivo} en supermercados de Guatemala: Walmart Guatemala (walmart.com.gt), Despensa Familiar, Maxi Despensa, La Torre y Super 24. Devuelve JSON con precios [{tienda, precio, presentacion}], recomendacion y texto. Si no encuentras precio exacto, indica el rango aproximado.`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tools: [{ google_search: {} }], contents: [{ parts: [{ text: prompt }] }] }) });
  if (!response.ok) throw new Error("Gemini no respondió correctamente");
  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n") ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]) as ResultadoGemini; } catch {} }
  return { precios: [], recomendacion: text || "No se encontraron precios exactos.", texto: text };
}
