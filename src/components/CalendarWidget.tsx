import React, { useState } from 'react';
import type { Publication } from '../types/publication';

interface CalendarWidgetProps {
  publications: Publication[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  publications,
  selectedDate,
  onSelectDate
}) => {
  // Inicializar en Octubre 2026 (donde se concentran los eventos de la UACh)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = Octubre

  // Mapa de fechas que tienen eventos: fecha -> lista de publicaciones
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, Publication[]>();
    publications.forEach((pub) => {
      pub.eventDates.forEach((dateStr) => {
        const list = map.get(dateStr) || [];
        list.push(pub);
        map.set(dateStr, list);
      });
    });
    return map;
  }, [publications]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const jumpToMonth = (monthIndex: number, year: number) => {
    setCurrentMonth(monthIndex);
    setCurrentYear(year);
  };

  // Calcular días del mes
  // primer día del mes: 0 = Dom, 1 = Lun ... 6 = Sáb
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Ajustar para que Lunes sea 0 y Domingo sea 6
  const startingDayIndex = (firstDay + 6) % 7;

  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonthDays = [];
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  const currentMonthDays = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = eventsByDate.get(dateStr) || [];
    currentMonthDays.push({
      day: d,
      dateStr,
      hasEvents: dayEvents.length > 0,
      events: dayEvents
    });
  }

  return (
    <div className="calendar-widget-card">
      <div className="calendar-header-nav">
        <div className="calendar-title-group">
          <span className="calendar-icon">📅</span>
          <h3 className="calendar-month-title">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="calendar-nav-buttons">
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Mes anterior"
            title="Mes anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={handleNextMonth}
            aria-label="Mes siguiente"
            title="Mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-quick-jumps">
        <button
          type="button"
          className={`quick-jump-btn ${currentMonth === 8 && currentYear === 2026 ? 'active' : ''}`}
          onClick={() => jumpToMonth(8, 2026)}
        >
          Sep 2026
        </button>
        <button
          type="button"
          className={`quick-jump-btn ${currentMonth === 9 && currentYear === 2026 ? 'active' : ''}`}
          onClick={() => jumpToMonth(9, 2026)}
        >
          Oct 2026
        </button>
      </div>

      <div className="calendar-weekdays-row">
        {WEEKDAYS.map((w) => (
          <span key={w} className="calendar-weekday-label">
            {w}
          </span>
        ))}
      </div>

      <div className="calendar-grid-days">
        {prevMonthDays.map((d, idx) => (
          <div key={`prev-${idx}`} className="calendar-day-cell other-month">
            {d}
          </div>
        ))}

        {currentMonthDays.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <button
              key={item.dateStr}
              type="button"
              className={`calendar-day-cell current-month ${
                item.hasEvents ? 'has-event' : ''
              } ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (isSelected) {
                  onSelectDate(null); // Quitar filtro al hacer clic de nuevo
                } else {
                  onSelectDate(item.dateStr);
                }
              }}
              title={
                item.hasEvents
                  ? `${item.events.length} evento(s): ${item.events
                      .map((e) => e.title)
                      .join(', ')}`
                  : undefined
              }
            >
              <span className="day-number">{item.day}</span>
              {item.hasEvents && (
                <span className="event-dot" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="calendar-active-filter-alert">
          <div className="active-filter-text">
            <span>Filtrando por fecha:</span>
            <strong>{selectedDate}</strong>
          </div>
          <button
            type="button"
            className="calendar-clear-filter-btn"
            onClick={() => onSelectDate(null)}
          >
            Mostrar todos
          </button>
        </div>
      )}
    </div>
  );
};
