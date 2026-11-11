import { 
  AppConfig, 
  InitiativeItem, 
  CalendarEvent, 
  Authority, 
  CommitmentRule, 
  NoticeItem, 
  DiplomaRecord, 
  FeedbackRecord,
  OrganigramLevel
} from '../types';

export const INITIAL_CONFIG: AppConfig = {
  institutionName: 'Colegio Informático',
  institutionSubtitle: 'Comunidad Educativa Educar SRL • Verita Vinci',
  slogan: 'Operación Informático: Una misión: descubrir todo lo que nos une',
  logoUrl: '/assets/aistudio/escudo_colegio_informatico.png',
  primaryColor: '#DE4034', // Rojo carmesí del escudo
  secondaryColor: '#01913F', // Verde institucional del escudo
  accentGold: '#CFB07A', // Dorado arena / ocre del escudo
  welcomeMessage: `¡Bienvenido al Colegio Informático!

Nos alegra que hoy comiences a formar parte de nuestra comunidad. Bajo nuestro lema VERITA VINCI (La verdad triunfa), nos une una misma misión: educar con calidad, rigor y vanguardia tecnológica.

Cada persona que se suma aporta algo único. Por eso, queremos invitarte a conocer nuestra historia, descubrir nuestra cultura, explorar nuestros proyectos y todo aquello que nos identifica.

OPERACIÓN INFORMÁTICO
Una misión: descubrir todo lo que nos une.

A través de este recorrido, vas a encontrar diferentes misiones que te permitirán acercarte a nuestra institución y conocer a las personas que hacen posible esta comunidad.

¡Nos alegra compartir este comienzo con vos!`,
  missionTeaserDriveId: '1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v'
};

export const INITIATIVES: InitiativeItem[] = [
  {
    id: 'wellness',
    title: 'Wellness & Bienestar',
    referent: 'Natali Miño',
    referentRole: 'Gestión de Personas y Bienestar Integral',
    category: 'Cultura & Personas',
    iconName: 'HeartHandshake',
    accentColor: '#008751',
    tags: ['Salud Integral', 'Pausas Activas', 'Clima Humano'],
    queHacemos: 'Impulsamos un entorno de trabajo saludable y armónico a través de pausas activas, talleres de manejo del estrés, asesoramiento ergonómico y actividades de integración para docentes y personal administrativo.',
    porqueLoHacemos: 'Porque estamos convencidos de que educar y gestionar con excelencia solo es posible cuando las personas se sienten cuidadas, escuchadas y valoradas física y emocionalmente.',
    queValorAporta: 'Genera mayor satisfacción laboral, reduce el agotamiento, potencia la empatía en los pasillos y fortalece los vínculos de confianza entre todos los equipos.',
    videoDriveId: '1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v'
  },
  {
    id: 'copa-informatica',
    title: 'Copa Informática',
    referent: 'Coti Basualdo',
    referentRole: 'Coordinación de Vida Estudiantil y Deportes',
    category: 'Deportes & Integración',
    iconName: 'Trophy',
    accentColor: '#8B0000',
    tags: ['Espíritu de Equipo', 'Torneo Anual', 'Pertenencia'],
    queHacemos: 'Organizamos el certamen intercolegial e intercasas más esperado del año, que combina disciplinas deportivas, destrezas recreativas, desafíos culturales y jornadas de camaradería.',
    porqueLoHacemos: 'Fomenta el sentido de pertenencia, la sana competencia y el compañerismo más allá de las aulas académicas tradicionales.',
    queValorAporta: 'Une a docentes, preceptores, directivos y estudiantes bajo los mismos colores, transmitiendo valores de respeto, perseverancia y superación colectiva.',
    videoDriveId: '1kVF14POeW7uLBeF6wV3DTkp55x83Prom'
  },
  {
    id: 'expo-proyecto',
    title: 'Expo Proyecto',
    referent: 'Sofi Lorenzo',
    referentRole: 'Directora Académica & Vínculo Pedagógico',
    category: 'Innovación & Aprendizaje',
    iconName: 'Lightbulb',
    accentColor: '#D4B26F',
    tags: ['Feria de Ciencias', 'ABP', 'Comunidad Abierta'],
    queHacemos: 'Es la muestra anual abierta donde los estudiantes de todos los niveles exponen proyectos de investigación, desarrollos tecnológicos y soluciones de impacto comunitario desarrolladas con Aprendizaje Basado en Proyectos (ABP).',
    porqueLoHacemos: 'Brindamos a los alumnos un escenario real para comunicar sus ideas con rigor científico, pensamiento crítico y oratoria frente a familias y especialistas.',
    queValorAporta: 'Visibiliza la excelencia pedagógica del Colegio y consolida el orgullo institucional ante la comunidad de la provincia y la región.',
    videoDriveId: '1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v'
  },
  {
    id: 'bilingue',
    title: 'Programa Bilingüe',
    referent: 'Lucas Maidana',
    referentRole: 'Coordinador del Departamento de Lenguas Extranjeras',
    category: 'Idiomas & Globalidad',
    iconName: 'Globe',
    accentColor: '#1E3A8A',
    tags: ['Inglés Intensivo', 'Certificaciones', 'Ciudadanía Global'],
    queHacemos: 'Ofrecemos un trayecto de inmersión en idioma inglés con enfoque comunicativo, preparación para exámenes internacionales reconocidos (Cambridge) y proyectos interculturales.',
    porqueLoHacemos: 'El dominio bilingüe abre puertas globales irreemplazables y estimula el pensamiento flexible y la comprensión multicultural en un mundo interconectado.',
    queValorAporta: 'Permite a nuestros egresados y al equipo docente acceder a bibliografía de vanguardia, becas internacionales y una proyección sin fronteras.',
    videoDriveId: '1kVF14POeW7uLBeF6wV3DTkp55x83Prom'
  },
  {
    id: 'eai',
    title: 'EAI (Espacio de Apoyo e Integración)',
    referent: 'Pilar Blanco',
    referentRole: 'Coordinadora de Orientación y Psicopedagogía',
    category: 'Inclusión & Pedagogía',
    iconName: 'Compass',
    accentColor: '#7C3AED',
    tags: ['Inclusión Educativa', 'Diversidad', 'Acompañamiento'],
    queHacemos: 'Un equipo interdisciplinario que brinda acompañamiento psicopedagógico, diseña configuraciones de apoyo personalizadas y asesora a los docentes en diversificación curricular.',
    porqueLoHacemos: 'Creemos firmemente en el derecho a una educación equitativa donde cada estudiante alcance su máximo potencial con el andamiaje necesario.',
    queValorAporta: 'Garantiza un colegio verdaderamente inclusivo, empático y profesional, reduciendo barreras de aprendizaje y fortaleciendo a las familias.',
    videoDriveId: '1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v'
  },
  {
    id: 'ia-identidad',
    title: 'IA e Identidad Tecnológica',
    referent: 'Solange Romero',
    referentRole: 'Líder de Transformación Digital & IA Educativa',
    category: 'Tecnología & Futuro',
    iconName: 'Cpu',
    accentColor: '#0284C7',
    tags: ['Inteligencia Artificial', 'Ciudadanía Digital', 'EdTech'],
    queHacemos: 'Integramos metodologías de Inteligencia Artificial Generativa ética, pensamiento algorítmico y herramientas digitales en la planificación docente y en los trayectos formativos de los estudiantes.',
    porqueLoHacemos: 'La tecnología es el ADN del Colegio Informático; preparamos a la comunidad para liderar la era digital con criterio ético y creatividad.',
    queValorAporta: 'Mantiene a nuestro colegio a la vanguardia educativa en Argentina, dotando a colaboradores y alumnos de competencias del siglo XXI.',
    videoDriveId: '1kVF14POeW7uLBeF6wV3DTkp55x83Prom'
  },
  {
    id: 'robotica',
    title: 'Robótica & Laboratorio Maker',
    referent: 'Cecilia Panozzo',
    referentRole: 'Responsable de Robótica STEAM & Maker Lab',
    category: 'STEAM & Creación',
    iconName: 'Bot',
    accentColor: '#EA580C',
    tags: ['Arduino', 'Diseño 3D', 'STEAM', 'Programación'],
    queHacemos: 'Gestionamos el espacio maker donde alumnos y docentes construyen prototipos robóticos, programan microcontroladores, diseñan en 3D y resuelven desafíos de ingeniería práctica.',
    porqueLoHacemos: 'Aprender haciendo (Hands-on learning) despierta la curiosidad vocacional, la resolución creativa de problemas y la perseverancia ante el error.',
    queValorAporta: 'Genera proyectos tangibles de alto impacto, participación en olimpíadas nacionales e inspira vocaciones tecnológicas tempranas.',
    videoDriveId: '1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v'
  },
  {
    id: 'beneficios',
    title: 'Empresas Amigas & Beneficios',
    referent: 'Equipo RRHH Educar',
    referentRole: 'Gestión de Alianzas Corporativas y Talento',
    category: 'Beneficios & Comunidad',
    iconName: 'Gift',
    accentColor: '#059669',
    tags: ['Descuentos', 'Convenios', 'Club Educar'],
    queHacemos: 'Coordinamos una red de convenios estratégicos con comercios, centros médicos, gimnasios, librerías y empresas de servicios de la región para todo el personal de Educar.',
    porqueLoHacemos: 'Reconocemos y premiamos el compromiso diario de nuestros colaboradores, acercándoles ventajas reales para su economía y calidad de vida.',
    queValorAporta: 'Acceso inmediato a descuentos exclusivos, facilidades de pago y experiencias recreativas compartidas en familia.',
    videoDriveId: '1kVF14POeW7uLBeF6wV3DTkp55x83Prom'
  }
];

export const AUTHORITIES: Authority[] = [
  {
    id: 'sofia-lorenzo',
    name: 'Sofi Lorenzo',
    role: 'Directora Académica Institucional',
    area: 'Dirección Pedagógica',
    email: 'sofi.lorenzo@educarsrl.com.ar',
    bio: 'Lidera la visión pedagógica, el diseño curricular y la formación continua de los equipos docentes de todos los niveles. Apasionada por la innovación y el aprendizaje basado en proyectos.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phoneExt: 'Int. 101',
    driveId: 'sofia-drive-ref'
  },
  {
    id: 'juan-pablo',
    name: 'Juan Pablo',
    role: 'Gerente General & Apoderado Legal',
    area: 'Gerencia y Conducción Educar SRL',
    email: 'juanpablo@educarsrl.com.ar',
    bio: 'Conducción institucional y estratégica del Colegio Informático. Encargado del crecimiento edilicio, sustentabilidad operativa y alianzas con la comunidad.',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    phoneExt: 'Int. 102',
    driveId: 'juanpablo-drive-ref'
  },
  {
    id: 'dorita',
    name: 'Dorita',
    role: 'Secretaria Académica & Despacho',
    area: 'Gestión Administrativa Escolar',
    email: 'secretaria@educarsrl.com.ar',
    bio: 'Corazón administrativo y documental de la institución. Supervisa legajos oficiales, títulos ministeriales y trámites normativos con calidez y precisión.',
    photoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    phoneExt: 'Int. 103',
    driveId: 'dorita-drive-ref'
  },
  {
    id: 'mabel',
    name: 'Mabel',
    role: 'Coordinación Pastoral y Valores',
    area: 'Formación Ética y Convivencia',
    email: 'mabel.coordinacion@educarsrl.com.ar',
    bio: 'Custodia el acompañamiento espiritual y los valores comunitarios de la institución. Facilita encuentros de convivencia, retiros y proyectos solidarios.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    phoneExt: 'Int. 104',
    driveId: 'mabel-drive-ref'
  },
  {
    id: 'natali-mino',
    name: 'Natali Miño',
    role: 'Coordinadora de RRHH & Wellness',
    area: 'Gestión y Desarrollo de Personas',
    email: 'rrhh@educarsrl.com.ar',
    bio: 'Acompaña a cada colaborador desde su primer día. Lidera el programa de bienestar integral, clima institucional, capacitaciones y beneficios para el personal.',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    phoneExt: 'Int. 105',
    driveId: 'nati-drive-ref'
  },
  {
    id: 'marcelo-molina',
    name: 'Marcelo Molina',
    role: 'Jefe de Sistemas e Infraestructura',
    area: 'Tecnología & Soporte IT',
    email: 'marcelo.molina@educarsrl.com.ar',
    bio: 'Responsable de la infraestructura de red, servidores, plataformas de gestión académica y ciberseguridad del Colegio Informático.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    phoneExt: 'Int. 106',
    driveId: 'marcelo-drive-ref'
  }
];

export const COMMITMENT_RULES: CommitmentRule[] = [
  {
    number: 1,
    title: 'Cada día comienza con nosotros',
    highlight: 'Respetar los horarios y registrar nuestro ingreso y egreso es parte de nuestro compromiso.',
    description: 'La puntualidad es la primera muestra de respeto hacia nuestros colegas y hacia los estudiantes que esperan nuestro ejemplo. Llegar con tiempo nos permite predisponernos con serenidad para la jornada.',
    tips: [
      'Registrá tu ingreso en el sistema biométrico o terminal de entrada.',
      'Anticipá cualquier imprevisto avisando con antelación a tu coordinación.',
      'Comenzá cada clase o tarea con puntualidad y una sonrisa de bienvenida.'
    ],
    iconName: 'Clock',
    badge: 'Puntualidad y Registro',
    image: '/src/assets/images/docente_ingreso_colegio_1794425649449.jpg'
  },
  {
    number: 2,
    title: 'También nos representamos en cómo nos presentamos',
    highlight: 'Nuestra presentación personal acompaña la identidad del Colegio.',
    description: 'Nuestra vestimenta comunica profesionalismo, pertenencia y cuidado. El uso de la indumentaria oficial del Colegio Informático transmite unidad, seriedad y calidez a las familias.',
    tips: [
      'Utilizá la indumentaria oficial según tu sector (docente, maestranza, administrativo).',
      'Mantené una presentación prolija y adecuada para un entorno formativo infantil y juvenil.',
      'Portá tu credencial institucional visible para seguridad de toda la comunidad.'
    ],
    iconName: 'UserCheck',
    badge: 'Identidad y Presentación',
    image: '/src/assets/images/colaboradores_uniforme_pasillo_1794425651684.jpg'
  },
  {
    number: 3,
    title: 'La convivencia la construimos entre todos',
    highlight: 'El respeto, la cordialidad y la buena comunicación hacen la diferencia.',
    description: 'El clima de trabajo lo creamos con el saludo sincero, la paciencia ante las dificultades y el buen trato en cada conversación. Fomentamos una cultura libre de rumores y abierta al diálogo constructivo.',
    tips: [
      'Saludá cordialmente a todos: personal de maestranza, directivos, familias y alumnos.',
      'Canalizá dudas o discrepancias por las vías institucionales y con espíritu constructivo.',
      'Practicá la escucha activa y el reconocimiento sincero entre pares.'
    ],
    iconName: 'Smile',
    badge: 'Convivencia y Diálogo',
    image: '/src/assets/images/colaboradores_sala_docentes_1794425650084.jpg'
  },
  {
    number: 4,
    title: 'Cuidar nuestros espacios también es tarea de todos',
    highlight: 'Cuidamos las instalaciones, los materiales y las herramientas que compartimos.',
    description: 'Nuestras aulas, laboratorios y áreas comunes son el hábitat de aprendizaje de toda la comunidad. Mantener cada espacio limpio, seguro y ordenado es una responsabilidad compartida.',
    tips: [
      'Apagá proyectores, luces y aires acondicionados al finalizar tus actividades.',
      'Reportá oportunamente desperfectos edilicios o de equipamiento a Mantenimiento y Sistemas.',
      'Fomentá activamente en los alumnos el cuidado del mobiliario y el orden de los materiales.'
    ],
    iconName: 'Building2',
    badge: 'Cuidado de Espacios',
    image: '/src/assets/images/cuidado_espacios_aula_1794425672892.jpg'
  },
  {
    number: 5,
    title: 'Siempre hay algo nuevo para compartir',
    highlight: 'Participamos de las instancias de formación y de las actividades institucionales según las convocatorias.',
    description: 'En el Colegio Informático creemos en el aprendizaje continuo y en la actualización constante. Compartimos saberes, participamos de jornadas pedagógicas y sumamos nuevas herramientas.',
    tips: [
      'Aprovechá los talleres de formación continua y las capacitaciones institucionales.',
      'Compartí recursos, dinámicas de clase y descubrimientos con tu equipo de trabajo.',
      'Mantenete actualizado en las herramientas pedagógicas y tecnológicas del colegio.'
    ],
    iconName: 'GraduationCap',
    badge: 'Formación Continua',
    image: '/src/assets/images/capacitacion_docente_jornada_1794425675905.jpg'
  },
  {
    number: 6,
    title: 'Somos parte de algo más grande',
    highlight: 'Cada persona, desde su lugar, contribuye a construir nuestra comunidad.',
    description: 'Más allá de nuestras tareas individuales, formamos una familia educativa con más de dos décadas de historia. Tu aporte diario trasciende en el futuro y la formación de nuestros estudiantes.',
    tips: [
      'Sumate a los proyectos y celebraciones institucionales (Copa Informática, Expo, Actos).',
      'Sentite libre de proponer mejoras e iniciativas para sumar al proyecto educativo.',
      'Sé un embajador de los valores de Verita Vinci ante la sociedad.'
    ],
    iconName: 'Sparkles',
    badge: 'Comunidad Unida',
    image: '/src/assets/images/comunidad_grupal_colegio_1794425675606.jpg',
    closingQuote: 'No importa cuál sea tu función: tu manera de hacer las cosas también forma parte de nuestra identidad.'
  }
];

export const INITIAL_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-1',
    month: 2,
    monthName: 'Febrero 2026',
    dateStr: '16 de Febrero',
    title: 'Reincorporación Docente y Bienvenida Institucional',
    category: 'Institucional',
    responsible: 'Dirección Académica & RRHH',
    description: 'Jornada inaugural del ciclo lectivo 2026, presentación de nuevos colaboradores y desayuno de integración.',
    targetAudience: 'Todo el personal docente y no-docente'
  },
  {
    id: 'cal-2',
    month: 2,
    monthName: 'Febrero 2026',
    dateStr: '23 de Febrero',
    title: 'Taller de Inducción Tecnológica y Plataformas Educar',
    category: 'Tecnología & IA',
    responsible: 'Marcelo Molina & Solange Romero',
    description: 'Capacitación en uso de intranet, Google Workspace, aulas virtuales y pautas de ciberseguridad.',
    targetAudience: 'Nuevos ingresantes y docentes'
  },
  {
    id: 'cal-3',
    month: 3,
    monthName: 'Marzo 2026',
    dateStr: '02 de Marzo',
    title: 'Inicio Oficial de Clases Ciclo Lectivo 2026',
    category: 'Académico',
    responsible: 'Equipo Directivo',
    description: 'Acto de apertura de nivel inicial, primario y secundario con presencia de toda la comunidad educativa.',
    targetAudience: 'Comunidad en general'
  },
  {
    id: 'cal-4',
    month: 3,
    monthName: 'Marzo 2026',
    dateStr: '20 de Marzo',
    title: 'Pausa Activa de Otoño & Programa Wellness',
    category: 'Wellness',
    responsible: 'Natali Miño',
    description: 'Inicio del cronograma de pausas activas, chequeos posturales y dinámicas de mindfulness laboral.',
    targetAudience: 'Todo el personal'
  },
  {
    id: 'cal-5',
    month: 4,
    monthName: 'Abril 2026',
    dateStr: '17 de Abril',
    title: 'Jornada EAI: Configuraciones de Apoyo en el Aula',
    category: 'Pedagógico',
    responsible: 'Pilar Blanco',
    description: 'Taller práctico sobre diseño universal para el aprendizaje (DUA) y estrategias de inclusión.',
    targetAudience: 'Docentes y preceptores'
  },
  {
    id: 'cal-6',
    month: 5,
    monthName: 'Mayo 2026',
    dateStr: '18 de Mayo',
    title: 'Lanzamiento Oficial: Copa Informática 2026',
    category: 'Deportes',
    responsible: 'Coti Basualdo',
    description: 'Apertura de los torneos intercasas, asignación de capitanes y fixture de competencias deportivas y recreativas.',
    targetAudience: 'Alumnos, docentes y familias'
  },
  {
    id: 'cal-7',
    month: 6,
    monthName: 'Junio 2026',
    dateStr: '12 de Junio',
    title: 'English Immersion Day & Cambridge Prep',
    category: 'Bilingüe',
    responsible: 'Lucas Maidana',
    description: 'Jornada temático-cultural de inmersión en lengua inglesa y simulacros de certificación internacional.',
    targetAudience: 'Nivel Primario y Secundario'
  },
  {
    id: 'cal-8',
    month: 7,
    monthName: 'Julio 2026',
    dateStr: '10 de Julio',
    title: 'Encuentro de Cierre Primer Cuatrimestre y Brindis',
    category: 'Institucional',
    responsible: 'Gerencia Educar & RRHH',
    description: 'Balance de gestión, reconocimiento a colaboradores y bienvenida al receso invernal.',
    targetAudience: 'Todo el personal'
  },
  {
    id: 'cal-9',
    month: 8,
    monthName: 'Agosto 2026',
    dateStr: '21 de Agosto',
    title: 'Desafío STEAM & Maker Fest: Robótica en Acción',
    category: 'Robótica & Maker',
    responsible: 'Cecilia Panozzo',
    description: 'Hackatón escolar de robótica con Arduino, impresiones 3D y circuitos interactivos.',
    targetAudience: 'Comunidad escolar'
  },
  {
    id: 'cal-10',
    month: 9,
    monthName: 'Septiembre 2026',
    dateStr: '11 de Septiembre',
    title: 'Día del Educador & Gran Homenaje al Personal',
    category: 'Institucional',
    responsible: 'Comité de Agasajos & RRHH',
    description: 'Celebración especial por el Día del Maestro y del Profesor con entrega de distinciones por trayectoria.',
    targetAudience: 'Todo el equipo'
  },
  {
    id: 'cal-11',
    month: 10,
    monthName: 'Octubre 2026',
    dateStr: '23 de Octubre',
    title: 'Gran Gala Anual: EXPO PROYECTO 2026',
    category: 'Innovación',
    responsible: 'Sofi Lorenzo',
    description: 'Exposición magistral de proyectos ABP, ciencia aplicada, tecnología y desarrollo comunitario.',
    targetAudience: 'Toda la comunidad provincial'
  },
  {
    id: 'cal-12',
    month: 11,
    monthName: 'Noviembre 2026',
    dateStr: '13 de Noviembre',
    title: 'Final de la Copa Informática y Fiesta de Premiación',
    category: 'Deportes',
    responsible: 'Coti Basualdo',
    description: 'Coronación de los equipos campeones, entrega del trofeo mayor y celebración comunitaria.',
    targetAudience: 'Estudiantes, docentes y directivos'
  },
  {
    id: 'cal-13',
    month: 12,
    monthName: 'Diciembre 2026',
    dateStr: '18 de Diciembre',
    title: 'Acto de Colación de Grados y Fiesta de Fin de Año',
    category: 'Institucional',
    responsible: 'Gerencia & Dirección',
    description: 'Graduación de promociones 2026 y tradicional brindis de fin de año del equipo Educar.',
    targetAudience: 'Toda la comunidad'
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not-1',
    date: '03 de Noviembre, 2026',
    title: '¡Bienvenidos a la Operación Informático 2026!',
    content: 'Comenzamos una nueva etapa de inducción institucional. Los invitamos a explorar las cuatro misiones de este portal para descubrir la identidad que nos une y certificar su incorporación a la comunidad Educar.',
    author: 'Natali Miño (RRHH)',
    priority: 'alta',
    pinned: true
  },
  {
    id: 'not-2',
    date: '28 de Octubre, 2026',
    title: 'Actualización de Credenciales y Correo Corporativo',
    content: 'Todo nuevo colaborador cuenta con su casilla @educarsrl.com.ar habilitada. Ante cualquier duda o blanqueo de clave, pueden contactar a Marcelo Molina en el Int. 106.',
    author: 'Marcelo Molina (Sistemas)',
    priority: 'normal',
    pinned: false
  },
  {
    id: 'not-3',
    date: '15 de Octubre, 2026',
    title: 'Nuevo Club de Beneficios: Empresas Amigas',
    content: 'Ya están vigentes los nuevos convenios en gimnasios, ópticas y librerías del microcentro. Consultá la lista de comercios adheridos en la sección Misión 02.',
    author: 'Equipo RRHH Educar',
    priority: 'media',
    pinned: false
  }
];

export const INITIAL_DIPLOMAS: DiplomaRecord[] = [
  {
    id: 'dip-demo-1',
    timestamp: '2026-10-24 10:15',
    fullName: 'Mariana Gomez',
    role: 'Docente de Nivel Primario',
    email: 'marianag@educarsrl.com.ar',
    entryDate: '2026-10-20',
    certificateFolio: 'CI-2026-0042',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Emitido'
  },
  {
    id: 'dip-demo-2',
    timestamp: '2026-10-28 16:40',
    fullName: 'Gonzalo Fernández',
    role: 'Preceptor y Vida Estudiantil',
    email: 'gonzalo.f@educarsrl.com.ar',
    entryDate: '2026-10-25',
    certificateFolio: 'CI-2026-0043',
    verificationHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    status: 'Enviado por Correo'
  }
];

export const INITIAL_FEEDBACK: FeedbackRecord[] = [
  {
    id: 'fb-1',
    timestamp: '2026-10-24 10:20',
    fullName: 'Mariana Gomez',
    role: 'Docente de Nivel Primario',
    overallRating: 5,
    clarityRating: 5,
    mostUsefulSection: 'Misión 02: Iniciativas y Referentes',
    suggestions: 'Excelente la claridad del recorrido y el video institucional. Me hizo sentir muy bienvenida.',
    wouldRecommend: true
  },
  {
    id: 'fb-2',
    timestamp: '2026-10-28 16:45',
    fullName: 'Gonzalo Fernández',
    role: 'Preceptor y Vida Estudiantil',
    overallRating: 5,
    clarityRating: 5,
    mostUsefulSection: 'Misión 03: Organigrama y Canales',
    suggestions: 'Muy útil conocer los rostros de las autoridades antes del primer día. El calendario anual es impecable.',
    wouldRecommend: true
  }
];

export const INITIAL_ORGANIGRAM: OrganigramLevel[] = [
  {
    id: 'lvl-1',
    levelNumber: 1,
    levelName: 'Representación Legal & Conducción Superior',
    badge: 'Nivel 1 • Conducción Superior',
    description: 'Máxima instancia de decisión jurídica, estratégica y de sustentabilidad de Educar SRL',
    color: '#DE4034',
    nodes: [
      {
        id: 'org-gerencia',
        title: 'Gerencia General & Apoderado Legal',
        subtitle: 'Educar SRL • Colegio Informático',
        colorTheme: '#DE4034',
        description: 'Conducción integral, convenios institucionales, desarrollo edilicio y representación ante organismos públicos.',
        responsibles: [
          {
            id: 'juan-pablo',
            name: 'Juan Pablo',
            role: 'Gerente General & Apoderado Legal',
            photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            email: 'juanpablo@educarsrl.com.ar'
          }
        ]
      }
    ]
  },
  {
    id: 'lvl-2',
    levelNumber: 2,
    levelName: 'Direcciones y Secretarías de Despacho',
    badge: 'Nivel 2 • Dirección & Secretaría',
    description: 'Liderazgo pedagógico, normativo y administrativo de la comunidad escolar',
    color: '#01913F',
    nodes: [
      {
        id: 'org-direccion',
        title: 'Dirección Académica Institucional',
        subtitle: 'Nivel Inicial, Primario y Secundario',
        colorTheme: '#1E3A8A',
        description: 'Articulación pedagógica curricular, proyectos ABP, acompañamiento docente y vínculo con familias.',
        responsibles: [
          {
            id: 'sofia-lorenzo',
            name: 'Sofi Lorenzo',
            role: 'Directora Académica Institucional',
            photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            email: 'sofi.lorenzo@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-secretaria',
        title: 'Secretaría Académica & Despacho',
        subtitle: 'Despacho Escolar & Legalidad',
        colorTheme: '#01913F',
        description: 'Gestión de legajos de estudiantes y docentes, títulos oficiales, libros matrices y trámites ministeriales.',
        responsibles: [
          {
            id: 'dorita',
            name: 'Dorita',
            role: 'Secretaria Académica & Despacho',
            photoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
            email: 'secretaria@educarsrl.com.ar'
          }
        ]
      }
    ]
  },
  {
    id: 'lvl-3',
    levelNumber: 3,
    levelName: 'Coordinaciones Transversales & Departamentos',
    badge: 'Nivel 3 • Departamentos Clave',
    description: 'Equipos técnicos y de gestión que potencian el bienestar, la innovación y la convivencia escolar',
    color: '#CFB07A',
    nodes: [
      {
        id: 'org-rrhh',
        title: 'Gestión de Personas & Wellness',
        subtitle: 'Talento, Inducción y Clima Laboral',
        colorTheme: '#01913F',
        description: 'Acompañamiento al colaborador, pausas activas, capacitaciones y red de empresas amigas.',
        responsibles: [
          {
            id: 'natali-mino',
            name: 'Natali Miño',
            role: 'Coordinadora de RRHH & Wellness',
            photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
            email: 'rrhh@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-sistemas',
        title: 'Sistemas & Infraestructura Tecnológica',
        subtitle: 'Soporte IT, Redes & EdTech',
        colorTheme: '#0284C7',
        description: 'Administración de servidores, redes de fibra óptica, plataformas educativas y seguridad informática.',
        responsibles: [
          {
            id: 'marcelo-molina',
            name: 'Marcelo Molina',
            role: 'Jefe de Sistemas e Infraestructura',
            photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            email: 'marcelo.molina@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-pastoral',
        title: 'Pastoral, Valores & Convivencia',
        subtitle: 'Formación Ética y Humana',
        colorTheme: '#7C3AED',
        description: 'Espacios de encuentro, retiros espirituales, campañas solidarias y resolución pacífica de conflictos.',
        responsibles: [
          {
            id: 'mabel',
            name: 'Mabel',
            role: 'Coordinación Pastoral y Valores',
            photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            email: 'mabel.coordinacion@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-idiomas',
        title: 'Departamento de Lenguas Extranjeras',
        subtitle: 'Programa Bilingüe & Cambridge',
        colorTheme: '#1E3A8A',
        description: 'Inmersión comunicativa en inglés y preparación para exámenes internacionales Cambridge.',
        responsibles: [
          {
            id: 'lucas-maidana',
            name: 'Lucas Maidana',
            role: 'Coordinador de Lenguas Extranjeras',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            email: 'lucas.maidana@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-eai',
        title: 'Espacio de Apoyo e Integración (EAI)',
        subtitle: 'Orientación Psicopedagógica',
        colorTheme: '#DE4034',
        description: 'Acompañamiento a la neurodiversidad, configuraciones de apoyo y asesoramiento docente en DUA.',
        responsibles: [
          {
            id: 'pilar-blanco',
            name: 'Pilar Blanco',
            role: 'Coordinadora de Orientación y EAI',
            photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            email: 'pilar.blanco@educarsrl.com.ar'
          }
        ]
      }
    ]
  },
  {
    id: 'lvl-4',
    levelNumber: 4,
    levelName: 'Sectores Operativos & Acompañamiento Escolar',
    badge: 'Nivel 4 • Comunidad en Acción',
    description: 'El motor diario de la experiencia formativa de nuestros estudiantes',
    color: '#334155',
    nodes: [
      {
        id: 'org-docentes',
        title: 'Cuerpo Docente & Preceptoría',
        subtitle: 'Nivel Inicial, Primario y Secundario',
        colorTheme: '#01913F',
        description: 'Educadores titulares, auxiliares y preceptores que guían las trayectorias formativas.',
        responsibles: [
          {
            id: 'coti-basualdo',
            name: 'Coti Basualdo',
            role: 'Coordinadora de Vida Estudiantil',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            email: 'coti.basualdo@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-stem',
        title: 'Laboratorio Maker, Robótica & IA',
        subtitle: 'Educación Tecnológica STEAM',
        colorTheme: '#EA580C',
        description: 'Espacio de prototipado 3D, programación de microcontroladores y cultura maker.',
        responsibles: [
          {
            id: 'cecilia-panozzo',
            name: 'Cecilia Panozzo & Solange Romero',
            role: 'Referentes STEAM & Maker',
            photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            email: 'robotica@educarsrl.com.ar'
          }
        ]
      },
      {
        id: 'org-maestranza',
        title: 'Maestranza, Seguridad & Portería',
        subtitle: 'Cuidado y Mantenimiento Edilicio',
        colorTheme: '#475569',
        description: 'Preservación de espacios climatizados, higiene y seguridad en los accesos escolares.',
        responsibles: [
          {
            id: 'equipo-mantenimiento',
            name: 'Equipo de Servicios Generales',
            role: 'Supervisión Edilicia',
            email: 'servicios@educarsrl.com.ar'
          }
        ]
      }
    ]
  }
];

