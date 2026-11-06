import React from 'react';
import confetti from 'canvas-confetti';
import { DiplomaRecord, FeedbackRecord } from '../types';
import { sha256 } from '../utils/crypto';
import { InstitutionalLogo } from './InstitutionalLogo';
import { 
  Award, 
  CheckCircle2, 
  Printer, 
  Download, 
  Send, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  User, 
  Briefcase, 
  Mail, 
  FileCheck,
  Check,
  RotateCcw
} from 'lucide-react';

interface MissionCompletedProps {
  onSaveDiploma: (diploma: DiplomaRecord) => void;
  onSaveFeedback: (feedback: FeedbackRecord) => void;
}

export const MissionCompleted: React.FC<MissionCompletedProps> = ({
  onSaveDiploma,
  onSaveFeedback
}) => {
  // Diploma form state
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [entryDate, setEntryDate] = React.useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [email, setEmail] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedDiploma, setGeneratedDiploma] = React.useState<DiplomaRecord | null>(null);

  // Feedback form state
  const [overallRating, setOverallRating] = React.useState(5);
  const [clarityRating, setClarityRating] = React.useState(5);
  const [mostUseful, setMostUseful] = React.useState('Misión 02: 8 Iniciativas & Calendario');
  const [suggestions, setSuggestions] = React.useState('');
  const [feedbackSent, setFeedbackSent] = React.useState(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7A1C1C', '#008751', '#D4B26F', '#FFFFFF']
      });
    } catch {
      // safe fallback
    }
  };

  const [formError, setFormError] = React.useState<string | null>(null);

  const handleGenerateDiploma = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullName.trim() || !role.trim()) {
      setFormError('Por favor, completa tu Nombre y Apellido y el Puesto o Sector.');
      return;
    }

    setIsGenerating(true);

    const folio = `CI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
    const rawData = `${fullName}|${role}|${entryDate}|${folio}`;
    const hash = await sha256(rawData);

    const newDiploma: DiplomaRecord = {
      id: `dip-${Date.now()}`,
      timestamp,
      fullName: fullName.trim(),
      role: role.trim(),
      email: email.trim(),
      entryDate,
      certificateFolio: folio,
      verificationHash: hash,
      status: 'Emitido'
    };

    setTimeout(() => {
      setGeneratedDiploma(newDiploma);
      onSaveDiploma(newDiploma);
      setIsGenerating(false);
      triggerConfetti();
    }, 600);
  };

  const handlePrintDiploma = () => {
    window.print();
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: FeedbackRecord = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
      fullName: fullName || 'Colaborador Anónimo',
      role: role || 'No especificado',
      overallRating,
      clarityRating,
      mostUsefulSection: mostUseful,
      suggestions: suggestions.trim(),
      wouldRecommend: true
    };

    onSaveFeedback(feedback);
    setFeedbackSent(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* BANNER CELEBRATORIO DE MISIÓN CUMPLIDA */}
      <div className="bg-gradient-to-r from-[#1C1A17] via-[#2A1513] to-[#12231A] text-white p-6 sm:p-10 rounded-3xl border-3 border-[#CFB07A] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#CFB07A] text-[#1C1A17] text-xs font-black uppercase tracking-widest shadow-md">
            <Award className="w-4 h-4 text-[#DE4034]" /> MISIÓN CUMPLIDA • CICLO LECTIVO 2026
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ¡OPERACIÓN CUMPLIDA!
          </h1>

          <p className="text-base sm:text-xl text-[#F7F3EA] font-medium leading-relaxed">
            ¡Felicitaciones! Completaste tu recorrido por el Colegio Informático. Bajo nuestro blasón <span className="text-[#CFB07A] font-serif-title font-bold">"VERITA VINCI"</span>, hoy comienzas a escribir tu historia junto a nosotros.
          </p>

          <p className="text-xs sm:text-sm text-slate-200">
            Completa tus datos a continuación para registrar tu ingreso en la base de datos de RRHH y obtener tu Diploma Oficial de Incorporación.
          </p>
        </div>
      </div>

      {/* SECCIÓN 1: FORMULARIO Y VISUALIZADOR DEL DIPLOMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulario de Emisión */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <FileCheck className="w-5 h-5 text-[#DE4034]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Formulario de Certificación
              </h2>
              <p className="text-xs text-slate-500">
                Datos que figurarán en tu constancia oficial
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateDiploma} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre y Apellido *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Lic. Martín Rossi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Puesto o Sector Asignado *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Docente de Robótica / Preceptoría Secundario"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fecha de Ingreso
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Corporativo / Personal
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="nombre@educarsrl.com.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                  />
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-[#01913F] hover:bg-[#007031] text-white font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Emitiendo constancia...</span>
              ) : (
                <>
                  <Award className="w-5 h-5 text-[#CFB07A]" />
                  <span>OBTENER MI DIPLOMA</span>
                </>
              )}
            </button>
          </form>

          {generatedDiploma && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Diploma Registrado Exitosamente</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                Folio Oficial: <span className="font-mono font-bold">{generatedDiploma.certificateFolio}</span>. Guardado en la base de datos de RRHH.
              </p>
            </div>
          )}
        </div>

        {/* VISTA PREVIA / CANVAS DEL DIPLOMA OFICIAL (IMPRIMIBLE) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#DE4034] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#CFB07A]" /> Vista Oficial del Certificado
            </span>
            {generatedDiploma && (
              <button
                onClick={handlePrintDiploma}
                className="px-4 py-2 rounded-xl bg-[#DE4034] hover:bg-[#8F1F17] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-[#CFB07A]" />
                <span>Imprimir / Guardar como PDF</span>
              </button>
            )}
          </div>

          {/* ÁREA IMPRIMIBLE DEL DIPLOMA */}
          <div 
            id="diploma-printable-area"
            className="relative bg-white rounded-3xl p-8 sm:p-12 border-8 border-double border-[#CFB07A] shadow-2xl space-y-6 text-center overflow-hidden"
            style={{
              background: 'radial-gradient(circle at center, #FFFFFF 0%, #FAF8F2 100%)'
            }}
          >
            {/* Watermark Oficial del Escudo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-7 pointer-events-none">
              <img 
                src="/assets/aistudio/escudo_colegio_informatico.png" 
                alt="" 
                className="w-96 h-auto object-contain filter grayscale" 
              />
            </div>

            {/* Encabezado del Diploma con Escudo Oficial */}
            <div className="relative z-10 space-y-2">
              <img
                src="/assets/aistudio/escudo_colegio_informatico.png"
                alt="Escudo Oficial Colegio Informático - Verita Vinci"
                className="w-20 h-auto mx-auto object-contain drop-shadow-md"
              />
              <div className="text-[12px] font-extrabold tracking-widest text-[#22201B] uppercase font-sans">
                Colegio Informático • Comunidad Educativa Educar SRL
              </div>
              <div className="text-xs font-serif-title font-bold text-[#8F6A28] uppercase tracking-widest">
                — VERITA VINCI —
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-slate-900 tracking-tight pt-1">
                CERTIFICADO DE INDUCCIÓN E INTEGRACIÓN
              </h2>
              <div className="w-28 h-0.5 bg-[#CFB07A] mx-auto my-2" />
            </div>

            {/* Cuerpo del Diploma */}
            <div className="relative z-10 space-y-3 max-w-lg mx-auto">
              <p className="text-xs sm:text-sm text-slate-600 italic font-serif">
                Por cuanto ha completado satisfactoriamente el programa de inducción institucional
              </p>
              <div className="text-xs font-bold uppercase tracking-wider text-[#01913F] font-mono">
                "Operación Informático: Una misión: descubrir todo lo que nos une"
              </div>

              <p className="text-xs text-slate-500 pt-2">Se otorga la presente distinción a:</p>
              
              <div className="py-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#DE4034] font-serif-title border-b-2 border-[#CFB07A] pb-1 inline-block px-6 min-w-[260px]">
                  {generatedDiploma ? generatedDiploma.fullName : (fullName || 'Nombre del Colaborador')}
                </h3>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-slate-800">
                {generatedDiploma ? generatedDiploma.role : (role || 'Puesto / Sector')}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                Reconociendo su compromiso ético, vocación pedagógica y bienvenida oficial a la familia educativa Educar SRL para el Ciclo Lectivo 2026.
              </p>
            </div>

            {/* Firmas y Sellos */}
            <div className="relative z-10 pt-6 grid grid-cols-2 gap-8 max-w-md mx-auto border-t border-slate-200">
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-slate-700 text-sm">
                  Lic. Sofía Lorenzo
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Dirección Académica
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-slate-700 text-sm">
                  Natali Miño
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Gestión de Personas & RRHH
                </div>
              </div>
            </div>

            {/* Folio y Fecha */}
            <div className="relative z-10 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-dashed border-slate-200">
              <span>Fecha: {generatedDiploma ? generatedDiploma.entryDate : entryDate}</span>
              <span className="font-bold text-[#DE4034]">
                Folio: {generatedDiploma ? generatedDiploma.certificateFolio : 'CI-2026-DEMO'}
              </span>
              <span className="truncate max-w-[120px]">
                Hash: {generatedDiploma ? generatedDiploma.verificationHash.slice(0, 10) + '...' : '0xSECURE2026'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: FORMULARIO DE SATISFACCIÓN Y FEEDBACK (ONBOARDING) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Star className="w-5 h-5 text-[#008751]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Encuesta de Satisfacción del Proceso de Inducción
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tu opinión es vital para que RRHH continúe mejorando la experiencia de cada nuevo integrante.
            </p>
          </div>
        </div>

        {feedbackSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900">
              ¡Muchas gracias por tu retroalimentación!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
              Tu respuesta ha quedado registrada en la hoja <span className="font-mono font-bold">Feedback_Satisfaccion</span> de RRHH. ¡Te deseamos el mayor de los éxitos en Educar!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. ¿Cómo calificarías tu experiencia general con este portal?
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="p-1 focus:outline-none transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= overallRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {overallRating} / 5 estrellas
                  </span>
                </div>
              </div>

              {/* Clarity Rating */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. ¿La información sobre cultura, normas y contactos fue clara?
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setClarityRating(star)}
                      className="p-1 focus:outline-none transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= clarityRating
                            ? 'text-[#008751] fill-[#008751]'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {clarityRating} / 5 puntos
                  </span>
                </div>
              </div>
            </div>

            {/* Sección más útil */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. ¿Qué misión o contenido te resultó más enriquecedor para comenzar?
              </label>
              <select
                value={mostUseful}
                onChange={(e) => setMostUseful(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
              >
                <option value="Misión 01: Identidad, Misión y Videos Drive">Misión 01: Identidad, Misión y Videos Drive</option>
                <option value="Misión 02: 8 Iniciativas & Calendario">Misión 02: 8 Iniciativas & Calendario</option>
                <option value="Misión 03: Organigrama y Canales de Comunicación">Misión 03: Organigrama y Canales de Comunicación</option>
                <option value="Misión 04: Pautas de Convivencia y Kit de Ingreso">Misión 04: Pautas de Convivencia y Kit de Ingreso</option>
              </select>
            </div>

            {/* Sugerencias */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                4. Sugerencias, dudas o comentarios para el equipo de RRHH:
              </label>
              <textarea
                rows={3}
                placeholder="Escribe aquí cualquier comentario que desees compartir..."
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#7A1C1C] hover:bg-[#5A1212] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#D4B26F]" />
              <span>Enviar Encuesta de Satisfacción</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
