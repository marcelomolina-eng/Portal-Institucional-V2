import React from 'react';
import { MissionId, AppConfig, NoticeItem } from '../types';
import { 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Award, 
  ArrowRight, 
  Play, 
  ExternalLink, 
  BellRing, 
  CheckCircle,
  BookOpen,
  CalendarDays,
  Lock
} from 'lucide-react';

interface HomeMissionProps {
  config: AppConfig;
  onNavigate: (mission: MissionId) => void;
  notices: NoticeItem[];
  completedMissions: Record<string, boolean>;
  completedCount?: number;
  totalRequired?: number;
  progressPercent?: number;
  isDiplomaUnlocked?: boolean;
  nextPendingMissionTitle?: string;
}

export const HomeMission: React.FC<HomeMissionProps> = ({
  config,
  onNavigate,
  notices,
  completedMissions,
  completedCount = 0,
  totalRequired = 3,
  progressPercent = 0,
  isDiplomaUnlocked = false,
  nextPendingMissionTitle = 'Misión 01: Identidad'
}) => {
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);

  const missions = [
    {
      id: 'mision1' as MissionId,
      code: 'MISIÓN 01',
      title: 'Descubrir quiénes somos',
      subtitle: 'El comienzo de nuestra historia',
      desc: 'Todo lo que somos tiene un origen. Descubrí cómo nació el Colegio Informático y los valores que nos unen. Hoy, vos también comenzás a ser parte de esta historia.',
      icon: <ShieldCheck className="w-6 h-6 text-[#7A1C1C]" />,
      badge: 'Historia & Pilares',
      bgGrad: 'from-amber-50 to-orange-50 border-amber-200'
    },
    {
      id: 'mision2' as MissionId,
      code: 'MISIÓN 02',
      title: 'Explorar nuestra esencia',
      subtitle: 'Nuestra Esencia en Acción',
      desc: 'Adéntrate en las iniciativas vivas: Wellness, Copa Informática, Expo Proyecto, Robótica, IA, Bilingüe y el Calendario Anual 2026.',
      icon: <Sparkles className="w-6 h-6 text-[#008751]" />,
      badge: '8 Iniciativas & Calendario',
      bgGrad: 'from-emerald-50 to-teal-50 border-emerald-200'
    },
    {
      id: 'mision3' as MissionId,
      code: 'MISIÓN 03',
      title: 'Conocer nuestra comunidad',
      subtitle: 'Nuestra Comunidad Educativa',
      desc: 'Descubre el organigrama estructural, conecta con los referentes institucionales y familiarízate con los canales oficiales de comunicación.',
      icon: <Users className="w-6 h-6 text-[#1E3A8A]" />,
      badge: 'Organigrama & Contactos',
      bgGrad: 'from-blue-50 to-indigo-50 border-blue-200'
    },
    {
      id: 'mision4' as MissionId,
      code: 'MISIÓN 04',
      title: 'Ser parte y construir juntos',
      subtitle: 'Mi Rol en Educar',
      desc: 'Pautas de convivencia, puntualidad, uniforme, cuidado de espacios, capacitaciones continuas y la cultura del trabajo colaborativo.',
      icon: <Compass className="w-6 h-6 text-[#EA580C]" />,
      badge: 'Compromiso & Pautas',
      bgGrad: 'from-rose-50 to-orange-50 border-rose-200'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HERO BANNER PRINCIPAL */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1A17] via-[#2A1513] to-[#12231A] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border-2 border-[#CFB07A]">
        {/* Subtle decorative heraldic ambient glows */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#DE4034]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#01913F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#CFB07A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">

            {/* Frase de Bienvenida Protagonista - H1: 32px (2rem), line-height 1.25, max-w-[65ch] */}
            <h1 className="text-[2rem] font-bold tracking-tight leading-[1.25] text-white text-left">
              ¡Bienvenido al <span className="text-[#DE4034]">Colegio</span> <span className="text-[#01913F]">Informático</span>!
            </h1>
            
            <div className="space-y-3.5 max-w-[65ch] text-left">
              <p className="text-base text-slate-100 font-normal leading-[1.5] whitespace-pre-wrap">
                Nos alegra que hoy comiences a formar parte de nuestra comunidad. Bajo nuestro lema <strong className="text-[#CFB07A] font-serif-title font-bold">VERITA VINCI</strong> (La verdad triunfa), nos une una misma misión: educar con calidad, rigor y vanguardia tecnológica.
              </p>
              <p className="text-base text-slate-100 font-normal leading-[1.5] whitespace-pre-wrap">
                Cada persona que se suma aporta algo único. Por eso, queremos invitarte a conocer nuestra historia, descubrir nuestra cultura, explorar nuestros proyectos y todo aquello que nos identifica.
              </p>
            </div>

            {/* Presentación del Programa: OPERACIÓN INFORMÁTICO */}
            <div className="p-5 rounded-2xl bg-black/40 border border-[#CFB07A]/40 backdrop-blur-sm max-w-[65ch] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#CFB07A] font-mono">
                  OPERACIÓN INFORMÁTICO
                </span>
                <span className="text-[11px] bg-[#01913F] px-2 py-0.5 rounded text-white font-mono font-bold tracking-normal">
                  2026
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-white text-left">
                Una misión: descubrir todo lo que nos une.
              </div>
              <p className="text-sm text-[#F7F3EA] leading-[1.5] text-left whitespace-pre-wrap">
                A través de este recorrido, vas a encontrar diferentes misiones que te permitirán acercarte a nuestra institución y conocer a las personas que hacen posible esta comunidad.
              </p>
              <p className="text-sm font-semibold text-[#CFB07A] pt-1 text-left whitespace-pre-wrap">
                ¡Nos alegra compartir este comienzo con vos!
              </p>
            </div>

            {/* Botones de Acción Principal */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('mision1')}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#01913F] to-[#00602A] hover:from-[#00a848] hover:to-[#01913F] text-white font-bold text-base shadow-xl shadow-emerald-950/40 border border-emerald-400/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>INICIAR OPERACIÓN</span>
                <ArrowRight className="w-5 h-5 text-[#CFB07A]" />
              </button>

              <button
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition"
              >
                <Play className="w-4 h-4 text-[#CFB07A] fill-current" />
                <span>Ver Video Institucional</span>
              </button>

              <button
                onClick={() => onNavigate('misionCumplida')}
                className={`inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm border transition ${
                  isDiplomaUnlocked
                    ? 'bg-[#01913F]/30 hover:bg-[#01913F]/50 text-[#F7F3EA] border-[#01913F]/60'
                    : 'bg-black/40 hover:bg-black/60 text-[#CFB07A] border-[#CFB07A]/50'
                }`}
              >
                {isDiplomaUnlocked ? (
                  <Award className="w-4 h-4 text-[#CFB07A]" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
                <span>{isDiplomaUnlocked ? 'Certificación' : 'Certificación (Bloqueada)'}</span>
              </button>
            </div>
          </div>

          {/* Escudo Institucional Oficial en el Hero */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#DE4034] via-[#CFB07A] to-[#01913F] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-[#1C1A17]/80 border-2 border-[#CFB07A] p-6 rounded-3xl shadow-2xl backdrop-blur-sm flex flex-col items-center text-center">
                <img
                  src="/assets/aistudio/escudo_colegio_informatico.png"
                  alt="Escudo Oficial Colegio Informático - Verita Vinci"
                  className="w-40 sm:w-48 h-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="mt-3 pt-3 border-t border-[#CFB07A]/40 w-full">
                  <span className="font-serif-title text-sm font-bold text-[#CFB07A] tracking-widest block uppercase">
                    Verita Vinci
                  </span>
                  <span className="text-[10px] text-slate-300 tracking-wider uppercase font-semibold">
                    Escudo Institucional Oficial
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVEDADES & AVISOS RÁPIDOS */}
      {notices && notices.length > 0 && (
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <BellRing className="w-4 h-4 text-[#7A1C1C]" />
              <span>Avisos de RRHH y Novedades del Ingreso</span>
            </div>
            <span className="text-xs text-slate-500">{notices.length} avisos activos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {notices.slice(0, 3).map((n) => (
              <div 
                key={n.id} 
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#D4B26F] transition text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500 text-[11px]">{n.date}</span>
                  {n.pinned && (
                    <span className="bg-[#7A1C1C]/10 text-[#7A1C1C] px-1.5 py-0.5 rounded font-bold text-[10px]">
                      Destacado
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{n.title}</h4>
                <p className="text-slate-600 line-clamp-2 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                <div className="pt-1 text-[11px] font-medium text-slate-500">
                  Por: <span className="text-slate-700 font-semibold">{n.author}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAPA DE LAS 4 MISIONES DEL ONBOARDING */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[1.5rem] font-bold leading-[1.25] text-slate-900 flex items-center gap-2 text-left">
              <span>El Mapa de tu Misión</span>
              <span className="text-xs font-bold bg-[#DE4034] text-white px-2.5 py-0.5 rounded-md uppercase tracking-[0.06em]">
                Paso a Paso
              </span>
            </h2>
            <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left mt-0.5">
              Explora cada capítulo para desbloquear tu Certificado Oficial de Incorporación 2026.
            </p>
          </div>

          {/* Indicador Visual de Progreso Solicitado */}
          <div className="flex items-center gap-2.5 bg-slate-100/90 px-3.5 py-1.5 rounded-2xl border border-slate-200 text-xs shadow-xs self-start sm:self-auto">
            <span className="font-bold text-slate-800">
              Progreso: {completedCount}/{totalRequired} misiones completadas
            </span>
            <div className="w-16 bg-slate-300 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#DE4034] via-[#CFB07A] to-[#01913F] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">{progressPercent}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {missions.map((m) => {
            const isCompleted = completedMissions[m.id];
            return (
              <div
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between bg-gradient-to-b ${m.bgGrad}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#8F1F17] tracking-[0.06em] uppercase font-mono">
                      {m.code}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#00602A] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5" /> Completada
                      </span>
                    ) : (
                      <span className="text-xs bg-white/90 border border-slate-300 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {m.icon}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-[1.125rem] leading-[1.3] text-left">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#00602A] font-bold mt-0.5 text-left">
                      {m.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-700 leading-[1.5] max-w-[65ch] text-left whitespace-pre-wrap">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between text-xs font-bold text-[#8F1F17] uppercase tracking-[0.06em]">
                  <span>Ingresar a la Misión</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALLOUT: CERTIFICACIÓN FINAL */}
      <section className={`rounded-3xl p-6 sm:p-7 border-2 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 ${
        isDiplomaUnlocked
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-300'
          : 'bg-gradient-to-r from-amber-50 via-amber-100/60 to-yellow-50 border-[#D4B26F]'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
            isDiplomaUnlocked
              ? 'bg-[#01913F] text-white'
              : 'bg-[#1C1A17] text-[#CFB07A] border border-[#CFB07A]/40'
          }`}>
            {isDiplomaUnlocked ? <Award className="w-8 h-8" /> : <Lock className="w-7 h-7 text-amber-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full ${
                isDiplomaUnlocked
                  ? 'bg-emerald-200 text-emerald-950 font-extrabold'
                  : 'bg-amber-200/80 text-amber-900 font-extrabold'
              }`}>
                {isDiplomaUnlocked ? '¡Meta Desbloqueada!' : 'Meta Final (Bloqueada)'}
              </span>
              <h3 className="text-[1.125rem] font-bold text-slate-900 leading-[1.3] text-left">
                Certificación y Diploma Oficial 2026
              </h3>
            </div>
            <p className="text-sm text-slate-700 mt-1 max-w-[65ch] leading-[1.5] text-left">
              {isDiplomaUnlocked
                ? '¡Felicitaciones! Has completado el recorrido formativo. Ya puedes generar y descargar tu diploma oficial registrado.'
                : '¡Casi llegas! Completa las misiones 01, 02 y 03 para desbloquear tu Certificado Institucional con folio criptográfico único.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('misionCumplida')}
          className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 ${
            isDiplomaUnlocked
              ? 'bg-[#01913F] hover:bg-[#007031] text-white'
              : 'bg-[#1C1A17] hover:bg-[#2A1513] text-[#CFB07A] border border-[#CFB07A]/40'
          }`}
        >
          {isDiplomaUnlocked ? (
            <>
              <span>Obtener mi Diploma</span>
              <Award className="w-4 h-4 text-[#CFB07A]" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Ver Estado de Certificación</span>
            </>
          )}
        </button>
      </section>

      {/* MODAL DE VIDEO INSTITUCIONAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-[#D4B26F] rounded-2xl max-w-3xl w-full p-4 sm:p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#D4B26F]">Video Institucional • Colegio Informático</h3>
                <p className="text-xs text-slate-400">Enlace Drive Oficial: 1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v</p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Google Drive Video Player Embed */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src="https://drive.google.com/file/d/1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v/preview"
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                title="Video Institucional Colegio Informático"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Si tu navegador bloquea la reproducción de Drive de terceros:</span>
              <a
                href="https://drive.google.com/file/d/1prC6Yt93uob8epZnwXI_6DUzyeYEBh-v/view"
                target="_blank"
                rel="noreferrer"
                className="text-[#D4B26F] hover:underline flex items-center gap-1 font-semibold"
              >
                Abrir en Google Drive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
