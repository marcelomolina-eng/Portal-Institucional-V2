import React from 'react';
import { Authority, OrganigramLevel } from '../types';
import { 
  Users, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  MessageSquare, 
  BookOpen, 
  Send, 
  Briefcase, 
  Layers, 
  Compass, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  UserCheck
} from 'lucide-react';

interface Mission3CommunityProps {
  authorities: Authority[];
  organigramLevels: OrganigramLevel[];
  onComplete: () => void;
  onNavigateNext: () => void;
  isCompleted: boolean;
}

export const Mission3Community: React.FC<Mission3CommunityProps> = ({
  authorities,
  organigramLevels,
  onComplete,
  onNavigateNext,
  isCompleted
}) => {
  const [selectedAuthority, setSelectedAuthority] = React.useState<Authority | null>(null);
  const [activeTab, setActiveTab] = React.useState<'autoridades' | 'organigrama' | 'canales'>('autoridades');

  const communicationChannels = [
    {
      title: 'Correo Electrónico Corporativo',
      account: '@educarsrl.com.ar',
      desc: 'Canal oficial primordial para comunicaciones formales, avisos académicos, licencias, envío de planificaciones y circulares institucionales.',
      guidelines: 'Revisar al inicio y fin de la jornada. Usar firma institucional reglamentaria provista por Sistemas.',
      icon: <Mail className="w-6 h-6 text-[#7A1C1C]" />,
      badge: 'Formal & Legal'
    },
    {
      title: 'Plataforma Interna / Intranet Escolar',
      account: 'Gestión Académica & Calificaciones',
      desc: 'Sistema digital para carga de notas, asistencias, legajos de estudiantes, libros de temas y seguimiento de trayectorias.',
      guidelines: 'Mantener las cargas al día. No compartir claves de acceso con terceros.',
      icon: <Layers className="w-6 h-6 text-[#008751]" />,
      badge: 'Académico'
    },
    {
      title: 'Grupos de WhatsApp Institucionales',
      account: 'Avisos Inmediatos & Operativos',
      desc: 'Canal ágil para notificaciones de último momento, cambios edilicios o emergencias operativas.',
      guidelines: 'Horario de uso respetuoso (07:30 a 19:30 hs en días hábiles). Solo contenido estrictamente laboral.',
      icon: <MessageSquare className="w-6 h-6 text-[#25D366]" />,
      badge: 'Urgente'
    },
    {
      title: 'Mesas de Trabajo & Ateneos',
      account: 'Reuniones de Nivel & Departamento',
      desc: 'Espacio presencial y sincrónico para la toma de decisiones pedagógicas, diseño de proyectos ABP y evaluación.',
      guidelines: 'Se realizan semanalmente o por quincena coordinadas por los directivos de cada nivel.',
      icon: <Users className="w-6 h-6 text-[#1E3A8A]" />,
      badge: 'Colaborativo'
    },
    {
      title: 'Libro de Circulares & Actas Digitales',
      account: 'Registro Normativo Institucional',
      desc: 'Documento donde se asientan resoluciones, reglamentos internos y notificaciones de cumplimiento obligatorio.',
      guidelines: 'Requiere acuse de recibo y firma digital o física por parte de cada colaborador.',
      icon: <BookOpen className="w-6 h-6 text-[#D4B26F]" />,
      badge: 'Normativo'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header de la Misión */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1e40af] to-[#172554] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4B26F]/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4B26F]/20 text-[#D4B26F] text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" /> MISIÓN 03: OPERACIÓN INFORMÁTICO
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Conocer Nuestra Comunidad
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              Te presentamos a las autoridades, el organigrama y los canales oficiales para estar siempre comunicado.
            </p>
          </div>

          <button
            onClick={() => {
              onComplete();
              onNavigateNext();
            }}
            className={`self-start md:self-center px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
              isCompleted
                ? 'bg-[#008751] text-white border border-emerald-400'
                : 'bg-[#D4B26F] text-[#5A1212] hover:bg-[#e4c485]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Misión Completada • Continuar' : 'Completar y Pasar a Misión 04'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('autoridades')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'autoridades'
              ? 'border-[#1E3A8A] text-[#1E3A8A] bg-blue-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Autoridades y Referentes</span>
        </button>

        <button
          onClick={() => setActiveTab('organigrama')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'organigrama'
              ? 'border-[#1E3A8A] text-[#1E3A8A] bg-blue-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Organigrama Institucional</span>
        </button>

        <button
          onClick={() => setActiveTab('canales')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'canales'
              ? 'border-[#1E3A8A] text-[#1E3A8A] bg-blue-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Canales de Comunicación Interna</span>
        </button>
      </div>

      {/* TAB 1: AUTORIDADES Y REFERENTES */}
      {activeTab === 'autoridades' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Equipo de Conducción y Referentes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Ponte en contacto con cada uno para evacuar dudas o coordinar acciones.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {authorities.length} Referentes Clave
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {authorities.map((auth) => (
              <div
                key={auth.id}
                onClick={() => setSelectedAuthority(auth)}
                className="cursor-pointer group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#1E3A8A] hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={auth.photoUrl}
                      alt={auth.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4B26F] shadow-sm group-hover:scale-105 transition"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#1E3A8A] transition">
                        {auth.name}
                      </h3>
                      <p className="text-xs text-[#008751] font-semibold">
                        {auth.role}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {auth.area}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {auth.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 text-[11px] truncate max-w-[170px]">
                    {auth.email}
                  </span>
                  <span className="text-[#1E3A8A] font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                    Ver Perfil <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIGRAMA INSTITUCIONAL DINÁMICO */}
      {activeTab === 'organigrama' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Estructura Organizacional Institucional
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visualiza los niveles jerárquicos de decisión, conducción y acompañamiento de la comunidad escolar.
              </p>
            </div>
            <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#CFB07A]/15 text-[#8F6A24] border border-[#CFB07A]/40">
              {organigramLevels.length} Niveles Jerárquicos
            </span>
          </div>

          {(!organigramLevels || organigramLevels.length === 0) ? (
            <div className="text-center py-12 text-slate-400">
              <Building className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#DE4034]" />
              <p className="text-sm font-semibold">No se han configurado niveles en el organigrama todavía.</p>
              <p className="text-xs text-slate-400 mt-1">El Administrador puede definir la estructura desde el panel de control.</p>
            </div>
          ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
              {organigramLevels
                .slice()
                .sort((a, b) => a.levelNumber - b.levelNumber)
                .map((level, levelIdx, arr) => (
                  <div key={level.id} className="relative">
                    {/* Tarjeta del Nivel */}
                    <div className="bg-slate-50/70 rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: level.color || '#DE4034' }}
                          />
                          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white font-mono"
                            style={{ backgroundColor: level.color || '#DE4034' }}
                          >
                            {level.badge || `NIVEL ${level.levelNumber}`}
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                            {level.levelName}
                          </h3>
                        </div>
                        {level.description && (
                          <span className="text-xs text-slate-500 italic hidden md:inline">
                            {level.description}
                          </span>
                        )}
                      </div>

                      {/* Nodos / Áreas del Nivel */}
                      <div className={`grid gap-4 ${
                        level.nodes.length === 1 
                          ? 'grid-cols-1 max-w-xl mx-auto' 
                          : level.nodes.length === 2 
                            ? 'grid-cols-1 md:grid-cols-2' 
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      }`}>
                        {level.nodes.map((node) => (
                          <div
                            key={node.id}
                            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            style={{ borderTop: `4px solid ${node.colorTheme || level.color || '#DE4034'}` }}
                          >
                            <div className="space-y-1.5">
                              <span 
                                className="text-[10px] font-bold uppercase tracking-wider block"
                                style={{ color: node.colorTheme || level.color || '#DE4034' }}
                              >
                                {node.subtitle || 'Área Institucional'}
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                                {node.title}
                              </h4>
                              {node.description && (
                                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                                  {node.description}
                                </p>
                              )}
                            </div>

                            {/* Personas / Responsables asignados */}
                            {node.responsibles && node.responsibles.length > 0 && (
                              <div className="pt-3 border-t border-slate-100 space-y-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                  Responsable(s) a cargo:
                                </span>
                                <div className="space-y-2">
                                  {node.responsibles.map((member) => (
                                    <div 
                                      key={member.id || member.name} 
                                      className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100"
                                    >
                                      {member.photoUrl ? (
                                        <img 
                                          src={member.photoUrl} 
                                          alt={member.name}
                                          className="w-10 h-10 rounded-full object-cover border border-[#CFB07A] shadow-xs shrink-0"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                          {member.name.charAt(0)}
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                          {member.name}
                                        </p>
                                        <p className="text-[11px] text-[#01913F] font-medium truncate">
                                          {member.role}
                                        </p>
                                        {member.email && (
                                          <p className="text-[10px] text-slate-400 font-mono truncate">
                                            {member.email}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conector vertical hacia el siguiente nivel */}
                    {levelIdx < arr.length - 1 && (
                      <div className="flex flex-col items-center justify-center my-2">
                        <div className="w-0.5 h-6 bg-slate-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#CFB07A] border-2 border-white shadow-xs" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CANALES DE COMUNICACIÓN INTERNA */}
      {activeTab === 'canales' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Protocolo de Canales de Comunicación Interna
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Conocer por dónde canalizar cada necesidad garantiza una convivencia eficiente y profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationChannels.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                      <span className="text-xs text-slate-500 font-mono">{c.account}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {c.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.desc}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                  <span className="font-bold text-slate-800">Regla clave: </span>
                  {c.guidelines}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE AUTORIDAD */}
      {selectedAuthority && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#D4B26F]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedAuthority.photoUrl}
                  alt={selectedAuthority.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4B26F]"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedAuthority.name}</h3>
                  <p className="text-xs font-semibold text-[#008751]">{selectedAuthority.role}</p>
                  <p className="text-xs text-slate-500">{selectedAuthority.area}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuthority(null)}
                className="text-slate-400 hover:text-slate-800 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Acerca de su función:</span>
              {selectedAuthority.bio}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-[#1E3A8A]" />
                <span className="font-mono">{selectedAuthority.email}</span>
              </div>
              {selectedAuthority.phoneExt && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-[#008751]" />
                  <span>{selectedAuthority.phoneExt} (Teléfono Central del Colegio)</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <a
                href={`mailto:${selectedAuthority.email}`}
                className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold text-center transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Enviar Correo
              </a>
              <button
                onClick={() => setSelectedAuthority(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Checkpoint de la Misión */}
      <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Misión 03 completada
            </h4>
            <p className="text-xs text-slate-500">
              Conoces al equipo de conducción y los canales oficiales. Ahora explora "Misión 04: Mi Rol en Educar".
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onComplete();
            onNavigateNext();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Avanzar a Misión 04</span>
          <ArrowRight className="w-4 h-4 text-[#D4B26F]" />
        </button>
      </div>
    </div>
  );
};
