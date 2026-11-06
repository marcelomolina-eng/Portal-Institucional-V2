import React from 'react';
import { CommitmentRule } from '../types';
import { 
  Compass, 
  Clock, 
  UserCheck, 
  Smile, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Heart,
} from 'lucide-react';
import { MissionCheckpointFooter } from './MissionCheckpointFooter';

interface Mission4RoleProps {
  commitmentRules: CommitmentRule[];
  onComplete: () => void;
  onNavigateNext: () => void;
  isCompleted: boolean;
}

export const Mission4Role: React.FC<Mission4RoleProps> = ({
  commitmentRules,
  onComplete,
  onNavigateNext,
  isCompleted
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [checkedChecklist, setCheckedChecklist] = React.useState<Record<string, boolean>>({});

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % commitmentRules.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + commitmentRules.length) % commitmentRules.length);
  };

  const getRuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-6 h-6 text-[#7A1C1C]" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-[#008751]" />;
      case 'Smile': return <Smile className="w-6 h-6 text-[#D4B26F]" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-[#1E3A8A]" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-[#7C3AED]" />;
      default: return <Sparkles className="w-6 h-6 text-[#EA580C]" />;
    }
  };

  const slidePhotos = [
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', // Puntualidad
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', // Uniforme
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', // Convivencia
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', // Instalaciones
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', // Capacitaciones
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'  // Comunidad
  ];

  const checklistItems = [
    'Conozco mi horario exacto de ingreso y tolerancia.',
    'Tengo asignada mi indumentaria institucional o credencial.',
    'Sé quién es mi referente de coordinación y mi canal directo de consulta.',
    'Tengo acceso a mi correo corporativo @educarsrl.com.ar.',
    'Conozco las normas de cuidado de los equipos tecnológicos y las aulas.'
  ];

  const toggleCheck = (item: string) => {
    setCheckedChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const rule = commitmentRules[currentSlide];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header de la Misión */}
      <div className="bg-gradient-to-r from-[#EA580C] via-[#c2410c] to-[#9a3412] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4B26F]/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4B26F]/20 text-[#D4B26F] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" /> MISIÓN 04: OPERACIÓN INFORMÁTICO
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ser Parte y Construir Juntos: Mi Rol en Educar
            </h1>
            <p className="text-sm sm:text-base text-orange-100 max-w-2xl leading-relaxed">
              Las 6 pautas de compromiso que dan sentido a nuestro trabajo cotidiano y consolidan el prestigio del Colegio Informático.
            </p>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-white text-[#EA580C] border border-white'
                : 'bg-[#D4B26F] text-[#5A1212] hover:bg-[#e4c485]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión Completada • Certificación' : 'Completar e Ir al Diploma'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CARRUSEL INTERACTIVO DE LAS 6 PAUTAS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              {getRuleIcon(rule.iconName)}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C1C]">
                Compromiso #{rule.number} de {commitmentRules.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {rule.title}
              </h2>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-500">
              {currentSlide + 1} / {commitmentRules.length}
            </span>
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md border-2 border-slate-100">
              <img
                src={slidePhotos[currentSlide]}
                alt={rule.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                {rule.badge}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/60 text-[#9a3412] font-semibold text-sm">
              {rule.highlight}
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {rule.description}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Pautas Prácticas para el Día a Día:
              </h4>
              <div className="space-y-2">
                {rule.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
          {commitmentRules.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? 'w-8 bg-[#7A1C1C]' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Ir a pauta ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CHECKLIST DE PRIMEROS DÍAS */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#008751]" />
            <span>Autocomprobación: Tu Kit de Bienvenida</span>
          </h3>
          <p className="text-xs text-slate-500">
            Marca los puntos a medida que los vayas completando en tu primera semana.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checklistItems.map((item, idx) => {
            const isChecked = checkedChecklist[item];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(item)}
                className={`cursor-pointer p-3.5 rounded-xl border transition flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition ${
                  isChecked ? 'bg-[#008751] border-[#008751] text-white' : 'border-slate-300'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs leading-relaxed">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOTO DE CIERRE DEL EQUIPO CON FRASE INSTITUCIONAL INSPIRADORA */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4B26F] bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5A1212] via-black/60 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4B26F] text-[#5A1212] flex items-center justify-center mx-auto shadow-lg">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          <p className="text-lg sm:text-2xl font-serif-title italic text-slate-100 font-semibold leading-relaxed">
            "No importa cuál sea tu función: tu manera de hacer las cosas también forma parte de nuestra identidad."
          </p>

          <div className="pt-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4B26F] block">
              Comunidad Educativa Educar SRL
            </span>
            <span className="text-[11px] text-slate-300">
              Colegio Informático • Ciclo Lectivo 2026
            </span>
          </div>
        </div>
      </div>

      {/* Footer Checkpoint de la Misión */}
      <MissionCheckpointFooter
        missionCode="Misión 04"
        missionTitle="Mi Rol en Educar"
        nextMissionTitle="Certificación Final"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onNavigateNext={onNavigateNext}
        isFinalMission={true}
      />
    </div>
  );
};
