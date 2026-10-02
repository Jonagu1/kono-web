import type { Publication } from '../types/publication';
import ingeniaLabImg from '../assets/posts/ingenia-lab.jpg';
import clubInnovacionImg from '../assets/posts/club-innovacion-sostenible.png';
import campeonatoJudoImg from '../assets/posts/campeonato-judo.jpg';
import sesionMindfulnessImg from '../assets/posts/sesion-mindfulness.png';

/**
 * Publicaciones oficiales del portal de Información Universitaria.
 * Las imágenes son importadas directamente como módulos para garantizar
 * que Vite procese y emita las rutas relativas correctas en GitHub Pages.
 * 
 * Sin links externos: las acciones de redirección se mantienen no funcionales.
 */
export const initialPublications: Publication[] = [
  {
    id: 'ingenia-lab-2026',
    title: 'IngeniaLab · Programa de Preincubación de Negocios',
    subtitle: '¿Tienes un proyecto tecnológico en marcha?',
    organization: 'Facultad de Ciencias de la Ingeniería · UACh',
    category: 'Emprendimiento',
    date: 'Viernes 4 de Septiembre 2026',
    eventDates: ['2026-09-04'],
    time: '15:30 hrs',
    location: 'Centro de i+e 14K, Campus Miraflores, Valdivia',
    campus: 'Campus Miraflores',
    description: 'Postula tu iniciativa al Programa de preincubación de negocios "IngeniaLab" de la Facultad de Ciencias de la Ingeniería. Accede a herramientas clave para acelerar tu emprendimiento tecnológico.',
    highlights: [
      'Talleres y charlas formativas',
      'Oportunidades de financiamiento',
      'Instancias de networking',
      'Mentorías personalizadas 1 a 1'
    ],
    image: ingeniaLabImg,
    infoNote: 'Convocatoria y postulación presencial en Espacio 14K',
    tags: ['IngeniaLab', 'Preincubación', '14K', 'InnovING 2030', 'ANID', 'Emprendimiento'],
    featured: true,
    isRecent: true
  },
  {
    id: 'club-innovacion-sostenible',
    title: 'Club de Innovación Sostenible',
    subtitle: '¿Tienes un desafío que quieres resolver?',
    organization: 'Club de Innovación Sostenible · Facultad de Ciencias de la Ingeniería UACh',
    category: 'Club',
    date: 'Todos los Lunes',
    eventDates: [
      '2026-09-07',
      '2026-09-14',
      '2026-09-21',
      '2026-09-28',
      '2026-10-05',
      '2026-10-12',
      '2026-10-19',
      '2026-10-26'
    ],
    time: '15:50 hrs',
    location: 'Espacio 14K Miraflores',
    campus: 'Campus Miraflores',
    description: 'Únete al Club de Innovación Sostenible, trae tu proyecto y avanza junto a una comunidad de estudiantes apasionados por la tecnología, la innovación y el impacto ambiental.',
    highlights: [
      'Espacio colaborativo de trabajo',
      'Resolución de desafíos reales',
      'Reuniones semanales en el 14K',
      'Comunidad interdisciplinaria'
    ],
    image: clubInnovacionImg,
    infoNote: 'Encuentros abiertos cada lunes en el 14K',
    tags: ['Club de Innovación', 'Sostenibilidad', 'Espacio 14K', 'Miraflores', 'UACh'],
    featured: true,
    isRecent: true
  },
  {
    id: 'campeonato-nacional-judo-valdivia',
    title: 'Campeonato Nacional Universitario de Judo en Valdivia',
    subtitle: 'Edición 2026 · Organizado por la UACh',
    organization: 'FENAUDE Chile & Universidad Austral de Chile',
    category: 'Deportes',
    date: '1 y 2 de Octubre 2026',
    eventDates: ['2026-10-01', '2026-10-02'],
    time: 'Jornada Deportiva Completa',
    location: 'Gimnasio Universitario UACh, Valdivia',
    campus: 'Valdivia',
    description: 'Más de 160 estudiantes deportistas, representantes de 15 instituciones de educación superior de todo el país, participarán este 1 y 2 de octubre en el Campeonato Nacional Universitario (CNU) de Judo.',
    highlights: [
      'Más de 160 deportistas en competencia',
      '15 universidades nacionales',
      'Entrada liberada para la comunidad universitaria',
      'Auspiciado por Molten, Macron y Mitre'
    ],
    image: campeonatoJudoImg,
    infoNote: 'Entrada liberada al Gimnasio Universitario UACh',
    tags: ['Judo', 'CNU 2026', 'FENAUDE', 'Deporte Universitario', 'Valdivia', 'UACh'],
    featured: false,
    isRecent: false
  },
  {
    id: 'sesion-abierta-mindfulness',
    title: 'Sesión Abierta de Mindfulness',
    subtitle: '¡No necesitas experiencia previa!',
    organization: 'Centro de Salud Universitario · UACh',
    category: 'Salud & Bienestar',
    date: 'Lunes 5 de Octubre 2026',
    eventDates: ['2026-10-05'],
    time: '13:00 a 14:00 hrs',
    location: 'Sala Espejos, Campus Isla Teja',
    campus: 'Campus Isla Teja',
    description: 'Espacio de pausa activa, respiración y consciencia plena guiado por el Centro de Salud Universitario. Un momento para desconectar de la rutina académica y cuidar de tu bienestar mental.',
    highlights: [
      'No se requiere experiencia previa',
      'Entrada libre y gratuita',
      'Enfoque en salud mental universitaria',
      'Ubicación central en Isla Teja'
    ],
    image: sesionMindfulnessImg,
    infoNote: 'Acceso libre en Sala Espejos (Isla Teja)',
    tags: ['Mindfulness', 'Salud Mental', 'Campus Isla Teja', 'Bienestar UACh'],
    featured: false,
    isRecent: true
  }
];
