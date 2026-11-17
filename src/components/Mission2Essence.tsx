import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InitiativeItem, CalendarEvent } from '../types';
import {
  Sparkles,
  Calendar,
  UserCheck,
  Video,
  Compass,
  HeartHandshake,
  Trophy,
  Lightbulb,
  Globe,
  Cpu,
  Bot,
  Gift,
  Search,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';
import { MissionCheckpointFooter } from './MissionCheckpointFooter';
import { parseVideoSource } from '../utils/video';

interface Mission2EssenceProps {
  initiatives: InitiativeItem[];
  calendarEvents: CalendarEvent[];
  onComplete: () => void;
  onNavigateNext: () => void;
  isCompleted: boolean;
}

export const Mission2Essence: React.FC<Mission2EssenceProps> = ({
  initiatives,
  calendarEvents,
  onComplete,
  onNavigateNext,
  isCompleted
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [searchCalendar, setSearchCalendar] = useState('');
  const [activeSection, setActiveSection] = useState<'iniciativas' | 'calendario'>('iniciativas');

  // Referencias compartidas para garantizar una única pista de audio activa en simultáneo
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const pauseAllOtherVideos = (activeId: string) => {
    // Pausar todos los reproductores HTML5 (<video>) excepto el activo
    Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
      if (id !== activeId && videoEl && !videoEl.paused) {
        try {
          videoEl.pause();
        } catch {
          // Ignorar errores de pausa en navegadores restrictivos
        }
      }
    });

    // Pausar otros iframes embebidos (YouTube / Vimeo) vía postMessage
    Object.entries(iframeRefs.current).forEach(([id, iframeEl]) => {
      if (id !== activeId && iframeEl?.contentWindow) {
        try {
          iframeEl.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
            '*'
          );
          iframeEl.contentWindow.postMessage(
            JSON.stringify({ method: 'pause' }),
            '*'
          );
        } catch {
          // Ignorar si el iframe aún no cargó
        }
      }
    });
  };

  // Detectar clic/reproducción dentro de un iframe embebido (YouTube/Vimeo) para pausar los demás videos
  useEffect(() => {
    const handleWindowBlur = () => {
      const activeEl = document.activeElement;
      if (!activeEl || activeEl.tagName !== 'IFRAME') return;

      const matchedEntry = Object.entries(iframeRefs.current).find(
        ([, el]) => el === activeEl
      );
      if (matchedEntry) {
        pauseAllOtherVideos(matchedEntry[0]);
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  // Ordenar iniciativas por 'orden' ascendente
  const sortedInitiatives = useMemo(() => {
    return [...initiatives].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [initiatives]);

  // Icono dinámico por iniciativa
  const getInitiativeIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const months = [
    { num: 2, label: 'Febrero' },
    { num: 3, label: 'Marzo' },
    { num: 4, label: 'Abril' },
    { num: 5, label: 'Mayo' },
    { num: 6, label: 'Junio' },
    { num: 7, label: 'Julio' },
    { num: 8, label: 'Agosto' },
    { num: 9, label: 'Septiembre' },
    { num: 10, label: 'Octubre' },
    { num: 11, label: 'Noviembre' },
    { num: 12, label: 'Diciembre' }
  ];

  const filteredEvents = calendarEvents.filter((evt) => {
    const matchesMonth = selectedMonth === 'all' || evt.month === selectedMonth;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchCalendar.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchCalendar.toLowerCase()) ||
      evt.responsible.toLowerCase().includes(searchCalendar.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header de la Misión */}
      <div className="bg-gradient-to-r from-[#008751] via-[#006e42] to-[#004d2e] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4B26F]/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4B26F]/20 text-[#CFB07A] text-xs font-bold uppercase tracking-[0.06em]">
              <Sparkles className="w-4 h-4" /> MISIÓN 02: OPERACIÓN INFORMÁTICO
            </div>
            <h1 className="text-[2rem] font-bold text-white leading-[1.25] text-left">
              Explorar nuestra esencia en acción
            </h1>
            <p className="text-base text-emerald-50 max-w-[65ch] leading-[1.5] text-left">
              Las iniciativas pilares que marcan el ritmo del año y el calendario anual integrado 2026. Escucha a cada referente presentar su proyecto institucional.
            </p>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.06em] transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isCompleted
                ? 'bg-white text-[#00602A] border border-white'
                : 'bg-[#CFB07A] text-[#1C1A17] hover:bg-[#e4c485]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión completada • Continuar' : 'Completar y pasar a Misión 03'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Switcher de Sección */}
      <div className="bg-[#F4F5F7] p-2 rounded-2xl border border-slate-200/90 shadow-inner flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSection('iniciativas')}
          className={`flex items-center gap-2.5 px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeSection === 'iniciativas'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Video className={`w-4 h-4 ${activeSection === 'iniciativas' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Iniciativas y referentes</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono transition-colors ${
              activeSection === 'iniciativas'
                ? 'bg-white/25 text-white'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {sortedInitiatives.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('calendario')}
          className={`flex items-center gap-2.5 px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeSection === 'calendario'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Calendar className={`w-4 h-4 ${activeSection === 'calendario' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Calendario anual 2026</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono transition-colors ${
              activeSection === 'calendario'
                ? 'bg-white/25 text-white'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {calendarEvents.length} eventos
          </span>
        </button>
      </div>

      {/* SECCIÓN 1: CUADRÍCULA DE INICIATIVAS CON VIDEO */}
      {activeSection === 'iniciativas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-[1.5rem] font-bold text-slate-900 leading-[1.25] text-left">
                Iniciativas que nos definen
              </h2>
              <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
                Conoce el propósito y el impacto de cada área a través del video explicativo de su referente institucional.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.06em] px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-slate-800 self-start">
              {sortedInitiatives.length} ejes estratégicos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedInitiatives.map((item) => {
              const videoSource = parseVideoSource(item.videoUrl);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-[#01913F]/70 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
                >
                  {/* Encabezado limpio de la tarjeta */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                          style={{ backgroundColor: item.accentColor || '#008751' }}
                        >
                          {getInitiativeIcon(item.iconName)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-[1.2rem] leading-[1.3] text-left">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 mt-1.5">
                        <UserCheck className="w-4 h-4 text-[#00602A] shrink-0" />
                        <span>
                          Referente: <strong className="font-semibold text-slate-900">{item.referent}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reproductor de video limpio en formato 16:9 */}
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-950 relative">
                    {videoSource.type === 'direct' && (
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el;
                        }}
                        src={videoSource.src}
                        controls
                        preload="metadata"
                        playsInline
                        autoPlay={false}
                        onPlay={() => pauseAllOtherVideos(item.id)}
                        className="w-full h-full object-cover bg-slate-950"
                      />
                    )}

                    {(videoSource.type === 'youtube' || videoSource.type === 'vimeo') && (
                      <iframe
                        ref={(el) => {
                          iframeRefs.current[item.id] = el;
                        }}
                        src={videoSource.embedUrl}
                        title={`Video de presentación: ${item.title}`}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full border-0"
                      />
                    )}

                    {videoSource.type === 'none' && (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#12231A] to-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#CFB07A]">
                          <Video className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">
                            Video de presentación próximamente
                          </p>
                          <p className="text-xs text-slate-300 max-w-xs mx-auto">
                            {item.referent} compartirá aquí el video explicativo de esta iniciativa.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: CALENDARIO ANUAL INTEGRADO 2026 */}
      {activeSection === 'calendario' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#008751]" />
                <span>Calendario anual de eventos e hitos 2026</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Cronograma oficial de actividades, celebraciones y encuentros de la comunidad educativa.
              </p>
            </div>

            {/* Buscador de Eventos */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar evento, responsable..."
                value={searchCalendar}
                onChange={(e) => setSearchCalendar(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#008751]"
              />
            </div>
          </div>

          {/* Filtros de Mes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100">
            <button
              onClick={() => setSelectedMonth('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedMonth === 'all'
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos los meses
            </button>
            {months.map((m) => (
              <button
                key={m.num}
                onClick={() => setSelectedMonth(m.num)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedMonth === m.num
                    ? 'bg-[#008751] text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Lista de Eventos Filtrados */}
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm">No se encontraron eventos para el filtro seleccionado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#008751] hover:bg-emerald-50/20 transition space-y-2 bg-slate-50/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#008751] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {evt.dateStr}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {evt.category}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {evt.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      Resp: <span className="font-semibold text-slate-700">{evt.responsible}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {evt.targetAudience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Checkpoint de la Misión */}
      <MissionCheckpointFooter
        missionCode="Misión 02"
        missionTitle="Esencia en acción"
        nextMissionTitle="Misión 03: Comunidad educativa"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onNavigateNext={onNavigateNext}
      />
    </div>
  );
};
