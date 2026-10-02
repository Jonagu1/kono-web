export type Category = 
  | 'Todas'
  | 'Emprendimiento'
  | 'Club'
  | 'Deportes'
  | 'Salud & Bienestar';

export type Campus = 
  | 'Todos'
  | 'Campus Miraflores'
  | 'Campus Isla Teja'
  | 'Valdivia';

export interface Publication {
  id: string;
  title: string;
  subtitle?: string;
  organization: string;
  category: Exclude<Category, 'Todas'>;
  date: string;
  eventDates: string[]; // Formato YYYY-MM-DD para el calendario
  time?: string;
  location: string;
  campus: Exclude<Campus, 'Todos'>;
  description: string;
  highlights?: string[];
  image: string;
  tags: string[];
  featured?: boolean;
  isRecent?: boolean;
  infoNote?: string; // Nota informativa en lugar de enlaces externos
}
