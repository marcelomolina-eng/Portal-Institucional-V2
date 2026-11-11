import React from 'react';
import { Authority, OrganigramLevel } from '../types';
import { 
  Users, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  MessageSquare, 
  BookOpen, 
  Send, 
  Briefcase, 
  Layers, 
  Compass, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  GraduationCap,
  X,
  ImageIcon,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { MissionCheckpointFooter } from './MissionCheckpointFooter';
import { getOrganigramaImageUrl } from '../lib/supabase';

interface Mission3CommunityProps {
  authorities: Authority[];
  organigramLevels?: OrganigramLevel[];
  onComplete: () => void;
  onNavigateNext: () => void;
  isCompleted: boolean;
}

export const Mission3Community: React.FC<Mission3CommunityProps> = ({
  authorities,
  organigramLevels = [],
  onComplete,
  onNavigateNext,
  isCompleted
}) => {
  const [selectedAuthority, setSelectedAuthority] = React.useState<Authority | null>(null);
  const [activeTab, setActiveTab] = React.useState<'autoridades' | 'organigrama' | 'canales'>('autoridades');
  
  // Estado para la sección de Organigramas Institucionales (Supabase Storage)
  const [organigramaTab, setOrganigramaTab] = React.useState<'colegio' | 'educar'>('colegio');
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [lightboxZoom, setLightboxZoom] = React.useState<number>(1);
  const [imagesLoading, setImagesLoading] = React.useState<Record<string, boolean>>({
    colegio: true,
    educar: true
  });
  const [imagesError, setImagesError] = React.useState<Record<string, boolean>>({
    colegio: false,
    educar: false
  });
  const [tryFallbackEducar, setTryFallbackEducar] = React.useState(false);

  // Escuchar teclas en el Lightbox de pantalla completa
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === '+' || e.key === '=') {
        setLightboxZoom(z => Math.min(3.5, +(z + 0.25).toFixed(2)));
      } else if (e.key === '-') {
        setLightboxZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)));
      } else if (e.key === '0') {
        setLightboxZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const communicationChannels = [
    {
      title: 'Correo Electrónico Corporativo',
      account: '@educarsrl.com.ar',
      desc: 'Canal oficial primordial para comunicaciones formales, avisos académicos, licencias, envío de planificaciones y circulares institucionales.',
      guidelines: 'Revisar al inicio y fin de la jornada. Usar firma institucional reglamentaria provista por Sistemas.',
      icon: <Mail className="w-6 h-6 text-[#7A1C1C]" />,
      badge: 'Formal & Legal'
    },
    {
      title: 'Plataforma Interna / Intranet Escolar',
      account: 'Gestión Académica & Calificaciones',
      desc: 'Sistema digital para carga de notas, asistencias, legajos de estudiantes, libros de temas y seguimiento de trayectorias.',
      guidelines: 'Mantener las cargas al día. No compartir claves de acceso con terceros.',
      icon: <Layers className="w-6 h-6 text-[#008751]" />,
      badge: 'Académico'
    },
    {
      title: 'Grupos de WhatsApp Institucionales',
      account: 'Avisos Inmediatos & Operativos',
      desc: 'Canal ágil para notificaciones de último momento, cambios edilicios o emergencias operativas.',
      guidelines: 'Horario de uso respetuoso (07:30 a 19:30 hs en días hábiles). Solo contenido estrictamente laboral.',
      icon: <MessageSquare className="w-6 h-6 text-[#25D366]" />,
      badge: 'Urgente'
    },
    {
      title: 'Mesas de Trabajo & Ateneos',
      account: 'Reuniones de Nivel & Departamento',
      desc: 'Espacio presencial y sincrónico para la toma de decisiones pedagógicas, diseño de proyectos ABP y evaluación.',
      guidelines: 'Se realizan semanalmente o por quincena coordinadas por los directivos de cada nivel.',
      icon: <Users className="w-6 h-6 text-[#1E3A8A]" />,
      badge: 'Colaborativo'
    },
    {
      title: 'Libro de Circulares & Actas Digitales',
      account: 'Registro Normativo Institucional',
      desc: 'Documento donde se asientan resoluciones, reglamentos internos y notificaciones de cumplimiento obligatorio.',
      guidelines: 'Requiere acuse de recibo y firma digital o física por parte de cada colaborador.',
      icon: <BookOpen className="w-6 h-6 text-[#D4B26F]" />,
      badge: 'Normativo'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header de la Misión */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1e40af] to-[#172554] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4B26F]/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4B26F]/20 text-[#CFB07A] text-xs font-bold uppercase tracking-[0.06em]">
              <Users className="w-4 h-4" /> MISIÓN 03: OPERACIÓN INFORMÁTICO
            </div>
            <h1 className="text-[2rem] font-bold text-white leading-[1.25] text-left">
              Conocer nuestra comunidad
            </h1>
            <p className="text-base text-blue-50 max-w-[65ch] leading-[1.5] text-left">
              Te presentamos a las autoridades, el organigrama y los canales oficiales para estar siempre comunicado.
            </p>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.06em] transition-all flex items-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-[#01913F] text-white border border-emerald-400'
                : 'bg-[#CFB07A] text-[#1C1A17] hover:bg-[#e4c485]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión completada • Continuar' : 'Completar y pasar a Misión 04'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-menú de Navegación interna estilo Pills Institucionales */}
      <div className="bg-[#F4F5F7] p-2 rounded-2xl border border-slate-200/90 shadow-inner flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('autoridades')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'autoridades'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'autoridades' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Autoridades y referentes</span>
        </button>

        <button
          onClick={() => setActiveTab('organigrama')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'organigrama'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Building className={`w-4 h-4 ${activeTab === 'organigrama' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Organigrama institucional</span>
        </button>

        <button
          onClick={() => setActiveTab('canales')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'canales'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${activeTab === 'canales' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Canales de comunicación interna</span>
        </button>
      </div>

      {/* TAB 1: AUTORIDADES Y REFERENTES */}
      {activeTab === 'autoridades' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[1.5rem] font-bold text-slate-900 leading-[1.25] text-left">
                Equipo de conducción y referentes
              </h2>
              <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
                Ponte en contacto con cada uno para evacuar dudas o coordinar acciones.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.06em] px-3 py-1 bg-blue-50 text-[#1E3A8A] rounded-full border border-blue-200">
              {authorities.length} referentes clave
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {authorities.map((auth) => (
              <div
                key={auth.id}
                onClick={() => setSelectedAuthority(auth)}
                className="cursor-pointer group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#1E3A8A] hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={auth.photoUrl}
                      alt={auth.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#CFB07A] shadow-sm group-hover:scale-105 transition"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-[1.125rem] leading-[1.3] text-left group-hover:text-[#1E3A8A] transition">
                        {auth.name}
                      </h3>
                      <p className="text-xs text-[#00602A] font-bold mt-0.5 text-left">
                        {auth.role}
                      </p>
                      <span className="text-xs text-slate-700 font-mono text-left block">
                        {auth.area}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left line-clamp-3 whitespace-pre-wrap">
                    {auth.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700 text-xs truncate max-w-[170px]">
                    {auth.email}
                  </span>
                  <span className="text-[#1E3A8A] font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                    Ver perfil <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIGRAMA INSTITUCIONAL (SUPABASE STORAGE: organigrama-imagenes) */}
      {activeTab === 'organigrama' && (() => {
        const organigramasConfig = {
          colegio: {
            id: 'colegio' as const,
            tabTitle: "Organigrama Colegio Informático 'San Juan de Vera'",
            shortTitle: "Colegio Informático 'San Juan de Vera'",
            badge: 'Nivel educativo y académico',
            heading: "Organigrama Colegio Informático 'San Juan de Vera'",
            subheading: 'Estructura interna, conducción directiva, coordinaciones pedagógicas y equipos docentes de la sede San Juan de Vera.',
            fileName: 'Organigrama Colegio.png',
            icon: GraduationCap,
            accentBg: 'bg-emerald-50 text-[#00875A] border-emerald-200',
            primaryColor: '#00875A'
          },
          educar: {
            id: 'educar' as const,
            tabTitle: 'Organigrama Estructural Educar SRL',
            shortTitle: 'Organigrama Estructural Educar SRL',
            badge: 'Estructura corporativa y conducción',
            heading: 'Organigrama Estructural Educar SRL',
            subheading: 'Estructura organizacional y áreas estratégicas de la entidad propietaria Educar SRL: Presidencia, Gerencia General, Administración, Finanzas, Sistemas y Recursos Humanos.',
            fileName: tryFallbackEducar ? 'Organigrama Educar.png' : 'Organigrama Educar .png',
            icon: Briefcase,
            accentBg: 'bg-blue-50 text-[#1E3A8A] border-blue-200',
            primaryColor: '#1E3A8A'
          }
        };

        const currentOrg = organigramasConfig[organigramaTab];
        const currentImageUrl = getOrganigramaImageUrl(currentOrg.fileName);
        const isLoading = imagesLoading[organigramaTab];
        const hasError = imagesError[organigramaTab];

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. Selector de Pestañas Moderno (Dos Secciones) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-1.5 bg-[#F4F5F7] rounded-2xl border border-slate-200/90 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setOrganigramaTab('colegio');
                  setLightboxZoom(1);
                }}
                className={`flex-1 flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  organigramaTab === 'colegio'
                    ? 'bg-[#00875A] hover:bg-[#007031] text-white shadow-md shadow-emerald-950/20 border border-[#00602A] scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <GraduationCap className={`w-4 h-4 shrink-0 ${organigramaTab === 'colegio' ? 'text-white' : 'text-[#00875A]'}`} />
                <span className="truncate">{organigramasConfig.colegio.tabTitle}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrganigramaTab('educar');
                  setLightboxZoom(1);
                }}
                className={`flex-1 flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  organigramaTab === 'educar'
                    ? 'bg-[#00875A] hover:bg-[#007031] text-white shadow-md shadow-emerald-950/20 border border-[#00602A] scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <Briefcase className={`w-4 h-4 shrink-0 ${organigramaTab === 'educar' ? 'text-white' : 'text-[#00875A]'}`} />
                <span className="truncate">{organigramasConfig.educar.tabTitle}</span>
              </button>
            </div>

            {/* 2. Tarjeta Blanca Estilizada con Visualización y Accesibilidad */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Encabezado de la Tarjeta */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentOrg.accentBg}`}>
                      {currentOrg.badge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-left">
                    {currentOrg.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-[75ch] text-left leading-relaxed">
                    {currentOrg.subheading}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxZoom(1);
                      setIsLightboxOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#007031] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-md"
                    title="Ampliar a pantalla completa con zoom interactivo"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Ampliar / Pantalla completa</span>
                  </button>

                  <a
                    href={currentImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center border border-slate-200 shadow-2xs"
                    title="Abrir imagen original en nueva pestaña"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Contenedor del Organigrama */}
              <div className="relative rounded-2xl bg-slate-50/90 border border-slate-200/90 p-3 sm:p-6 flex flex-col items-center justify-center min-h-[380px] overflow-hidden group">
                {/* Skeleton de carga */}
                {isLoading && !hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-10 space-y-3">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00875A] rounded-full animate-spin" />
                    <p className="text-xs font-semibold text-slate-500 animate-pulse">
                      Cargando organigrama oficial...
                    </p>
                  </div>
                )}

                {/* Vista si ocurre un error de carga */}
                {hasError ? (
                  <div className="p-8 text-center max-w-lg mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Imagen del organigrama en proceso de sincronización
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      No se pudo cargar la imagen institucional en este momento. Por favor verifica tu conexión o reintenta.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImagesError(prev => ({ ...prev, [organigramaTab]: false }));
                          setImagesLoading(prev => ({ ...prev, [organigramaTab]: true }));
                          if (organigramaTab === 'educar' && !tryFallbackEducar) {
                            setTryFallbackEducar(true);
                          }
                        }}
                        className="px-4 py-2 bg-[#00875A] hover:bg-[#007031] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reintentar carga</span>
                      </button>
                      <a
                        href={currentImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200"
                      >
                        Abrir URL directa
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={currentImageUrl}
                      alt={currentOrg.heading}
                      onLoad={() => {
                        setImagesLoading(prev => ({ ...prev, [organigramaTab]: false }));
                        setImagesError(prev => ({ ...prev, [organigramaTab]: false }));
                      }}
                      onError={() => {
                        if (organigramaTab === 'educar' && !tryFallbackEducar) {
                          setTryFallbackEducar(true);
                          return;
                        }
                        setImagesLoading(prev => ({ ...prev, [organigramaTab]: false }));
                        setImagesError(prev => ({ ...prev, [organigramaTab]: true }));
                      }}
                      onClick={() => {
                        setLightboxZoom(1);
                        setIsLightboxOpen(true);
                      }}
                      className="w-full h-auto max-h-[75vh] object-contain mx-auto rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-[1.01] cursor-zoom-in"
                    />

                    {/* Overlay botón flotante para sugerir la interacción de zoom */}
                    <div className="absolute bottom-4 right-4 pointer-events-none opacity-90 group-hover:opacity-100 transition">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-xs shadow-md">
                        <ZoomIn className="w-3.5 h-3.5 text-[#CFB07A]" />
                        <span>Clic para ampliar</span>
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Pie informativo de la tarjeta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#00875A]" />
                  <span>Organigrama oficial y actualizado para el ciclo lectivo y operativo 2026.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxZoom(1);
                    setIsLightboxOpen(true);
                  }}
                  className="font-bold text-[#00875A] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Explorar en pantalla completa</span>
                </button>
              </div>
            </div>

            {/* 3. Modal / Lightbox de Pantalla Completa con Zoom Nitido */}
            {isLightboxOpen && (
              <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col animate-fadeIn select-none">
                {/* Header del Lightbox */}
                <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between text-white shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 font-mono hidden sm:inline">
                      {currentOrg.badge}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-white truncate">
                      {currentOrg.heading}
                    </h3>
                  </div>

                  {/* Controles de Zoom y Acciones */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 p-0.5">
                      <button
                        type="button"
                        onClick={() => setLightboxZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition cursor-pointer"
                        title="Alejar (-)"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-slate-200 min-w-[52px] text-center">
                        {Math.round(lightboxZoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setLightboxZoom(z => Math.min(3.5, +(z + 0.25).toFixed(2)))}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition cursor-pointer"
                        title="Acercar (+)"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLightboxZoom(1)}
                        className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition border-l border-slate-700 ml-0.5 cursor-pointer"
                        title="Restablecer tamaño original (100%)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <a
                      href={currentImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      title="Abrir imagen original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(false)}
                      className="p-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-rose-200 border border-red-700/60 transition cursor-pointer"
                      title="Cerrar (Esc)"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Canvas de Visualización con Zoom */}
                <div 
                  className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center cursor-grab active:cursor-grabbing"
                  onDoubleClick={() => setLightboxZoom(z => z > 1 ? 1 : 2)}
                >
                  <img
                    src={currentImageUrl}
                    alt={currentOrg.heading}
                    style={{
                      transform: `scale(${lightboxZoom})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out'
                    }}
                    className="max-w-none sm:max-w-full h-auto object-contain select-none shadow-2xl rounded-lg"
                  />
                </div>

                {/* Barra Inferior con Ayuda de Navegación */}
                <div className="bg-slate-900/80 border-t border-slate-800/80 py-2 px-4 text-center text-xs text-slate-400">
                  <span>
                    💡 <strong>Consejo de lectura:</strong> Haz doble clic sobre la imagen para alternar zoom o usa los controles superiores (+ / -). Pulsa <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">Esc</kbd> para salir.
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 3: CANALES DE COMUNICACIÓN INTERNA */}
      {activeTab === 'canales' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Protocolo de canales de comunicación interna
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Conocer por dónde canalizar cada necesidad garantiza una convivencia eficiente y profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationChannels.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                      <span className="text-xs text-slate-500 font-mono">{c.account}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {c.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.desc}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                  <span className="font-bold text-slate-800">Regla clave: </span>
                  {c.guidelines}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE AUTORIDAD */}
      {selectedAuthority && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#D4B26F]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedAuthority.photoUrl}
                  alt={selectedAuthority.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4B26F]"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedAuthority.name}</h3>
                  <p className="text-xs font-semibold text-[#008751]">{selectedAuthority.role}</p>
                  <p className="text-xs text-slate-500">{selectedAuthority.area}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuthority(null)}
                className="text-slate-400 hover:text-slate-800 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              <span className="font-bold text-slate-900 block mb-1">Acerca de su función:</span>
              <p className="whitespace-pre-wrap">{selectedAuthority.bio}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-[#1E3A8A]" />
                <span className="font-mono">{selectedAuthority.email}</span>
              </div>
              {selectedAuthority.phoneExt && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-[#008751]" />
                  <span>{selectedAuthority.phoneExt} (Teléfono Central del Colegio)</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <a
                href={`mailto:${selectedAuthority.email}`}
                className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold text-center transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Enviar correo
              </a>
              <button
                onClick={() => setSelectedAuthority(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Checkpoint de la Misión */}
      <MissionCheckpointFooter
        missionCode="Misión 03"
        missionTitle="Comunidad educativa"
        nextMissionTitle="Misión 04: Mi rol y certificación"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onNavigateNext={onNavigateNext}
      />
    </div>
  );
};
