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
  CalendarDays
} from 'lucide-react';

interface HomeMissionProps {
  config: AppConfig;
  onNavigate: (mission: MissionId) => void;
  notices: NoticeItem[];
  completedMissions: Record<string, boolean>;
}

export const HomeMission: React.FC<HomeMissionProps> = ({
  config,
  onNavigate,
  notices,
  completedMissions
}) => {
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);

  const missions = [
    {
      id: 'mision1' as MissionId,
      code: 'MISIÓN 01',
      title: 'Descubrir quiénes somos',
      subtitle: 'Nuestra Identidad Institucional',
      desc: 'Conoce los orígenes del Colegio Informático, nuestra filosofía educativa, misión, visión y los valores que forjan nuestro día a día.',
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

            {/* Frase de Bienvenida Protagonista */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              ¡Bienvenido al <span className="text-[#DE4034]">Colegio</span> <span className="text-[#01913F]">Informático</span>!
            </h1>
            
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
              Nos alegra que hoy comiences a ser parte de nuestra comunidad. Bajo nuestro lema <strong className="text-[#CFB07A] font-serif-title font-bold">"VERITA VINCI"</strong> (La verdad triunfa), cada paso que des aquí sumará a la misión colectiva de educar con calidez, rigor y vanguardia tecnológica.
            </p>

            {/* Presentación del Programa */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-[#CFB07A]/40 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-[#CFB07A] mb-1">
                Nombre Clave de la Misión
              </div>
              <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Operación Informático</span>
                <span className="text-xs bg-[#01913F] px-2 py-0.5 rounded text-white font-mono">2026</span>
              </div>
              <p className="text-sm text-[#F7F3EA] mt-1 italic">
                "Una misión: descubrir todo lo que nos une."
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
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#DE4034]/20 hover:bg-[#DE4034]/40 text-[#F7F3EA] font-medium text-sm border border-[#DE4034]/50 transition"
              >
                <Award className="w-4 h-4 text-[#CFB07A]" />
                <span>Certificación</span>
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
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{n.content}</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>El Mapa de tu Misión</span>
              <span className="text-xs font-semibold bg-[#7A1C1C] text-white px-2 py-0.5 rounded-md">
                Paso a Paso
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Explora cada capítulo para desbloquear tu Certificado Oficial de Incorporación 2026.
            </p>
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
                    <span className="text-xs font-extrabold text-[#7A1C1C] tracking-wider uppercase font-mono">
                      {m.code}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Completada
                      </span>
                    ) : (
                      <span className="text-[10px] bg-white/80 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {m.icon}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#008751] font-semibold mt-0.5">
                      {m.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between text-xs font-bold text-[#7A1C1C]">
                  <span>Ingresar a la Misión</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALLOUT: CERTIFICACIÓN FINAL */}
      <section className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-yellow-50 rounded-2xl p-6 border-2 border-[#D4B26F] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#7A1C1C] text-[#D4B26F] flex items-center justify-center flex-shrink-0 shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase bg-[#D4B26F] text-[#5A1212] px-2 py-0.5 rounded">
                Meta Final
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Certificación y Diploma Oficial 2026
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Al concluir tu recorrido por las 4 misiones, podrás generar tu diploma oficial, registrado automáticamente en Google Sheets y listo para descargar o imprimir.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('misionCumplida')}
          className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#7A1C1C] hover:bg-[#5A1212] text-white font-bold text-sm shadow-md transition flex items-center gap-2"
        >
          <span>Ir a Certificación</span>
          <ArrowRight className="w-4 h-4 text-[#D4B26F]" />
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
