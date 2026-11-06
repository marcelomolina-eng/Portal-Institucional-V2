import React from 'react';
import { MissionId } from '../types';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Heart, 
  Lightbulb, 
  Video, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  History,
  Calendar,
  Layers,
  Sparkles,
  Music
} from 'lucide-react';
import { HimnoPlayer } from './HimnoPlayer';
import { MissionCheckpointFooter } from './MissionCheckpointFooter';

interface Mission1IdentityProps {
  onComplete: () => void;
  onNavigateNext: () => void;
  isCompleted: boolean;
}

export const Mission1Identity: React.FC<Mission1IdentityProps> = ({
  onComplete,
  onNavigateNext,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = React.useState<'filosofia' | 'himno' | 'videos' | 'historia'>('filosofia');
  const [activeVideo, setActiveVideo] = React.useState<'video1' | 'video2'>('video1');

  const valores = [
    {
      title: 'Innovación con Propósito',
      desc: 'La tecnología no es un fin en sí mismo, sino el medio para potenciar la curiosidad, el pensamiento crítico y el impacto humano positivo.',
      icon: <Lightbulb className="w-5 h-5 text-[#008751]" />
    },
    {
      title: 'Calidez & Empatía',
      desc: 'Formamos una comunidad donde cada persona es escuchada por su nombre. La cercanía en el trato diario define nuestra convivencia.',
      icon: <Heart className="w-5 h-5 text-[#8B0000]" />
    },
    {
      title: 'Excelencia y Rigor',
      desc: 'Promovemos el gusto por el trabajo bien hecho, la superación continua y la pasión por enseñar y aprender.',
      icon: <Target className="w-5 h-5 text-[#D4B26F]" />
    },
    {
      title: 'Integridad y Ciudadanía',
      desc: 'Educamos en la honestidad, la responsabilidad cívica y el compromiso ético ante la sociedad y el entorno.',
      icon: <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" />
    }
  ];

  const hitos = [
    {
      year: '1995 - 2000',
      title: 'Nacimiento de una Visión Innovadora',
      desc: 'Fundación del Colegio Informático bajo el impulso de Educar SRL, pioneros en incorporar informática educativa cuando pocos colegios en el país lo hacían.'
    },
    {
      year: '2005 - 2012',
      title: 'Expansión de Niveles y Campus Propio',
      desc: 'Consolidación de Nivel Inicial, Primario y Secundario con infraestructura de avanzada, laboratorios de computación en red y aulas climatizadas.'
    },
    {
      year: '2015 - 2020',
      title: 'Programa Bilingüe y Robótica Maker',
      desc: 'Alianza internacional de certificaciones en inglés e inauguración de los laboratorios STEAM y talleres de robótica y prototipado 3D.'
    },
    {
      year: '2021 - 2026',
      title: 'Era de la Inteligencia Artificial y Liderazgo Humano',
      desc: 'Integración pedagógica de IA ética, programas de bienestar integral docente (Wellness), Expo Proyecto anual y consolidación de la Operación Informático.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header de la Misión */}
      <div className="bg-gradient-to-r from-[#1C1A17] via-[#2D1614] to-[#12231A] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#CFB07A] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/escudo_colegio_informatico.png"
              alt="Escudo Verita Vinci"
              className="w-14 h-18 object-contain drop-shadow-md hidden sm:block"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFB07A]/20 text-[#CFB07A] text-xs font-bold uppercase tracking-[0.06em]">
                <ShieldCheck className="w-4 h-4 text-[#01913F]" /> MISIÓN 01: OPERACIÓN INFORMÁTICO
              </div>
              <h1 className="text-[2rem] font-bold text-white leading-[1.25] text-left">
                Descubrir Quiénes Somos
              </h1>
              <p className="text-base text-slate-100 max-w-[65ch] leading-[1.5] text-left">
                Nuestras raíces, la filosofía educativa y el significado de nuestro escudo institucional bajo el lema <span className="font-serif-title text-[#CFB07A] font-bold">"VERITA VINCI"</span>.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.06em] transition-all flex items-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-[#01913F] text-white border border-emerald-400'
                : 'bg-[#CFB07A] text-[#1C1A17] hover:bg-[#dec28e]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión Completada • Continuar' : 'Completar y Pasar a Misión 02'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs de Navegación interna */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('filosofia')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'filosofia'
              ? 'border-[#DE4034] text-[#8F1F17] bg-red-50/70 rounded-t-lg'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Misión, Visión y Escudo</span>
        </button>

        <button
          onClick={() => setActiveTab('himno')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'himno'
              ? 'border-[#CFB07A] text-[#1C1A17] bg-[#CFB07A]/25 rounded-t-lg font-extrabold'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Music className="w-4 h-4 text-[#CFB07A]" />
          <span>Himno Institucional</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'videos'
              ? 'border-[#01913F] text-[#00602A] bg-emerald-50/70 rounded-t-lg'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videos Institucionales</span>
        </button>

        <button
          onClick={() => setActiveTab('historia')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'historia'
              ? 'border-[#CFB07A] text-[#634816] bg-amber-50/70 rounded-t-lg'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Hitos & Línea de Tiempo</span>
        </button>
      </div>

      {/* TAB 1: FILOSOFÍA, MISIÓN Y VISIÓN */}
      {activeTab === 'filosofia' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MISIÓN */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#8F1F17] transition">
              <div className="w-12 h-12 rounded-xl bg-[#8F1F17]/10 text-[#8F1F17] flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#8F1F17]">
                Nuestra Razón de Ser
              </span>
              <h2 className="text-[1.5rem] font-bold text-slate-900 mt-1 mb-3 leading-[1.25] text-left">
                Misión Institucional
              </h2>
              <p className="text-base text-slate-700 leading-[1.5] max-w-[65ch] text-left">
                Brindar una formación integral de excelencia que conjugue una sólida base académica y humana con la vanguardia científica y tecnológica, preparando a niños y jóvenes con valores cívicos, pensamiento crítico y sensibilidad social para transformar su entorno con libertad y responsabilidad.
              </p>
            </div>

            {/* VISIÓN */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#00602A] transition">
              <div className="w-12 h-12 rounded-xl bg-[#00602A]/10 text-[#00602A] flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#00602A]">
                Hacia Dónde Vamos
              </span>
              <h2 className="text-[1.5rem] font-bold text-slate-900 mt-1 mb-3 leading-[1.25] text-left">
                Visión Institucional
              </h2>
              <p className="text-base text-slate-700 leading-[1.5] max-w-[65ch] text-left">
                Ser la comunidad educativa referente en el nordeste argentino en innovación pedagógica, liderazgo ético e inclusión real, reconocida por la calidad humana de sus egresados, la excelencia de sus educadores y su capacidad constante para anticipar el futuro.
              </p>
            </div>
          </div>

          {/* HERÁLDICA Y SIMBOLOGÍA DEL ESCUDO OFICIAL */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#CFB07A] shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#8F1F17] font-mono">
                  Identidad Visual y Blasón
                </span>
                <h3 className="text-[1.125rem] font-bold text-slate-900 mt-0.5 leading-[1.3] text-left">
                  El Escudo Oficial y el Lema "Verita Vinci"
                </h3>
                <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
                  Conoce la historia y el significado de los colores y figuras que presiden nuestra institución.
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-[#CFB07A]/20 border border-[#CFB07A] text-[#634816] font-serif-title text-xs font-bold uppercase tracking-[0.06em]">
                Verita Vinci • La Verdad Triunfa
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Escudo visual */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src="/assets/aistudio/escudo_colegio_informatico.png"
                  alt="Escudo Oficial del Colegio Informático - Verita Vinci"
                  className="w-48 h-auto object-contain drop-shadow-xl"
                />
                <span className="mt-3 text-xs font-serif-title font-bold text-slate-700 tracking-wider">
                  Blasón Colegio Informático
                </span>
                <span className="text-[11px] text-[#01913F] font-semibold">
                  Comunidad Educativa Educar
                </span>
              </div>

              {/* Componentes heráldicos */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-red-50/70 border-l-4 border-[#DE4034] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#DE4034]" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Rojo Carmesí (#DE4034)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Simboliza la pasión por educar, la energía formadora, el coraje frente a los desafíos y la calidez del vínculo humano.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border-l-4 border-[#01913F] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#01913F]" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Verde Esmeralda (#01913F)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Representa la esperanza, la innovación pedagógica constante, el florecimiento del potencial de cada alumno y la vitalidad del futuro.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border-l-4 border-[#CFB07A] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#CFB07A]" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Arena Dorada / Ocre (#CFB07A)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Refleja la nobleza, la solidez ética y la sabiduría como cimiento inquebrantable de la trayectoria de Educar SRL.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 border-l-4 border-[#22201B] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#22201B]" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Águila, Blasón Central & Saetas
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    El águila coronada evoca la mirada elevada y la custodia del saber. El blasón con piezas de vero y saetas manifiesta la disciplina y puntería hacia la excelencia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VALORES INSTITUCIONALES */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#00602A] font-mono">
                Pilares Formativos
              </span>
              <h3 className="text-[1.125rem] font-bold text-slate-900 mt-0.5 leading-[1.3] text-left">
                Valores Institucionales del Colegio Informático
              </h3>
              <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
                Principios rectores que guían nuestra labor diaria con los estudiantes y las familias.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {valores.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#CFB07A] transition space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {v.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-[1.35] text-left">
                    {v.title}
                  </h4>
                  <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HIMNO INSTITUCIONAL DEL COLEGIO INFORMÁTICO */}
          <HimnoPlayer audioSrc="/assets/himno Colegio.mpeg" />
        </div>
      )}

      {/* TAB DEDICADO: HIMNO INSTITUCIONAL */}
      {activeTab === 'himno' && (
        <div className="space-y-6">
          <HimnoPlayer audioSrc="/assets/himno Colegio.mpeg" />
        </div>
      )}

      {/* TAB: VIDEOS INSTITUCIONALES */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveVideo('video1')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeVideo === 'video1'
                  ? 'bg-[#7A1C1C] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video 01: Identidad y Trayectoria</span>
            </button>

            <button
              onClick={() => setActiveVideo('video2')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeVideo === 'video2'
                  ? 'bg-[#7A1C1C] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video 02: Cultura y Espíritu Educar</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {activeVideo === 'video1' 
                    ? 'Video 01: Orígenes y Filosofía Educativa' 
                    : 'Video 02: Nuestra Esencia y Trabajo Colaborativo'}
                </h3>
                <p className="text-xs text-slate-500">
                  Enlace Drive oficial embebido directamente en la aplicación.
                </p>
              </div>

              <a
                href={
                  activeVideo === 'video1'
                    ? 'https://drive.google.com/file/d/1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v/view'
                    : 'https://drive.google.com/file/d/1kVF14POeW7uLBeF6wV3DTkp55x83Prom/view'
                }
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#7A1C1C] hover:text-[#5A1212] flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg border border-red-100 transition"
              >
                <span>Ver directo en Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
              <iframe
                src={
                  activeVideo === 'video1'
                    ? 'https://drive.google.com/file/d/1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v/preview'
                    : 'https://drive.google.com/file/d/1kVF14POeW7uLBeF6wV3DTkp55x83Prom/preview'
                }
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                title="Video Institucional Colegio Informático"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#008751] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Nota para nuevos colaboradores: </span>
                Este video resume los momentos cumbres y testimonios de directivos, docentes y alumnos de Educar SRL. Te recomendamos tomarte unos minutos para reflexionar sobre tu impacto en esta comunidad.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HITOS & LÍNEA DE TIEMPO */}
      {activeTab === 'historia' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Trayectoria y Fechas Importantes del Colegio Informático
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Más de dos décadas formando generaciones de correntinos con visión tecnológica y humana.
            </p>
          </div>

          <div className="relative border-l-2 border-[#D4B26F] ml-3 sm:ml-4 space-y-8 pl-6 sm:pl-8 py-2">
            {hitos.map((h, i) => (
              <div key={i} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-[#7A1C1C] border-4 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                  {i + 1}
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#008751]/10 text-[#008751] font-mono text-xs font-bold">
                    {h.year}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {h.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Checkpoint de la Misión */}
      <MissionCheckpointFooter
        missionCode="Misión 01"
        missionTitle="Identidad Institucional"
        nextMissionTitle="Misión 02: Esencia en Acción"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onNavigateNext={onNavigateNext}
      />
    </div>
  );
};
