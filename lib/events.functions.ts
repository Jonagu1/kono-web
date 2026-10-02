import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  location: string | null;
  price: string | null;
  poster_url: string | null;
  created_at: string;
};

export const createEventFromPoster = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        dataUrl: z
          .string()
          .startsWith("data:image/")
          .max(12_000_000, "La imagen es demasiado grande (max ~8MB)"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { extractEventFromImage, uploadPoster, insertEvent } = await import("./events.server");
    const [event, posterUrl] = await Promise.all([
      extractEventFromImage(data.dataUrl),
      uploadPoster(data.dataUrl),
    ]);
    return (await insertEvent(event, posterUrl)) as EventRow;
  });

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as EventRow[];
});
