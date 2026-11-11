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
    '/src/assets/images/docente_ingreso_colegio_1794425649449.jpg', // Compromiso 1
    '/src/assets/images/colaboradores_uniforme_pasillo_1794425651684.jpg', // Compromiso 2
    '/src/assets/images/colaboradores_sala_docentes_1794425650084.jpg', // Compromiso 3
    '/src/assets/images/cuidado_espacios_aula_1794425672892.jpg', // Compromiso 4
    '/src/assets/images/capacitacion_docente_jornada_1794425675905.jpg', // Compromiso 5
    '/src/assets/images/comunidad_grupal_colegio_1794425675606.jpg'  // Compromiso 6
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
  const currentPhoto = rule?.image || slidePhotos[currentSlide] || slidePhotos[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header de la Misión */}
      <div className="bg-gradient-to-r from-[#EA580C] via-[#c2410c] to-[#9a3412] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4B26F]/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4B26F]/20 text-[#CFB07A] text-xs font-bold uppercase tracking-[0.06em]">
              <Compass className="w-4 h-4" /> MISIÓN 04: OPERACIÓN INFORMÁTICO
            </div>
            <h1 className="text-[2rem] font-bold text-white leading-[1.25] text-left">
              Ser parte y construir juntos: mi rol en Educar
            </h1>
            <p className="text-base text-orange-50 max-w-[65ch] leading-[1.5] text-left">
              Las 6 pautas de compromiso que dan sentido a nuestro trabajo cotidiano y consolidan el prestigio del Colegio Informático.
            </p>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.06em] transition-all flex items-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-white text-[#EA580C] border border-white'
                : 'bg-[#CFB07A] text-[#1C1A17] hover:bg-[#e4c485]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión completada • Certificación' : 'Completar e ir al diploma'}</span>
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
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#8F1F17] block">
                Compromiso #{rule.number} de {commitmentRules.length}
              </span>
              <h2 className="text-[1.5rem] font-bold text-slate-900 leading-[1.25] text-left">
                {rule.title}
              </h2>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-500">
              {currentSlide + 1} / {commitmentRules.length}
            </span>
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
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
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md border-2 border-slate-100 group">
              <img
                src={currentPhoto}
                alt={rule.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                {rule.badge}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-4">
            {/* Frase / Mensaje destacado del compromiso */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/80 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9a3412] mb-1 font-mono">
                Mensaje de compromiso:
              </div>
              <p className="text-sm sm:text-base text-[#9a3412] font-bold leading-snug">
                "{rule.highlight}"
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
              {rule.description}
            </p>

            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Pautas prácticas para el día a día:
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

            {/* Frase Destacada de Cierre al final del compromiso 6 */}
            {rule.number === 6 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1C1A17] via-[#2A1513] to-[#12231A] text-white border-2 border-[#CFB07A] shadow-md space-y-1.5 animate-fadeIn mt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CFB07A] font-mono">
                  <Sparkles className="w-4 h-4 text-[#CFB07A]" />
                  <span>Frase destacada de cierre</span>
                </div>
                <blockquote className="text-sm sm:text-base font-serif-title font-bold text-slate-100 leading-snug">
                  "No importa cuál sea tu función: tu manera de hacer las cosas también forma parte de nuestra identidad."
                </blockquote>
              </div>
            )}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
          {commitmentRules.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
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
          <h3 className="text-[1.125rem] font-bold text-slate-900 flex items-center gap-2 leading-[1.3] text-left">
            <Shield className="w-5 h-5 text-[#00602A]" />
            <span>Autocomprobación: tu kit de bienvenida</span>
          </h3>
          <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
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
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition ${
                  isChecked ? 'bg-[#00602A] border-[#00602A] text-white' : 'border-slate-400'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-sm leading-[1.5] text-left">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOTO DE CIERRE DEL EQUIPO CON FRASE INSTITUCIONAL INSPIRADORA */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#CFB07A] bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-xs"
          style={{ backgroundImage: 'url("/src/assets/images/comunidad_grupal_colegio_1794425675606.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5A1212] via-black/60 to-transparent" />

        <div className="relative z-10 max-w-[65ch] mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#CFB07A] text-[#1C1A17] flex items-center justify-center mx-auto shadow-lg">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          <p className="text-base sm:text-lg font-serif-title text-slate-100 font-semibold leading-[1.5] max-w-[65ch] mx-auto">
            "No importa cuál sea tu función: tu manera de hacer las cosas también forma parte de nuestra identidad."
          </p>

          <div className="pt-2">
            <span className="text-xs uppercase font-bold tracking-[0.06em] text-[#CFB07A] block">
              Comunidad Educativa Educar SRL
            </span>
            <span className="text-xs text-slate-300 tracking-[0.04em]">
              Colegio Informático • Ciclo Lectivo 2026
            </span>
          </div>
        </div>
      </div>

      {/* Footer Checkpoint de la Misión */}
      <MissionCheckpointFooter
        missionCode="Misión 04"
        missionTitle="Mi rol en Educar"
        nextMissionTitle="Certificación final"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onNavigateNext={onNavigateNext}
        isFinalMission={true}
      />
    </div>
  );
};
