import React from 'react';
import { InitiativeItem, CalendarEvent } from '../types';
import { 
  Sparkles, 
  Calendar, 
  UserCheck, 
  Video, 
  HelpCircle, 
  Compass, 
  Award, 
  HeartHandshake, 
  Trophy, 
  Lightbulb, 
  Globe, 
  Cpu, 
  Bot, 
  Gift, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';
import { MissionCheckpointFooter } from './MissionCheckpointFooter';

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
  const [selectedInitiative, setSelectedInitiative] = React.useState<InitiativeItem | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<number | 'all'>('all');
  const [searchCalendar, setSearchCalendar] = React.useState('');
  const [activeSection, setActiveSection] = React.useState<'iniciativas' | 'calendario'>('iniciativas');

  // Helper for dynamic icons
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
              Explorar Nuestra Esencia en Acción
            </h1>
            <p className="text-base text-emerald-50 max-w-[65ch] leading-[1.5] text-left">
              Las 8 iniciativas pilares que marcan el ritmo del año y el Calendario Anual Integrado 2026. Conoce a los referentes y el valor pedagógico de cada proyecto.
            </p>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.06em] transition-all flex items-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-white text-[#00602A] border border-white'
                : 'bg-[#CFB07A] text-[#1C1A17] hover:bg-[#e4c485]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión Completada • Continuar' : 'Completar y Pasar a Misión 03'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Switcher de Sección: Iniciativas vs Calendario */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSection('iniciativas')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSection === 'iniciativas'
              ? 'border-[#01913F] text-[#00602A] bg-emerald-50/70 rounded-t-lg'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>8 Iniciativas & Referentes</span>
        </button>

        <button
          onClick={() => setActiveSection('calendario')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSection === 'calendario'
              ? 'border-[#01913F] text-[#00602A] bg-emerald-50/70 rounded-t-lg'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendario Anual 2026 ({calendarEvents.length} Eventos)</span>
        </button>
      </div>

      {/* SECCIÓN 1: CUADRÍCULA DE INICIATIVAS */}
      {activeSection === 'iniciativas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-[1.5rem] font-bold text-slate-900 leading-[1.25] text-left">
                Iniciativas que nos Definen
              </h2>
              <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
                Haz clic en cualquier iniciativa para ver el detalle de "¿Qué hacemos?", "¿Por qué lo hacemos?" y "¿Qué valor aporta?".
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.06em] px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-slate-800 self-start">
              8 Ejes Estratégicos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {initiatives.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedInitiative(item)}
                className="cursor-pointer group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#01913F] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: item.accentColor }}
                    >
                      {getInitiativeIcon(item.iconName)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-[1.125rem] leading-[1.3] text-left group-hover:text-[#00602A] transition">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#00602A]" />
                      <span className="font-semibold text-slate-800">{item.referent}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left line-clamp-3">
                    {item.queHacemos}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-[#00602A] uppercase tracking-[0.06em]">
                  <span>Ver Ficha Completa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
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
                <span>Calendario Anual de Eventos e Hitos 2026</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sincronizado con la hoja <span className="font-mono text-slate-700 font-semibold">Calendario_Eventos</span> de RRHH.
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
              Todos los Meses
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

                  <p className="text-xs text-slate-600 leading-relaxed">
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

      {/* MODAL DETALLADO DE INICIATIVA ("¿Qué hacemos?", "¿Por qué lo hacemos?", "¿Qué valor aporta?") */}
      {selectedInitiative && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#D4B26F] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: selectedInitiative.accentColor }}
                >
                  {getInitiativeIcon(selectedInitiative.iconName)}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#008751]">
                    {selectedInitiative.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {selectedInitiative.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Referente: <span className="text-slate-800 font-bold">{selectedInitiative.referent}</span> ({selectedInitiative.referentRole})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInitiative(null)}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Los 3 interrogantes obligatorios */}
            <div className="space-y-4">
              {/* 1. ¿Qué hacemos? */}
              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#008751] space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#008751] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> 1. ¿Qué Hacemos?
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedInitiative.queHacemos}
                </p>
              </div>

              {/* 2. ¿Por qué lo hacemos? */}
              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#7A1C1C] space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#7A1C1C] flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" /> 2. ¿Por Qué Lo Hacemos?
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedInitiative.porqueLoHacemos}
                </p>
              </div>

              {/* 3. ¿Qué valor aporta? */}
              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#D4B26F] space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#B45309] flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> 3. ¿Qué Valor Aporta?
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedInitiative.queValorAporta}
                </p>
              </div>
            </div>

            {/* Video preview / Drive link si existe */}
            {selectedInitiative.videoDriveId && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#008751]" />
                  <span>Cápsula de video institucional asignada</span>
                </div>
                <a
                  href={`https://drive.google.com/file/d/${selectedInitiative.videoDriveId}/view`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#008751] hover:underline flex items-center gap-1"
                >
                  Abrir video <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <button
              onClick={() => setSelectedInitiative(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}

      {/* Footer Checkpoint de la Misión */}
      <MissionCheckpointFooter
        missionCode="Misión 02"
        missionTitle="Esencia en Acción"
        nextMissionTitle="Misión 03: Comunidad Educativa"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onNavigateNext={onNavigateNext}
      />
    </div>
  );
};
