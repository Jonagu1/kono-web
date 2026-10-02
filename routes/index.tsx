import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useRef, useState } from "react";
import { CalendarDays, ImagePlus, Loader2, MapPin, Clock, Ticket, Search } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createEventFromPoster, listEvents, type EventRow } from "@/lib/events.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afiche a Calendario | Eventos desde fotos" },
      {
        name: "description",
        content:
          "Sube la foto de un afiche y el evento se agrega solo al calendario. Busca eventos por dia, lugar y horario.",
      },
      { property: "og:title", content: "Afiche a Calendario | Eventos desde fotos" },
      {
        property: "og:description",
        content:
          "Sube la foto de un afiche y el evento se agrega solo al calendario. Busca eventos por dia, lugar y horario.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

function Index() {
  const queryClient = useQueryClient();
  const fetchEvents = useServerFn(listEvents);
  const createEvent = useServerFn(createEventFromPoster);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [search, setSearch] = useState("");
  const [activeEvent, setActiveEvent] = useState<EventRow | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const dataUrl = await fileToDataUrl(file);
      return createEvent({ data: { dataUrl } });
    },
    onSuccess: (event: EventRow) => {
      toast.success(`"${event.title}" agregado al calendario`);
      setSelectedDate(parseISO(event.event_date));
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => toast.error(error.message || "No se pudo procesar el afiche"),
  });

  const eventDays = useMemo(() => events.map((e) => parseISO(e.event_date)), [events]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term) {
      return events.filter((e) =>
        [e.title, e.location, e.description].filter(Boolean).join(" ").toLowerCase().includes(term),
      );
    }
    if (!selectedDate) return events;
    return events.filter((e) => isSameDay(parseISO(e.event_date), selectedDate));
  }, [events, search, selectedDate]);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs uppercase tracking-widest">
            Afiches → Calendario
          </Badge>
          <h1 className="max-w-2xl text-4xl leading-tight font-bold md:text-6xl">
            Sube el <span className="text-gradient">afiche</span>, nosotros lo ponemos en el
            calendario
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Toma una foto del cartel de un evento. Leemos titulo, fecha, hora y lugar
            automaticamente y lo agregamos al calendario compartido.
          </p>
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
              e.target.value = "";
            }}
          />
          <Button
            size="lg"
            className="w-full gap-2 shadow-[var(--shadow-glow)] md:w-auto"
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {upload.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Leyendo afiche...
              </>
            ) : (
              <>
                <ImagePlus className="size-4" /> Subir afiche
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit p-4 shadow-[var(--shadow-panel)]">
          <Calendar
            mode="single"
            locale={es}
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d);
              setSearch("");
            }}
            modifiers={{ hasEvent: eventDays }}
            modifiersClassNames={{
              hasEvent: "relative font-semibold text-primary after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-primary",
            }}
            className="w-full"
          />
          <div className="mt-4 border-t pt-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o lugar"
                className="pl-9"
                maxLength={80}
              />
            </div>
          </div>
        </Card>

        <section>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              {search
                ? `Resultados de "${search}"`
                : selectedDate
                  ? format(selectedDate, "EEEE d 'de' MMMM", { locale: es })
                  : "Todos los eventos"}
            </h2>
            <span className="text-sm text-muted-foreground">{visible.length} evento(s)</span>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Cargando eventos...</p>
          ) : visible.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 border-dashed p-12 text-center">
              <CalendarDays className="size-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                No hay eventos aqui todavia. Sube un afiche para empezar.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {visible.map((event) => (
                <li key={event.id}>
                  <Card
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveEvent(event)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveEvent(event);
                      }
                    }}
                    className="group h-full cursor-pointer gap-0 overflow-hidden p-0 transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {event.poster_url && (
                      <img
                        src={event.poster_url}
                        alt={`Afiche de ${event.title}`}
                        loading="lazy"
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="space-y-3 p-5">
                      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
                        <CalendarDays className="size-3.5" />
                        {format(parseISO(event.event_date), "d MMM yyyy", { locale: es })}
                      </div>
                      <h3 className="text-lg leading-snug font-semibold">{event.title}</h3>
                      {event.description && (
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {event.start_time && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            {event.start_time.slice(0, 5)}
                          </span>
                        )}
                        {event.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5" />
                            {event.location}
                          </span>
                        )}
                        {event.price && (
                          <span className="inline-flex items-center gap-1.5">
                            <Ticket className="size-3.5" />
                            {event.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Dialog open={!!activeEvent} onOpenChange={(open) => !open && setActiveEvent(null)}>
        <DialogContent className="max-w-3xl gap-4 overflow-hidden p-0">
          {activeEvent?.poster_url ? (
            <div className="flex justify-center bg-black/40 p-4">
              <img
                src={activeEvent.poster_url}
                alt={`Afiche de ${activeEvent.title}`}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              Este evento no tiene afiche
            </div>
          )}
          <div className="space-y-3 px-6 pb-6">
            <DialogTitle className="text-xl">{activeEvent?.title}</DialogTitle>
            <DialogDescription className="flex flex-wrap gap-3 text-sm">
              {activeEvent?.event_date && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {format(parseISO(activeEvent.event_date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              )}
              {activeEvent?.start_time && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {activeEvent.start_time.slice(0, 5)}
                </span>
              )}
              {activeEvent?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {activeEvent.location}
                </span>
              )}
              {activeEvent?.price && (
                <span className="inline-flex items-center gap-1.5">
                  <Ticket className="size-3.5" />
                  {activeEvent.price}
                </span>
              )}
            </DialogDescription>
            {activeEvent?.description && (
              <p className="text-sm text-muted-foreground">{activeEvent.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
