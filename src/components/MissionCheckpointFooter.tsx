import React from 'react';
import { Check, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';

interface MissionCheckpointFooterProps {
  missionCode: string; // e.g. "Misión 01"
  missionTitle: string; // e.g. "Identidad Institucional"
  nextMissionTitle: string; // e.g. "Misión 02: Esencia en Acción"
  isCompleted: boolean;
  onComplete: () => void;
  onNavigateNext: () => void;
  isFinalMission?: boolean;
}

export const MissionCheckpointFooter: React.FC<MissionCheckpointFooterProps> = ({
  missionCode,
  missionTitle,
  nextMissionTitle,
  isCompleted,
  onComplete,
  onNavigateNext,
  isFinalMission = false
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="flex items-center gap-3.5">
        <div 
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
            isCompleted 
              ? 'bg-emerald-100 text-[#01913F] border border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-[#01913F]" />
          ) : (
            <Sparkles className="w-6 h-6 text-[#DE4034]" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-extrabold uppercase text-[#DE4034]">
              {missionCode}
            </span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" /> Completada
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                En progreso
              </span>
            )}
          </div>

          <h4 className="font-bold text-slate-900 text-sm mt-0.5">
            {isCompleted ? `¡Has completado ${missionTitle}!` : `Finalizar ${missionTitle}`}
          </h4>
          <p className="text-xs text-slate-500">
            {isFinalMission 
              ? 'Marca como completada para emitir tu Diploma Oficial 2026.' 
              : `Marca esta etapa como leída y continúa hacia ${nextMissionTitle}.`}
          </p>
        </div>
      </div>

      {/* Acciones claras solicitadas por el usuario */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 sm:pt-0">
        {/* Botón: Marcar Misión como Completada */}
        <button
          type="button"
          onClick={onComplete}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border-2 ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-500 hover:text-emerald-700 shadow-xs'
          }`}
        >
          <Check className={`w-4 h-4 ${isCompleted ? 'text-emerald-700 stroke-[3]' : 'text-slate-400'}`} />
          <span>{isCompleted ? 'Misión completada' : 'Marcar misión como completada'}</span>
        </button>

        {/* Botón: Continuar a la Siguiente Misión */}
        <button
          type="button"
          onClick={() => {
            onComplete();
            onNavigateNext();
          }}
          className="px-5 py-2.5 rounded-xl bg-[#01913F] hover:bg-[#007031] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 border border-emerald-400/40"
        >
          <span>{isFinalMission ? 'Ir a certificación' : 'Continuar a la siguiente misión'}</span>
          {isFinalMission ? (
            <Award className="w-4 h-4 text-[#CFB07A]" />
          ) : (
            <ArrowRight className="w-4 h-4 text-[#CFB07A]" />
          )}
        </button>
      </div>
    </div>
  );
};
