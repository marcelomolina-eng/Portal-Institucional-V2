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
  Music,
  Scale,
  HeartHandshake,
  Users,
  Shield,
  Globe,
  Share2,
  Mountain,
  Smile,
  BadgeCheck,
  Compass,
  Shuffle,
  Trees,
  Rocket,
  Quote
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
      title: 'Ética',
      desc: 'Principio rector de todas nuestras acciones, decisiones y relaciones en la comunidad educativa.',
      icon: <Scale className="w-5 h-5 text-[#DE4034]" />
    },
    {
      title: 'Respeto',
      desc: 'Reconocimiento de la dignidad, la diversidad y el valor inherente de cada persona.',
      icon: <HeartHandshake className="w-5 h-5 text-[#00875A]" />
    },
    {
      title: 'Inclusión',
      desc: 'Espacio abierto y acogedor donde cada estudiante y familia encuentra contención y oportunidades.',
      icon: <Users className="w-5 h-5 text-[#1E3A8A]" />
    },
    {
      title: 'Justicia',
      desc: 'Equidad, rectitud y trato imparcial en cada proceso pedagógico y de convivencia escolar.',
      icon: <Scale className="w-5 h-5 text-[#CFB07A]" />
    },
    {
      title: 'Responsabilidad',
      desc: 'Conciencia del deber cumplido, el compromiso colectivo y el cuidado atento de los demás.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
    },
    {
      title: 'Honestidad',
      desc: 'Coherencia, sinceridad y transparencia entre lo que pensamos, decimos y realizamos.',
      icon: <Shield className="w-5 h-5 text-[#DE4034]" />
    },
    {
      title: 'Innovación',
      desc: 'Vanguardia pedagógica y tecnológica con propósito humano para transformar el aprendizaje.',
      icon: <Lightbulb className="w-5 h-5 text-[#EAB308]" />
    },
    {
      title: 'Compromiso Social',
      desc: 'Formación de líderes con vocación solidaria, capaces de generar un impacto positivo duradero.',
      icon: <Globe className="w-5 h-5 text-[#1E3A8A]" />
    },
    {
      title: 'Solidaridad',
      desc: 'Sensibilidad activa y empatía para brindar apoyo mutuo, acompañar y construir juntos.',
      icon: <Heart className="w-5 h-5 text-[#DE4034]" />
    },
    {
      title: 'Cooperación',
      desc: 'Trabajo en equipo, diálogo constructivo y sinergia para alcanzar metas compartidas.',
      icon: <Share2 className="w-5 h-5 text-[#00875A]" />
    },
    {
      title: 'Perseverancia',
      desc: 'Constancia, esfuerzo y resiliencia para superar obstáculos y alcanzar el máximo potencial.',
      icon: <Mountain className="w-5 h-5 text-[#B45309]" />
    },
    {
      title: 'Humildad',
      desc: 'Capacidad de escuchar, aprender de las experiencias y valorar sinceramente el aporte del otro.',
      icon: <Smile className="w-5 h-5 text-[#00875A]" />
    },
    {
      title: 'Identidad',
      desc: 'Orgullo por nuestras raíces, la historia institucional y nuestro lema Verita Vinci.',
      icon: <BadgeCheck className="w-5 h-5 text-[#CFB07A]" />
    },
    {
      title: 'Pertenencia',
      desc: 'Vínculo afectivo y orgullo de formar parte de la gran familia del Colegio Informático y Educar SRL.',
      icon: <Sparkles className="w-5 h-5 text-[#00875A]" />
    },
    {
      title: 'Autonomía',
      desc: 'Estímulo al pensamiento crítico, la iniciativa propia y la toma de decisiones con libertad.',
      icon: <Compass className="w-5 h-5 text-[#1E3A8A]" />
    },
    {
      title: 'Flexibilidad',
      desc: 'Capacidad de adaptación activa y constructiva frente a los desafíos dinámicos de un mundo global.',
      icon: <Shuffle className="w-5 h-5 text-[#7C3AED]" />
    },
    {
      title: 'Medio Ambiente',
      desc: 'Conciencia ecológica, respeto por la naturaleza y cuidado sustentable de nuestra casa común.',
      icon: <Trees className="w-5 h-5 text-[#00875A]" />
    },
    {
      title: 'Trascendencia',
      desc: 'Huella formativa y legado ético que perdura en el tiempo y mejora la sociedad del NEA.',
      icon: <Rocket className="w-5 h-5 text-[#DE4034]" />
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
              <div className="space-y-1 max-w-[65ch] text-left">
                <p className="text-base font-bold text-[#CFB07A]">
                  El comienzo de nuestra historia
                </p>
                <p className="text-base text-slate-100 leading-[1.5] whitespace-pre-wrap">
                  Todo lo que somos tiene un origen. Descubrí cómo nació el Colegio Informático y los valores que nos unen. Hoy, vos también comenzás a ser parte de esta historia.
                </p>
              </div>
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

      {/* Sub-menú de Navegación interna: Botones estilo Pills Institucionales */}
      <div className="bg-[#F4F5F7] p-2 rounded-2xl border border-slate-200/90 shadow-inner flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('filosofia')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'filosofia'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'filosofia' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Misión, Visión y Escudo</span>
        </button>

        <button
          onClick={() => setActiveTab('himno')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'himno'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Music className={`w-4 h-4 ${activeTab === 'himno' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Himno Institucional</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <Video className={`w-4 h-4 ${activeTab === 'videos' ? 'text-white' : 'text-[#00875A]'}`} />
          <span>Videos Institucionales</span>
        </button>

        <button
          onClick={() => setActiveTab('historia')}
          className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap transition-all rounded-xl cursor-pointer ${
            activeTab === 'historia'
              ? 'bg-[#00875A] hover:bg-[#007031] text-white font-bold shadow-md shadow-emerald-950/25 border border-emerald-600 scale-[1.02]'
              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
          }`}
        >
          <History className={`w-4 h-4 ${activeTab === 'historia' ? 'text-white' : 'text-[#00875A]'}`} />
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
              <p className="text-base text-slate-700 leading-[1.5] max-w-[65ch] text-left whitespace-pre-wrap">
                Desarrollar el máximo potencial de nuestros estudiantes, desde el nivel inicial hasta su graduación, a través de una educación integral, innovadora e inclusiva que combina la excelencia académica con la educación emocional y el desarrollo de valores, para formar líderes capaces de generar un impacto positivo y duradero en la sociedad. Siendo un espacio de encuentro, contención y crecimiento.
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
              <p className="text-base text-slate-700 leading-[1.5] max-w-[65ch] text-left whitespace-pre-wrap">
                Ser la empresa educativa líder y el principal referente en la innovación y calidad humana del Nordeste Argentino (NEA), reconocida por ofrecer una trayectoria formativa integral y de vanguardia que prepara a los estudiantes para un mundo global, generando un impacto positivo que mejora la calidad de vida de la sociedad y de la comunidad.
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

          {/* VALORES INSTITUCIONALES (18 VALORES) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#00875A] font-mono">
                  Pilares Formativos
                </span>
                <h3 className="text-[1.125rem] font-bold text-slate-900 mt-0.5 leading-[1.3] text-left">
                  18 Valores Institucionales de Nuestra Comunidad
                </h3>
                <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
                  Principios rectores que guían nuestra labor diaria con los estudiantes, las familias y el equipo educador.
                </p>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-50 text-[#00875A] border border-emerald-200 text-xs font-bold shrink-0">
                18 Principios Rectores
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {valores.map((v, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-[#CFB07A] hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                      {v.icon}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-[1.3] text-left">
                      {v.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed text-left mt-1">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FRASE DESTACADA FINAL */}
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#1C1A17] via-[#2A1513] to-[#12231A] text-white border-2 border-[#CFB07A] shadow-xl relative overflow-hidden text-center space-y-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-[#CFB07A]/20 text-[#CFB07A] flex items-center justify-center mx-auto border border-[#CFB07A]/40">
                <Quote className="w-5 h-5 fill-current" />
              </div>
              <blockquote className="text-base sm:text-xl font-serif-title font-bold text-white max-w-[55ch] mx-auto leading-relaxed">
                "Somos más que una institución educativa. Somos el lugar donde el futuro del NEA comienza a escribirse."
              </blockquote>
              <p className="text-xs sm:text-sm font-bold text-[#CFB07A] uppercase tracking-wider font-mono">
                — Socios Fundadores, EDUCAR SRL
              </p>
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
