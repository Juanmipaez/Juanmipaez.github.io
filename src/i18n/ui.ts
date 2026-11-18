// Every UI string on the site, in both languages.
// Content (projects, subjects, notes, bio) is translated next to the content itself.
import type { Lang } from './index';

const es = {
  // header / footer / switch
  'nav.projects': 'proyectos',
  'nav.library': 'biblioteca',
  'nav.writing': 'escritos',
  'nav.about': 'sobre mí',
  'nav.soon': 'pronto',
  'nav.soonTitle': 'Próximamente',
  'nav.main': 'Principal',
  'header.home': 'inicio',
  'header.search': 'buscar',
  'header.searchAria': 'Buscar en el sitio',
  'header.theme': 'Cambiar entre el tema papel y el tema terminal',
  'header.themeTitle': 'Cambiar tema',
  'skip': 'Saltar al contenido',
  'footer.aria': 'Contacto y perfiles',
  'footer.cv': 'cv',
  'lang.switch': 'Idioma',

  // home
  'home.now': 'ahora',
  'home.nowDate': 'nov 2026',
  'home.projects': 'proyectos',
  'home.allProjects': 'todos los proyectos →',
  'home.library': 'biblioteca',
  'home.openLibrary': 'abrir la biblioteca →',

  // hero
  'hero.hi': 'Hola, soy',
  // TODO(juanmi): is "monitor" the right Spanish title for your TA role at UNAL?
  'hero.lead':
    'estudiante de Ciencias de la Computación en la Universidad Nacional de Colombia (UNAL) y monitor de Álgebra Lineal. Ahora me interesan la computación paralela, la optimización y los datos.',
  'hero.aboutLink': 'sobre mí y contacto →',
  'hero.canvas': 'Animación de un toro en alambre. Arrastra para rotarlo.',
  'hero.modes': 'Elige una animación',
  'hero.mode1': '01 · toro → möbius',
  'hero.mode2': '02 · toro ascii',
  'hero.drag': 'arrastra para rotar',
  'hero.replay': 'repetir ↻',
  'hero.cap1': 'toro → möbius · arrastra para orbitar',
  'hero.act1': 'transformar ↔',
  'hero.cap2': 'alambre | sombreado ascii',
  'hero.act2': 'barrido / división',
  'hero.split': 'división · mueve el cursor para recorrer',
  'hero.torus': 'toro · dos caras',
  'hero.mobius': 'banda de möbius · una cara',
  'hero.twisting': 'torciendo…',

  // projects
  'projects.title': 'Proyectos',
  'projects.lead':
    'Lo que estoy construyendo y lo que ya terminé. Cada proyecto explica qué hace, cuál fue mi parte y cómo ejecutarlo.',
  'projects.description': 'Proyectos de Juan Miguel Paez Tatis.',
  'projects.building': 'en curso',
  'projects.done': 'terminados',
  'projects.archived': 'archivo',
  'projects.crumb': 'proyectos',
  'projects.team': 'proyecto en equipo',
  'projects.source': 'código',
  'projects.demo': 'demo en vivo ↗',
  'projects.myPart': 'Mi parte:',
  'projects.untranslated': 'Esta página aún no está traducida; el texto está en inglés.',
  'status.building': 'en curso',
  'status.done': 'terminado',
  'status.archived': 'archivado',

  // library
  'library.title': 'Biblioteca',
  'library.lead':
    'Mis apuntes de clase de la UNAL, escritos en LaTeX. Organizados por materia y etiquetados por tema. Busca con ⌘K.',
  'library.description': 'Apuntes de clase de Juan Miguel Paez Tatis, escritos en LaTeX y organizados por materia.',
  'library.math': 'matemáticas',
  'library.cs': 'ciencias de la computación',
  'library.crumb': 'biblioteca',
  'library.soon': 'pronto',
  'library.note': 'apunte',
  'library.notes': 'apuntes',
  'library.empty': 'Los apuntes de esta materia llegarán pronto.',
  'library.notesFor': 'Apuntes de',
  'library.updated': 'actualizado',
  'library.source': 'fuente .tex ↗',
  'library.inLang': 'Este apunte está en inglés.',

  // about
  'about.title': 'Sobre mí',
  'about.experience': 'experiencia',
  'about.education': 'formación',
  'about.contact': 'cv y contacto',
  'about.cvEn': 'cv (inglés)',
  'about.cvEs': 'cv (español)',

  // search
  'search.aria': 'Buscar en el sitio',
  'search.label': 'Buscar',
  'search.placeholder': 'buscar proyectos, materias, apuntes…',
  'search.close': 'esc',
  'search.none': 'Sin resultados para',
  'search.projectsMeta': 'Todo lo que estoy construyendo',
  'search.libraryMeta': 'Apuntes de clase, por materia',
  'search.aboutMeta': 'Biografía, experiencia, CV y contacto',
  'kind.page': 'página',
  'kind.project': 'proyecto',
  'kind.subject': 'materia',
  'kind.note': 'apunte',
};

type Keys = keyof typeof es;

const en: Record<Keys, string> = {
  'nav.projects': 'projects',
  'nav.library': 'library',
  'nav.writing': 'writing',
  'nav.about': 'about',
  'nav.soon': 'soon',
  'nav.soonTitle': 'Coming soon',
  'nav.main': 'Main',
  'header.home': 'home',
  'header.search': 'search',
  'header.searchAria': 'Search the site',
  'header.theme': 'Switch between paper and terminal theme',
  'header.themeTitle': 'Switch theme',
  'skip': 'Skip to content',
  'footer.aria': 'Contact and profiles',
  'footer.cv': 'cv',
  'lang.switch': 'Language',

  'home.now': 'now',
  'home.nowDate': 'nov 2026',
  'home.projects': 'projects',
  'home.allProjects': 'all projects →',
  'home.library': 'library',
  'home.openLibrary': 'open the library →',

  'hero.hi': "Hi, I'm",
  'hero.lead':
    'Computer Science student at Universidad Nacional de Colombia (UNAL) and Linear Algebra teaching assistant. Currently into parallel computing, optimization and data.',
  'hero.aboutLink': 'about & contact →',
  'hero.canvas': 'Animated wireframe of a torus. Drag to rotate it.',
  'hero.modes': 'Choose an animation',
  'hero.mode1': '01 · torus → möbius',
  'hero.mode2': '02 · ascii torus',
  'hero.drag': 'drag to rotate',
  'hero.replay': 'replay ↻',
  'hero.cap1': 'torus → möbius · drag to orbit',
  'hero.act1': 'morph ↔',
  'hero.cap2': 'wireframe | ascii shading',
  'hero.act2': 'sweep / split',
  'hero.split': 'split · move the cursor to scrub',
  'hero.torus': 'torus · two-sided',
  'hero.mobius': 'möbius strip · one-sided',
  'hero.twisting': 'twisting…',

  'projects.title': 'Projects',
  'projects.lead':
    "What I'm building and what I've finished. Each project says what it does, what my part was, and how to run it.",
  'projects.description': 'Projects by Juan Miguel Paez Tatis.',
  'projects.building': 'building now',
  'projects.done': 'finished',
  'projects.archived': 'archive',
  'projects.crumb': 'projects',
  'projects.team': 'team project',
  'projects.source': 'source',
  'projects.demo': 'live demo ↗',
  'projects.myPart': 'My part:',
  'projects.untranslated': '',
  'status.building': 'building',
  'status.done': 'done',
  'status.archived': 'archived',

  'library.title': 'Library',
  'library.lead':
    'My course notes from UNAL, written in LaTeX. Sorted by subject and tagged by topic. Most notes are in Spanish. Press ⌘K to search.',
  'library.description': 'Course notes by Juan Miguel Paez Tatis, written in LaTeX and sorted by subject.',
  'library.math': 'mathematics',
  'library.cs': 'computer science',
  'library.crumb': 'library',
  'library.soon': 'soon',
  'library.note': 'note',
  'library.notes': 'notes',
  'library.empty': 'Notes for this subject are coming soon.',
  'library.notesFor': 'Notes for',
  'library.updated': 'updated',
  'library.source': '.tex source ↗',
  'library.inLang': 'This note is written in Spanish.',

  'about.title': 'About',
  'about.experience': 'experience',
  'about.education': 'education',
  'about.contact': 'cv & contact',
  'about.cvEn': 'cv (english)',
  'about.cvEs': 'cv (español)',

  'search.aria': 'Search the site',
  'search.label': 'Search',
  'search.placeholder': 'search projects, subjects, notes…',
  'search.close': 'esc',
  'search.none': 'No results for',
  'search.projectsMeta': 'Everything I’m building',
  'search.libraryMeta': 'Course notes, by subject',
  'search.aboutMeta': 'Bio, experience, CV and contact',
  'kind.page': 'page',
  'kind.project': 'project',
  'kind.subject': 'subject',
  'kind.note': 'note',
};

export const ui = { es, en } satisfies Record<Lang, Record<Keys, string>>;
export type UiKey = Keys;

/** `const t = useT(lang); t('nav.projects')` */
export function useT(lang: Lang) {
  return (key: Keys) => ui[lang][key];
}
