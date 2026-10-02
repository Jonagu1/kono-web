import type { Publication } from '../types/publication';


/**
 * Publicaciones oficiales del portal de Información Universitaria.
 * 
 * ¿CÓMO AGREGAR NUEVAS PUBLICACIONES FUERA DE LA PÁGINA PRINCIPAL?
 * Simplemente envía la imagen o afiche con los detalles por el chat del asistente AI.
 * El asistente guardará la imagen en public/posts/ e insertará un nuevo objeto aquí.
 * El público no tiene permisos para subir publicaciones desde la web.
 */
export const initialPublications: Publication[] = [
  {
    id: 'ingenia-lab-2026',
    title: 'IngeniaLab · Programa de Preincubación de Negocios',
    subtitle: '¿Tienes un proyecto tecnológico en marcha?',
    organization: 'Facultad de Ciencias de la Ingeniería · UACh',
    category: 'Emprendimiento',
    date: 'Viernes 4 de Septiembre',
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
    image: '/posts/ingenia-lab.jpg',
    actionLink: {
      url: 'https://luma.com/6tds0934',
      label: 'Inscribirse en Luma'
    },
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
    image: '/posts/club-innovacion-sostenible.png',
    actionLink: {
      url: 'https://instagram.com',
      label: 'Saber más del Club'
    },
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
    date: '1 y 2 de Octubre',
    time: 'Jornada Deportiva',
    location: 'Gimnasio Universitario UACh, Valdivia',
    campus: 'Valdivia',
    description: 'Más de 160 estudiantes deportistas, representantes de 15 instituciones de educación superior de todo el país, participarán este 1 y 2 de octubre en el Campeonato Nacional Universitario (CNU) de Judo.',
    highlights: [
      'Más de 160 deportistas en competencia',
      '15 universidades nacionales',
      'Entrada liberada para la comunidad universitaria',
      'Auspiciado por Molten, Macron y Mitre'
    ],
    image: '/posts/campeonato-judo.jpg',
    actionLink: {
      url: 'https://www.fenaude.cl',
      label: 'Visitar fenaude.cl'
    },
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
    date: 'Lunes 5 de Octubre',
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
    image: '/posts/sesion-mindfulness.png',
    actionLink: {
      url: '#',
      label: 'Más información'
    },
    tags: ['Mindfulness', 'Salud Mental', 'Campus Isla Teja', 'Bienestar UACh'],
    featured: false,
    isRecent: true
  }
];
