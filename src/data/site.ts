// Single source of truth for personal info and links.
// Edit here, and every page updates. Text that changes by language is { es, en }.
import type { Lang } from '../i18n';

type L10n = Record<Lang, string>;

export const site = {
  name: 'Juan Miguel Paez Tatis',
  short: 'juanmi paez',
  nickname: 'Juanmi',
  tagline: {
    es: 'Convierto matemáticas en código que funciona.',
    en: 'I turn math into working code.',
  } as L10n,
  description: {
    es: 'Juan Miguel Paez Tatis (Juanmi): estudiante de Ciencias de la Computación en la Universidad Nacional de Colombia (UNAL) y monitor de Álgebra Lineal.',
    en: 'Juan Miguel Paez Tatis (Juanmi): Computer Science student at Universidad Nacional de Colombia (UNAL) and Linear Algebra teaching assistant.',
  } as L10n,
  bio: {
    es: 'estudiante de Ciencias de la Computación en la Universidad Nacional de Colombia (UNAL), con grado previsto para febrero de 2028. Me gusta convertir matemáticas en código que funciona: álgebra lineal, optimización, computación paralela y datos.',
    en: 'a Computer Science student at Universidad Nacional de Colombia (UNAL), graduating in February 2028. I like turning math into working code: linear algebra, optimization, parallel computing and data.',
  } as L10n,
  email: 'juan.paeztatis@gmail.com',
  links: {
    github: 'https://github.com/Juanmipaez',
    linkedin: 'https://www.linkedin.com/in/juanmiguelpaez/',
  },
  // TODO(cv): drop the PDFs in public/cv/ with these names.
  cv: {
    en: '/cv/CV_JuanPaez_en.pdf',
    es: '/cv/CV_JuanPaez_es.pdf',
  } as L10n,
};

// Paths are the same in both languages; labels come from src/i18n/ui.ts.
export const nav = [
  { key: 'nav.projects', href: '/projects' },
  { key: 'nav.library', href: '/library' },
  { key: 'nav.writing', href: null, soon: true },
  { key: 'nav.about', href: '/about' },
] as const;

// "now" list on the home page. Keep it to 3 short, true lines.
export const now: { label: L10n; text: L10n }[] = [
  {
    label: { es: 'enseñando', en: 'teaching' },
    text: { es: 'Monitor de Álgebra Lineal en la UNAL.', en: 'Linear Algebra teaching assistant at UNAL.' },
  },
  {
    label: { es: 'construyendo', en: 'building' },
    text: {
      es: 'Un ordenamiento paralelo de datos de retrasos de vuelos (Python, C, CUDA) y mi propia app de presupuesto.',
      en: 'A parallel sort of flight-delay data (Python, C, CUDA) and my own budgeting app.',
    },
  },
  {
    label: { es: 'organizando', en: 'organizing' },
    text: {
      es: 'Mis apuntes de clase, escritos en LaTeX, en la biblioteca de este sitio.',
      en: 'My course notes, written in LaTeX, into the library on this site.',
    },
  },
];

export const experience: { role: L10n; org: string; period: L10n; note?: L10n }[] = [
  {
    // TODO(juanmi): confirm the official Spanish title ("Monitor", "Estudiante auxiliar", …).
    role: { es: 'Monitor de Álgebra Lineal', en: 'Teaching Assistant, Linear Algebra' },
    org: 'Universidad Nacional de Colombia',
    period: { es: '2026 – actualidad', en: '2026 – present' },
  },
  {
    role: { es: 'Live Feed Analyst', en: 'Live Feed Analyst' },
    org: 'Genius Sports',
    period: { es: '2025', en: '2025' },
    note: {
      es: 'Datos en tiempo real de partidos de fútbol en vivo de todo el mundo.',
      en: 'Real-time data for live football matches worldwide.',
    },
  },
  {
    role: {
      es: 'Representante de servicio al cliente (cuenta de AT&T)',
      en: 'Customer Service Representative (AT&T account)',
    },
    org: 'Teleperformance',
    period: { es: '2024', en: '2024' },
    note: { es: 'Soporte en inglés para clientes de EE. UU.', en: 'Support for U.S. customers, in English.' },
  },
];

export const education = [
  {
    degree: { es: 'Pregrado en Ciencias de la Computación', en: 'B.S. Computer Science' } as L10n,
    org: 'Universidad Nacional de Colombia (UNAL)',
    period: { es: '2023 – 2028 (previsto)', en: '2023 – 2028 (expected)' } as L10n,
  },
];
