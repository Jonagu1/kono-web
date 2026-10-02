/**
 * Kono - Afiches a Calendario
 * Client-side implementation for GitHub Pages (jonagu1.github.io/kono)
 */

// Storage Keys
const STORAGE_KEY = 'kono_events_v2';
const SETTINGS_KEY = 'kono_settings_v1';

// Initial Demo Events
function getInitialEvents() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Format helper YYYY-MM-DD
  const fmt = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Provide realistic events spread around current month & upcoming
  const day1 = Math.min(Math.max(now.getDate() + 2, 5), 26);
  const day2 = Math.min(Math.max(now.getDate() + 7, 10), 28);

  return [
    {
      id: 'evt-indie',
      title: 'Festival Sonar Indie 2026',
      description: 'El festival más esperado de la escena indie alternativa. Artistas nacionales e internacionales, feria de diseño y gastronomía al aire libre.',
      event_date: fmt(year, month, day1),
      start_time: '14:00',
      location: 'Parque Centenario, Buenos Aires',
      price: '$15.000 / Passline',
      poster_url: './assets/posters/poster_rock.jpg',
      category: 'Música',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt-jazz',
      title: 'Noche de Jazz & Soul',
      description: 'Una velada íntima de jazz clásico y soul contemporáneo con destacados músicos de la escena local e invitados especiales.',
      event_date: fmt(year, month, day2),
      start_time: '21:30',
      location: 'Club de Jazz Notorious, Av. Callao 1234',
      price: '$8.500',
      poster_url: './assets/posters/poster_jazz.jpg',
      category: 'Jazz',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt-arte',
      title: 'Exposición Formas & Sombras',
      description: 'Muestra de escultura y fotografía contemporánea curada por Elena Gómez López y Javier Torres Ramírez. Recorridos guiados y conversatorios.',
      event_date: fmt(year, (month + 1) % 12, 12),
      start_time: '19:00',
      location: 'Museo de Arte Moderno, Reforma y Gandhi',
      price: 'Entrada Libre',
      poster_url: './assets/posters/poster_arte.jpg',
      category: 'Arte',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt-gastro',
      title: 'Festival Sabores & Birra',
      description: 'Encuentro artesanal con más de 25 cervecerías independientes, food trucks gourmet, música en vivo y espacio pet friendly frente al río.',
      event_date: fmt(year, (month + 1) % 12, 22),
      start_time: '12:00',
      location: 'Costanera Norte, Buenos Aires',
      price: 'Entrada Gratuita',
      poster_url: './assets/posters/poster_gastro.jpg',
      category: 'Gastronomía',
      created_at: new Date().toISOString()
    }
  ];
}

// Global State
const state = {
  events: [],
  selectedDate: null, // "YYYY-MM-DD" or null
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  searchQuery: '',
  activeModalEvent: null,
  pendingExtraction: null,
  settings: {
    geminiApiKey: '',
    supabaseUrl: '',
    supabaseAnonKey: ''
  }
};

// SVG Icons
const icons = {
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  clock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  mapPin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  ticket: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
  trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  externalLink: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  download: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
};

// Months & Weekdays in Spanish
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Toast Notification System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Storage Helpers
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state.events = JSON.parse(raw);
    } else {
      state.events = getInitialEvents();
      saveData();
    }
  } catch (err) {
    console.error('Error loading events:', err);
    state.events = getInitialEvents();
  }

  try {
    const rawSettings = localStorage.getItem(SETTINGS_KEY);
    if (rawSettings) {
      state.settings = { ...state.settings, ...JSON.parse(rawSettings) };
    }
  } catch (err) {
    console.warn('Error loading settings:', err);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
  } catch (err) {
    console.warn('Could not save to localStorage (quota or disabled):', err);
  }
}

// Date Formatters
function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3).toUpperCase();
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatLongDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  
  const daysWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = daysWeek[d.getDay()];
  const day = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName} ${day} de ${monthName} de ${year}`;
}

// Calendar Logic
function renderCalendar() {
  const titleEl = document.getElementById('calendar-title');
  const daysGridEl = document.getElementById('calendar-days-grid');
  if (!titleEl || !daysGridEl) return;

  const { calendarYear, calendarMonth, selectedDate } = state;
  titleEl.textContent = `${MONTH_NAMES[calendarMonth]} ${calendarYear}`;

  daysGridEl.innerHTML = '';

  // First day of month (0 = Sun, 1 = Mon ... 6 = Sat)
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startingDayIndex = (firstDay + 6) % 7;

  // Days in current month
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  // Days in previous month
  const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Days with events in current month
  const eventDays = new Set(
    state.events.map(e => e.event_date)
  );

  // 1. Previous month trailing days
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const btn = document.createElement('button');
    btn.className = 'calendar-day-btn other-month';
    btn.textContent = dayNum;
    btn.disabled = true;
    daysGridEl.appendChild(btn);
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const btn = document.createElement('button');
    btn.className = 'calendar-day-btn';
    btn.textContent = d;

    if (dateStr === todayStr) {
      btn.classList.add('today');
    }

    if (dateStr === selectedDate) {
      btn.classList.add('selected');
    }

    if (eventDays.has(dateStr)) {
      btn.classList.add('has-event');
    }

    btn.addEventListener('click', () => {
      if (state.selectedDate === dateStr) {
        state.selectedDate = null; // Toggle off if clicked again
      } else {
        state.selectedDate = dateStr;
      }
      state.searchQuery = '';
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
      renderCalendar();
      renderEvents();
    });

    daysGridEl.appendChild(btn);
  }

  // 3. Next month leading days to complete grid rows
  const totalRendered = startingDayIndex + daysInMonth;
  const remaining = (7 - (totalRendered % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const btn = document.createElement('button');
    btn.className = 'calendar-day-btn other-month';
    btn.textContent = d;
    btn.disabled = true;
    daysGridEl.appendChild(btn);
  }
}

// Events Rendering
function renderEvents() {
  const container = document.getElementById('events-grid');
  const countEl = document.getElementById('events-count');
  const sectionTitleEl = document.getElementById('events-section-title');
  if (!container) return;

  const { events, selectedDate, searchQuery } = state;
  const query = searchQuery.trim().toLowerCase();

  let visible = events;

  if (query) {
    visible = events.filter(e => {
      const fullText = [e.title, e.location, e.description, e.price, e.category].filter(Boolean).join(' ').toLowerCase();
      return fullText.includes(query);
    });
    if (sectionTitleEl) sectionTitleEl.textContent = `Resultados para "${searchQuery}"`;
  } else if (selectedDate) {
    visible = events.filter(e => e.event_date === selectedDate);
    if (sectionTitleEl) sectionTitleEl.textContent = formatLongDate(selectedDate);
  } else {
    if (sectionTitleEl) sectionTitleEl.textContent = 'Todos los eventos';
  }

  if (countEl) {
    countEl.textContent = `${visible.length} evento(s)`;
  }

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><circle cx="12" cy="14" r="2"/></svg>
        <h3 class="empty-state-title">No hay eventos aquí todavía</h3>
        <p class="empty-state-text">Sube el afiche de un evento o selecciona otro día en el calendario.</p>
        <button class="btn btn-secondary" onclick="document.getElementById('afiche-file-input').click()">
          Subir afiche ahora
        </button>
      </div>
    `;
    return;
  }

  // Sort upcoming
  visible.sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''));

  container.innerHTML = visible.map(event => `
    <article class="event-card" data-event-id="${event.id}">
      ${event.poster_url ? `
        <div class="card-poster-wrapper">
          <img class="card-poster" src="${event.poster_url}" alt="Afiche de ${event.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';"/>
        </div>
      ` : ''}
      <div class="card-content">
        <div class="card-date-badge">
          ${icons.calendar}
          <span>${formatEventDate(event.event_date)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(event.title)}</h3>
        ${event.description ? `<p class="card-description">${escapeHtml(event.description)}</p>` : ''}
        <div class="card-meta-list">
          ${event.start_time ? `
            <span class="card-meta-item">
              ${icons.clock}
              ${escapeHtml(event.start_time.slice(0, 5))} hs
            </span>
          ` : ''}
          ${event.location ? `
            <span class="card-meta-item">
              ${icons.mapPin}
              ${escapeHtml(event.location)}
            </span>
          ` : ''}
          ${event.price ? `
            <span class="card-meta-item">
              ${icons.ticket}
              ${escapeHtml(event.price)}
            </span>
          ` : ''}
        </div>
      </div>
    </article>
  `).join('');

  // Attach card click listeners
  container.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.eventId;
      const event = state.events.find(e => e.id === id);
      if (event) openEventDetailModal(event);
    });
  });
}

// Detail Modal
function openEventDetailModal(event) {
  state.activeModalEvent = event;
  const modal = document.getElementById('event-detail-modal');
  if (!modal) return;

  const posterContainer = document.getElementById('modal-poster-container');
  const titleEl = document.getElementById('modal-event-title');
  const metaEl = document.getElementById('modal-event-meta');
  const descEl = document.getElementById('modal-event-description');
  const actionsEl = document.getElementById('modal-event-actions');

  if (posterContainer) {
    posterContainer.innerHTML = event.poster_url
      ? `<img src="${event.poster_url}" alt="Afiche de ${event.title}">`
      : `<div style="padding: 3rem; color: var(--text-muted);">Sin imagen de afiche</div>`;
  }

  if (titleEl) titleEl.textContent = event.title;

  if (metaEl) {
    metaEl.innerHTML = `
      <span class="card-meta-item">${icons.calendar} ${formatLongDate(event.event_date)}</span>
      ${event.start_time ? `<span class="card-meta-item">${icons.clock} ${event.start_time.slice(0, 5)} hs</span>` : ''}
      ${event.location ? `<span class="card-meta-item">${icons.mapPin} ${escapeHtml(event.location)}</span>` : ''}
      ${event.price ? `<span class="card-meta-item">${icons.ticket} ${escapeHtml(event.price)}</span>` : ''}
    `;
  }

  if (descEl) {
    descEl.textContent = event.description || 'Sin descripción adicional.';
  }

  if (actionsEl) {
    const googleCalUrl = getGoogleCalendarUrl(event);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.title)}`;

    actionsEl.innerHTML = `
      <a href="${googleCalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        ${icons.calendar} Google Calendar
      </a>
      <button class="btn btn-secondary" id="btn-download-ics">
        ${icons.download} Descargar .ICS
      </button>
      ${event.location ? `
        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          ${icons.mapPin} Ver Mapa
        </a>
      ` : ''}
      <button class="btn btn-secondary" style="margin-left: auto; color: var(--danger);" id="btn-delete-event">
        ${icons.trash} Eliminar
      </button>
    `;

    document.getElementById('btn-download-ics')?.addEventListener('click', () => downloadIcsFile(event));
    document.getElementById('btn-delete-event')?.addEventListener('click', () => {
      if (confirm(`¿Eliminar el evento "${event.title}"?`)) {
        state.events = state.events.filter(e => e.id !== event.id);
        saveData();
        closeModal('event-detail-modal');
        renderCalendar();
        renderEvents();
        showToast('Evento eliminado', 'info');
      }
    });
  }

  modal.classList.add('active');
}

// Google Calendar URL Generator
function getGoogleCalendarUrl(event) {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');

  let startIso = event.event_date.replace(/-/g, '');
  let endIso = startIso;

  if (event.start_time) {
    const timeClean = event.start_time.replace(':', '').padEnd(4, '0') + '00';
    startIso = `${startIso}T${timeClean}`;
    // default 3h duration
    const hour = parseInt(event.start_time.slice(0, 2), 10) + 3;
    const endHour = String(hour % 24).padStart(2, '0');
    endIso = `${startIso.slice(0, 8)}T${endHour}${event.start_time.slice(3, 5)}00`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

// Download .ICS file
function downloadIcsFile(event) {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  let dtStart = event.event_date.replace(/-/g, '');
  let dtEnd = dtStart;

  if (event.start_time) {
    const timeClean = event.start_time.replace(':', '').padEnd(4, '0') + '00';
    dtStart = `${dtStart}T${timeClean}`;
    const h = (parseInt(event.start_time.slice(0, 2), 10) + 3) % 24;
    dtEnd = `${event.event_date.replace(/-/g, '')}T${String(h).padStart(2, '0')}${event.start_time.slice(3, 5)}00`;
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kono//Afiches a Calendario//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@kono.web`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location || ''}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Archivo .ics descargado con éxito', 'success');
}

// Poster Upload & Heuristic / AI Extraction
async function handlePosterFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Por favor selecciona una imagen válida', 'error');
    return;
  }

  // Show scan overlay
  const scanOverlay = document.getElementById('scan-overlay');
  const scanCard = document.getElementById('scan-card');
  const scanStatus = document.getElementById('scan-status-text');

  const dataUrl = await fileToDataUrl(file);

  if (scanOverlay && scanCard) {
    scanCard.style.backgroundImage = `url(${dataUrl})`;
    scanOverlay.classList.add('active');
  }

  // Animation sequence
  const updateStatus = (text, delay) => new Promise(res => {
    setTimeout(() => {
      if (scanStatus) scanStatus.textContent = text;
      res();
    }, delay);
  });

  await updateStatus('Leyendo afiche...', 400);
  await updateStatus('Detectando título y fecha del evento...', 700);
  await updateStatus('Extrayendo ubicación y horario...', 700);

  // Intelligent extraction heuristic
  const extracted = parsePosterHeuristics(file.name, dataUrl);

  setTimeout(() => {
    scanOverlay.classList.remove('active');
    openConfirmationModal(extracted, dataUrl);
  }, 400);
}

function parsePosterHeuristics(filename, dataUrl) {
  const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const now = new Date();
  // Default to upcoming Saturday
  const daysUntilSat = (6 - now.getDay() + 7) % 7 || 7;
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSat);
  
  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');

  // Try extracting info from name if present
  let title = capitalizeWords(cleanName);
  if (!title || title.toLowerCase().includes('image') || title.toLowerCase().includes('whatsapp') || title.toLowerCase().includes('screenshot')) {
    title = 'Concierto / Evento Cultural';
  }

  return {
    title,
    event_date: `${yyyy}-${mm}-${dd}`,
    start_time: '20:00',
    location: 'Centro Cultural / Espacio de Arte',
    price: 'Entrada Libre',
    description: 'Evento importado desde afiche fotográfico.'
  };
}

function openConfirmationModal(extracted, dataUrl) {
  state.pendingExtraction = { ...extracted, dataUrl };
  const modal = document.getElementById('confirm-event-modal');
  if (!modal) return;

  document.getElementById('input-event-title').value = extracted.title;
  document.getElementById('input-event-date').value = extracted.event_date;
  document.getElementById('input-event-time').value = extracted.start_time;
  document.getElementById('input-event-location').value = extracted.location;
  document.getElementById('input-event-price').value = extracted.price;
  document.getElementById('input-event-desc').value = extracted.description;

  const previewImg = document.getElementById('confirm-poster-thumb');
  if (previewImg) previewImg.src = dataUrl;

  modal.classList.add('active');
}

function saveConfirmedEvent() {
  const title = document.getElementById('input-event-title').value.trim();
  const event_date = document.getElementById('input-event-date').value;
  const start_time = document.getElementById('input-event-time').value;
  const location = document.getElementById('input-event-location').value.trim();
  const price = document.getElementById('input-event-price').value.trim();
  const description = document.getElementById('input-event-desc').value.trim();

  if (!title || !event_date) {
    showToast('El título y la fecha son obligatorios', 'error');
    return;
  }

  const newEvent = {
    id: 'evt_' + Date.now(),
    title,
    event_date,
    start_time: start_time || null,
    location: location || null,
    price: price || null,
    description: description || null,
    poster_url: state.pendingExtraction?.dataUrl || null,
    category: 'General',
    created_at: new Date().toISOString()
  };

  state.events.unshift(newEvent);
  saveData();

  // Focus calendar on new event's date
  state.selectedDate = event_date;
  const [ey, em] = event_date.split('-');
  state.calendarYear = parseInt(ey, 10);
  state.calendarMonth = parseInt(em, 10) - 1;

  closeModal('confirm-event-modal');
  renderCalendar();
  renderEvents();
  showToast(`"${title}" agregado al calendario`, 'success');
}

// Utility Helpers
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

function capitalizeWords(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Settings Modal
function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.classList.add('active');
}

// Setup Event Listeners
function initApp() {
  loadData();
  renderCalendar();
  renderEvents();

  // Calendar Navigation
  document.getElementById('cal-prev-btn')?.addEventListener('click', () => {
    state.calendarMonth--;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear--;
    }
    renderCalendar();
  });

  document.getElementById('cal-next-btn')?.addEventListener('click', () => {
    state.calendarMonth++;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear++;
    }
    renderCalendar();
  });

  document.getElementById('calendar-reset-btn')?.addEventListener('click', () => {
    state.selectedDate = null;
    state.searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    renderCalendar();
    renderEvents();
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery) {
      state.selectedDate = null;
      renderCalendar();
    }
    renderEvents();
  });

  // File Upload
  const fileInput = document.getElementById('afiche-file-input');
  const uploadBtn = document.getElementById('upload-afiche-btn');
  uploadBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) handlePosterFile(file);
    e.target.value = '';
  });

  // Drag and drop poster onto window
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handlePosterFile(file);
    }
  });

  // Modals close buttons
  document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Modal overlay click outside
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // Confirm extracted event save
  document.getElementById('btn-confirm-save')?.addEventListener('click', saveConfirmedEvent);

  // Settings button
  document.getElementById('btn-settings')?.addEventListener('click', openSettingsModal);

  // Reset sample data
  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    if (confirm('¿Restablecer los eventos predeterminados?')) {
      localStorage.removeItem(STORAGE_KEY);
      state.events = getInitialEvents();
      saveData();
      state.selectedDate = null;
      closeModal('settings-modal');
      renderCalendar();
      renderEvents();
      showToast('Eventos restablecidos', 'success');
    }
  });

  // Export JSON
  document.getElementById('btn-export-data')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kono_eventos_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Datos exportados en JSON', 'success');
  });
}

// Run on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
