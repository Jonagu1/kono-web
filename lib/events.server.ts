import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type ExtractedEvent = {
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  location: string | null;
  price: string | null;
};

const SYSTEM_PROMPT = `Eres un extractor de datos de afiches de eventos.
Devuelve SOLO un objeto JSON valido, sin markdown, con esta forma exacta:
{"title": string, "description": string|null, "event_date": "YYYY-MM-DD", "start_time": "HH:MM"|null, "location": string|null, "price": string|null}
Reglas:
- event_date es obligatorio. Si el afiche no indica el anio, usa el anio actual (o el siguiente si la fecha ya paso).
- start_time en formato 24h.
- description: una frase corta en espanol describiendo el evento.
- Si un dato no aparece, usa null.`;

export async function extractEventFromImage(dataUrl: string): Promise<ExtractedEvent> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Falta la clave de IA");

  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `La fecha de hoy es ${today}. Extrae el evento de este afiche.` },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`AI gateway error [${res.status}]: ${body}`);
    if (res.status === 429) throw new Error("Demasiadas solicitudes, intenta en un momento.");
    if (res.status === 402) throw new Error("Se agotaron los creditos de IA del proyecto.");
    throw new Error("No se pudo analizar el afiche.");
  }

  const json = await res.json();
  const raw: string = json?.choices?.[0]?.message?.content ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No se pudo leer la informacion del afiche.");

  const parsed = JSON.parse(match[0]) as Partial<ExtractedEvent>;
  if (!parsed.title || !parsed.event_date) {
    throw new Error("El afiche no tiene un titulo o una fecha reconocible.");
  }

  return {
    title: String(parsed.title).slice(0, 160),
    description: parsed.description ? String(parsed.description).slice(0, 600) : null,
    event_date: String(parsed.event_date).slice(0, 10),
    start_time: parsed.start_time ? String(parsed.start_time).slice(0, 5) : null,
    location: parsed.location ? String(parsed.location).slice(0, 200) : null,
    price: parsed.price ? String(parsed.price).slice(0, 60) : null,
  };
}

export async function uploadPoster(dataUrl: string): Promise<string | null> {
  const m = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!m) return null;
  const [, contentType, base64] = m;
  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  const bytes = Buffer.from(base64, "base64");
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("afiches")
    .upload(path, bytes, { contentType, upsert: false });
  if (error) {
    console.error("upload error", error);
    return null;
  }

  const { data } = await supabaseAdmin.storage
    .from("afiches")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? null;
}

export async function insertEvent(event: ExtractedEvent, posterUrl: string | null) {
  const { data, error } = await supabaseAdmin
    .from("events")
    .insert({ ...event, poster_url: posterUrl })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
