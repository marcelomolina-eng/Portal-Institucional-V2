import React from 'react';
import { MissionId } from '../types';
import { MissionProgressInfo } from '../hooks/useMissionProgress';
import { 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award,
  Compass
} from 'lucide-react';

interface DiplomaLockedCardProps {
  completedCount: number;
  totalRequired: number;
  progressPercent: number;
  requiredMissionsList: MissionProgressInfo[];
  nextPendingMission: MissionId;
  nextPendingMissionTitle: string;
  onNavigateToMission: (id: MissionId) => void;
  onBackToHome: () => void;
}

export const DiplomaLockedCard: React.FC<DiplomaLockedCardProps> = ({
  completedCount,
  totalRequired,
  progressPercent,
  requiredMissionsList,
  nextPendingMission,
  nextPendingMissionTitle,
  onNavigateToMission,
  onBackToHome
}) => {
  const getMissionIcon = (id: MissionId) => {
    switch (id) {
      case 'mision1':
        return <ShieldCheck className="w-5 h-5 text-[#DE4034]" />;
      case 'mision2':
        return <Sparkles className="w-5 h-5 text-[#01913F]" />;
      case 'mision3':
        return <Users className="w-5 h-5 text-[#1E3A8A]" />;
      default:
        return <Compass className="w-5 h-5 text-[#CFB07A]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* BANNER PRINCIPAL DE BLOQUEO INSTITUCIONAL */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1A17] via-[#2A1715] to-[#12231A] text-white p-6 sm:p-10 border-2 border-[#CFB07A] shadow-2xl">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#DE4034]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#01913F]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-[#CFB07A]/60 text-[#CFB07A] text-xs font-bold tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Misiones en curso • Certificación bloqueada</span>
          </div>

          {/* Main Required Headline - H1: 32px (2rem), line-height 1.25 */}
          <div className="space-y-3">
            <h1 className="text-[2rem] font-bold text-white tracking-tight leading-[1.25] text-left">
              ¡Casi llegas! Completa las misiones 01, 02 y 03 para desbloquear tu Certificado Institucional
            </h1>
            <p className="text-base text-slate-100 max-w-[65ch] leading-[1.5] text-left">
              Para garantizar que cada nuevo integrante conozca la cultura, los valores y el equipo de Educar SRL, el diploma oficial se emite una vez completadas las tres misiones de inducción.
            </p>
          </div>

          {/* Progress Bar & Status Pill */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-[#CFB07A]/40 space-y-3 max-w-[65ch]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#CFB07A] uppercase tracking-[0.06em]">
                Progreso: {completedCount}/{totalRequired} misiones completadas
              </span>
              <span className="font-mono text-white text-xs font-bold bg-[#01913F]/30 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                {progressPercent}% Completado
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="bg-gradient-to-r from-[#DE4034] via-[#CFB07A] to-[#01913F] h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Botón de Acción Directa hacia la Misión Pendiente */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToMission(nextPendingMission)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#01913F] to-[#007031] hover:from-[#00a848] hover:to-[#01913F] text-white font-bold text-sm uppercase tracking-[0.06em] shadow-xl border border-emerald-400/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>Continuar con {nextPendingMissionTitle}</span>
              <ArrowRight className="w-4 h-4 text-[#CFB07A]" />
            </button>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-[0.06em] border border-white/20 transition"
            >
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHECKLIST INTERACTIVO DE LAS MISIONES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[1.5rem] font-bold text-slate-900 leading-[1.25] text-left">
              Requisitos de certificación Operación 2026
            </h2>
            <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
              Haz clic en cualquier misión para ingresar y completarla.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requiredMissionsList.map((m) => {
            return (
              <div
                key={m.id}
                onClick={() => onNavigateToMission(m.id)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between ${
                  m.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-amber-200 hover:border-[#DE4034]'
                }`}
              >
                <div className="space-y-3">
                  {/* Status header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#DE4034] tracking-wider uppercase">
                      {m.code}
                    </span>

                    {m.isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completada</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pendiente</span>
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {getMissionIcon(m.id)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {m.title}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center justify-between text-xs font-bold text-[#DE4034]">
                  <span>{m.isCompleted ? 'Repasar misión' : 'Completar misión'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TARJETA INFORMATIVA ADICIONAL */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200">
          <Award className="w-5 h-5 text-[#DE4034]" />
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">
            ¿Qué incluye tu Certificado Institucional?
          </h4>
          <p>
            Al completar las misiones 01, 02 y 03, se habilitará el generador de diploma con tu nombre, sector asignado, folio criptográfico único SHA-256 y opción para imprimir o guardar en PDF.
          </p>
        </div>
      </div>
    </div>
  );
};
