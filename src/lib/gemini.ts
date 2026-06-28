import type { Producto, ResultadoGemini } from "@/types";

export async function buscarPreciosGemini(producto?: string, lista?: Producto[]): Promise<ResultadoGemini> {
  if (!process.env.GEMINI_API_KEY) throw new Error("Falta configurar GEMINI_API_KEY en las variables de entorno del servidor.");
  const objetivo = lista?.length
    ? lista.map((p) => `${p.nombre} (${p.cantidad} ${p.unidad})`).join(", ")
    : producto;

  const prompt = lista?.length
    ? `Busca precios actuales de esta lista en supermercados de Guatemala: ${objetivo}. Sugiere en qué tienda(s) conviene hacer la compra para optimizar el gasto total. Responde ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional, con este formato exacto: {"precios":[{"tienda":"nombre","precio":0.00,"presentacion":"descripcion"}],"recomendacion":"texto","texto":"texto"}`
    : `Busca el precio actual de ${objetivo} en supermercados de Guatemala: Walmart Guatemala, Despensa Familiar, Maxi Despensa, La Torre y Super 24. Responde ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional, con este formato exacto: {"precios":[{"tienda":"nombre","precio":0.00,"presentacion":"descripcion"}],"recomendacion":"texto","texto":"texto"}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tools: [{ google_search: {} }],
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini error:", response.status, errorText);
    throw new Error(`Gemini respondió ${response.status}: ${errorText}`);
  }

  const json = await response.json();

  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: { text?: string }) => p.text ?? "").join("\n").trim();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]) as ResultadoGemini;
    } catch (e) {
      console.error("JSON parse error:", e, "text was:", match[0]);
    }
  }

  return {
    precios: [],
    recomendacion: text || "No se encontraron precios exactos.",
    texto: text
  };
}
