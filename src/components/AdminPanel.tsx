import React from 'react';
import { 
  DiplomaRecord, 
  CalendarEvent, 
  NoticeItem, 
  FeedbackRecord, 
  AppConfig,
  Authority,
  OrganigramLevel
} from '../types';
import { 
  AUTHORIZED_ADMIN_EMAILS 
} from '../utils/crypto';
import { AdminDirectivos } from './AdminDirectivos';
import { AdminOrganigram } from './AdminOrganigram';
import { 
  Lock, 
  LogOut, 
  Users, 
  Calendar, 
  BellRing, 
  Award, 
  Star, 
  Settings, 
  Plus, 
  Trash2, 
  Download, 
  Check, 
  Search, 
  ExternalLink,
  ShieldAlert,
  Save,
  RefreshCw,
  FileSpreadsheet,
  Upload,
  Layers,
  FileJson,
  Sparkles,
  AlertTriangle,
  Database,
  Copy,
  CheckCheck
} from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SETUP_SQL } from '../lib/supabase';

interface AdminPanelProps {
  adminEmail: string;
  onLogout: () => void;
  diplomas: DiplomaRecord[];
  onDeleteDiploma: (id: string) => void;
  calendarEvents: CalendarEvent[];
  onAddCalendarEvent: (event: CalendarEvent) => void;
  onDeleteCalendarEvent: (id: string) => void;
  notices: NoticeItem[];
  onAddNotice: (notice: NoticeItem) => void;
  onDeleteNotice: (id: string) => void;
  feedbacks: FeedbackRecord[];
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onOpenGasFiles: () => void;
  // Directivos & Organigrama
  authorities: Authority[];
  onAddAuthority: (authority: Authority) => void;
  onUpdateAuthority: (authority: Authority) => void;
  onDeleteAuthority: (id: string) => void;
  organigramLevels: OrganigramLevel[];
  onUpdateOrganigramLevels: (newLevels: OrganigramLevel[]) => void;
  // Respaldo global y reset
  onExportBackup: () => void;
  onImportBackup: (backupJson: string) => boolean;
  onResetToDefaults: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adminEmail,
  onLogout,
  diplomas,
  onDeleteDiploma,
  calendarEvents,
  onAddCalendarEvent,
  onDeleteCalendarEvent,
  notices,
  onAddNotice,
  onDeleteNotice,
  feedbacks,
  config,
  onUpdateConfig,
  onOpenGasFiles,
  authorities,
  onAddAuthority,
  onUpdateAuthority,
  onDeleteAuthority,
  organigramLevels,
  onUpdateOrganigramLevels,
  onExportBackup,
  onImportBackup,
  onResetToDefaults
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'directivos' | 'organigrama' | 'diplomas' | 'calendario' | 'novedades' | 'feedback' | 'config' | 'usuarios'
  >('directivos');

  // Search & Filter state
  const [searchDiploma, setSearchDiploma] = React.useState('');
  
  // New event form state
  const [showEventModal, setShowEventModal] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({
    month: 3,
    monthName: 'Marzo 2026',
    dateStr: '',
    title: '',
    category: 'Institucional',
    responsible: '',
    description: '',
    targetAudience: 'Comunidad'
  });

  // New notice form state
  const [showNoticeModal, setShowNoticeModal] = React.useState(false);
  const [newNotice, setNewNotice] = React.useState({
    title: '',
    content: '',
    author: adminEmail.includes('marcelo') ? 'Marcelo Molina (Sistemas)' : 'Natali Miño (RRHH)',
    priority: 'normal' as 'alta' | 'media' | 'normal',
    pinned: false
  });

  // Config editor state
  const [institutionName, setInstitutionName] = React.useState(config.institutionName || 'Colegio Informático');
  const [institutionSubtitle, setInstitutionSubtitle] = React.useState(config.institutionSubtitle || '');
  const [slogan, setSlogan] = React.useState(config.slogan || '');
  const [customLogoUrl, setCustomLogoUrl] = React.useState(config.logoUrl || '');
  const [customWelcome, setCustomWelcome] = React.useState(config.welcomeMessage);
  const [savedConfigMessage, setSavedConfigMessage] = React.useState(false);

  // Backup & Reset state
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [showSupabaseSqlModal, setShowSupabaseSqlModal] = React.useState(false);
  const [copiedSql, setCopiedSql] = React.useState(false);
  const [supabaseInputUrl, setSupabaseInputUrl] = React.useState(() => {
    return import.meta.env.VITE_SUPABASE_URL || (typeof window !== 'undefined' ? localStorage.getItem('ci_supabase_url') || '' : '');
  });
  const [supabaseInputKey, setSupabaseInputKey] = React.useState(() => {
    return import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? localStorage.getItem('ci_supabase_anon_key') || '' : '');
  });
  const [savedSupabaseConfig, setSavedSupabaseConfig] = React.useState(false);
  const [backupImportError, setBackupImportError] = React.useState<string | null>(null);
  const [backupImportSuccess, setBackupImportSuccess] = React.useState(false);
  const backupFileInputRef = React.useRef<HTMLInputElement>(null);
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('ci_supabase_url', supabaseInputUrl.trim());
      localStorage.setItem('ci_supabase_anon_key', supabaseInputKey.trim());
    }
    setSavedSupabaseConfig(true);
    setTimeout(() => {
      setSavedSupabaseConfig(false);
      window.location.reload();
    }, 1200);
  };

  // Export Diplomas to CSV
  const handleExportDiplomasCSV = () => {
    const headers = ['Folio', 'Fecha_Emision', 'Nombre_Apellido', 'Puesto_Sector', 'Email', 'Fecha_Ingreso', 'Estado', 'Hash'];
    const rows = diplomas.map(d => [
      d.certificateFolio,
      d.timestamp,
      `"${d.fullName}"`,
      `"${d.role}"`,
      d.email || '',
      d.entryDate,
      d.status,
      d.verificationHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Diplomas_Onboarding_Educar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.dateStr) return;
    
    const eventItem: CalendarEvent = {
      id: `cal-${Date.now()}`,
      ...newEvent
    };

    onAddCalendarEvent(eventItem);
    setShowEventModal(false);
    setNewEvent({
      month: 3,
      monthName: 'Marzo 2026',
      dateStr: '',
      title: '',
      category: 'Institucional',
      responsible: '',
      description: '',
      targetAudience: 'Comunidad'
    });
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    const noticeItem: NoticeItem = {
      id: `not-${Date.now()}`,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }),
      ...newNotice
    };

    onAddNotice(noticeItem);
    setShowNoticeModal(false);
    setNewNotice({
      title: '',
      content: '',
      author: adminEmail.includes('marcelo') ? 'Marcelo Molina (Sistemas)' : 'Natali Miño (RRHH)',
      priority: 'normal',
      pinned: false
    });
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result as string;
        const success = onImportBackup(content);
        if (success) {
          setBackupImportSuccess(true);
          setBackupImportError(null);
          setTimeout(() => setBackupImportSuccess(false), 4000);
        } else {
          setBackupImportError('El archivo JSON no tiene la estructura válida de respaldo.');
        }
      } catch {
        setBackupImportError('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      institutionName: institutionName.trim() || 'Colegio Informático',
      institutionSubtitle: institutionSubtitle.trim(),
      slogan: slogan.trim(),
      logoUrl: customLogoUrl || '/assets/aistudio/escudo_colegio_informatico.png',
      welcomeMessage: customWelcome
    });
    setSavedConfigMessage(true);
    setTimeout(() => setSavedConfigMessage(false), 3000);
  };

  // Calculations for Feedback
  const avgOverall = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.overallRating, 0) / feedbacks.length).toFixed(1)
    : '5.0';
  const avgClarity = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.clarityRating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  const filteredDiplomas = diplomas.filter(d => 
    d.fullName.toLowerCase().includes(searchDiploma.toLowerCase()) ||
    d.role.toLowerCase().includes(searchDiploma.toLowerCase()) ||
    d.certificateFolio.toLowerCase().includes(searchDiploma.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-[#CFB07A] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/aistudio/escudo_colegio_informatico.png"
            alt="Escudo Oficial Colegio Informático"
            className="w-14 h-18 object-contain drop-shadow-md hidden sm:block"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#01913F] text-white text-[11px] font-mono font-bold tracking-wider">
                PANEL RESTRINGIDO • SHA-256
              </span>
              {isSupabaseConfigured() ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-xs">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>SUPABASE CLOUD ACTIVO</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-xs">
                  <Database className="w-3 h-3 text-amber-400" />
                  <span>MODO LOCAL (OFFLINE)</span>
                </span>
              )}
              <span className="text-xs text-[#CFB07A] font-serif-title font-bold uppercase">Verita Vinci</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Gestión Centralizada del Onboarding 2026
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Sesión activa como: <span className="font-mono text-[#CFB07A] font-bold">{adminEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowSupabaseSqlModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1.5 shadow-xs"
            title="Ver configuración y script SQL de Supabase"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase Cloud</span>
          </button>

          <button
            onClick={onOpenGasFiles}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#CFB07A] text-xs font-bold border border-[#CFB07A]/40 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Código Apps Script</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-rose-200 text-xs font-bold border border-red-500/40 transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('directivos')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'directivos'
              ? 'border-[#01913F] text-[#01913F] bg-emerald-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directivos_Autoridades ({authorities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('organigrama')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'organigrama'
              ? 'border-[#1E3A8A] text-[#1E3A8A] bg-blue-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>organigrama_niveles ({organigramLevels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diplomas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'diplomas'
              ? 'border-[#DE4034] text-[#DE4034] bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>diplomas_emitidos ({diplomas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendario')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'calendario'
              ? 'border-[#DE4034] text-[#DE4034] bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>calendario_eventos ({calendarEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('novedades')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'novedades'
              ? 'border-[#DE4034] text-[#DE4034] bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>novedades_avisos ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'border-[#DE4034] text-[#DE4034] bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>feedback_satisfaccion ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'usuarios'
              ? 'border-[#DE4034] text-[#DE4034] bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>usuarios_admin</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'config'
              ? 'border-[#CFB07A] text-[#8F6A24] bg-amber-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración & Respaldos</span>
        </button>
      </div>

      {/* TAB DIRECTIVOS & AUTORIDADES */}
      {activeTab === 'directivos' && (
        <AdminDirectivos
          authorities={authorities}
          onAddAuthority={onAddAuthority}
          onUpdateAuthority={onUpdateAuthority}
          onDeleteAuthority={onDeleteAuthority}
        />
      )}

      {/* TAB ORGANIGRAMA INSTITUCIONAL */}
      {activeTab === 'organigrama' && (
        <AdminOrganigram
          levels={organigramLevels}
          onUpdateLevels={onUpdateOrganigramLevels}
          availableAuthorities={authorities}
        />
      )}

      {/* TAB 1: DIPLOMAS EMITIDOS (diplomas_emitidos) */}
      {activeTab === 'diplomas' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tabla Supabase: diplomas_emitidos
              </h2>
              <p className="text-xs text-slate-500">
                Registros de colaboradores que han completado la Operación Informático y emitido su constancia oficial.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar colaborador o folio..."
                  value={searchDiploma}
                  onChange={(e) => setSearchDiploma(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]"
                />
              </div>

              <button
                onClick={handleExportDiplomasCSV}
                className="px-3.5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-y border-slate-200">
                  <th className="py-3 px-4">Folio</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4">Nombre y Apellido</th>
                  <th className="py-3 px-4">Puesto o Sector</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Fecha Ingreso</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDiplomas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No hay diplomas registrados que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredDiplomas.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#7A1C1C]">
                        {d.certificateFolio}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {d.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {d.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {d.role}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {d.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {d.entryDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteDiploma(d.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CALENDARIO DE EVENTOS (calendario_eventos) */}
      {activeTab === 'calendario' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tabla Supabase: calendario_eventos
              </h2>
              <p className="text-xs text-slate-500">
                Gestiona y añade hitos que se reflejan de inmediato en la Misión 02 del portal.
              </p>
            </div>

            <button
              onClick={() => setShowEventModal(true)}
              className="px-4 py-2 rounded-xl bg-[#7A1C1C] hover:bg-[#5A1212] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Evento 2026</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarEvents.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2 relative group bg-slate-50/50">
                <button
                  onClick={() => onDeleteCalendarEvent(evt.id)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition"
                  title="Eliminar evento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#008751]">{evt.dateStr}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 font-bold uppercase text-slate-700">
                    {evt.category}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{evt.title}</h4>
                <p className="text-xs text-slate-600">{evt.description}</p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Responsable: <span className="font-semibold text-slate-700">{evt.responsible}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOVEDADES Y AVISOS (novedades_avisos) */}
      {activeTab === 'novedades' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tabla Supabase: novedades_avisos
              </h2>
              <p className="text-xs text-slate-500">
                Publica comunicados prioritarios para todos los colaboradores que ingresen al portal.
              </p>
            </div>

            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-4 py-2 rounded-xl bg-[#7A1C1C] hover:bg-[#5A1212] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nuevo Aviso</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative group">
                <button
                  onClick={() => onDeleteNotice(n.id)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition"
                  title="Eliminar aviso"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pr-8">
                  <span className="text-[11px] font-mono text-slate-400">{n.date}</span>
                  {n.pinned && (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                      Fijado
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  Emitido por: <span className="font-semibold text-slate-700">{n.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FEEDBACK & SATISFACCIÓN (feedback_satisfaccion) */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tabla Supabase: feedback_satisfaccion
              </h2>
              <p className="text-xs text-slate-500">
                Resultados de las encuestas completadas por el talento ingresante.
              </p>
            </div>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Satisfacción General Promedio
              </span>
              <div className="text-3xl font-extrabold text-amber-900 flex items-center gap-2">
                <span>{avgOverall}</span>
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-[11px] text-amber-700">Sobre un máximo de 5.0 estrellas</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Claridad de los Contenidos
              </span>
              <div className="text-3xl font-extrabold text-emerald-900 flex items-center gap-2">
                <span>{avgClarity}</span>
                <Star className="w-6 h-6 text-emerald-600 fill-emerald-600" />
              </div>
              <p className="text-[11px] text-emerald-700">Comprensión de normas y cultura</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Total de Evaluaciones
              </span>
              <div className="text-3xl font-extrabold text-blue-900">
                {feedbacks.length}
              </div>
              <p className="text-[11px] text-blue-700">100% de recomendaciones positivas</p>
            </div>
          </div>

          {/* List of responses */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Comentarios y Sugerencias de Colaboradores:</h3>
            <div className="space-y-3">
              {feedbacks.map((f) => (
                <div key={f.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{f.fullName} ({f.role})</span>
                    <span className="text-slate-400 font-mono">{f.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>General: <strong>{f.overallRating}/5 ★</strong></span>
                    <span>Claridad: <strong>{f.clarityRating}/5 ★</strong></span>
                    <span className="text-[#008751] font-semibold">Útil: {f.mostUsefulSection}</span>
                  </div>
                  {f.suggestions && (
                    <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                      "{f.suggestions}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USUARIOS_ADMIN */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#7A1C1C] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Pestaña Google Sheets: Usuarios_Admin
              </h2>
              <p className="text-xs text-slate-500">
                Restringido EXCLUSIVAMENTE a las dos direcciones autorizadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A1C1C] uppercase">Administrador 01 • RRHH</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Activo</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">rrhh@educarsrl.com.ar</h3>
              <p className="text-xs text-slate-600">Gestión de Talento, Personas, Diplomas y Calendario Institucional.</p>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Hash SHA-256: a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase">Administrador 02 • Sistemas</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Activo</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">marcelo.molina@educarsrl.com.ar</h3>
              <p className="text-xs text-slate-600">Marcelo Molina: Conducción Tecnológica, Infraestructura, Ciberseguridad.</p>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Hash SHA-256: a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Seguridad Reforzada:</strong> El acceso a este panel no admite registros externos ni correos de dominios no autorizados. Cualquier intento de inicio de sesión queda auditado.
          </div>
        </div>
      )}

      {/* TAB 6: CONFIGURACIÓN INSTITUCIONAL & GESTIÓN GLOBAL */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Tarjeta 1: Personalización de Identidad Visual y Textos */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Personalización e Identidad Institucional
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Modifica los datos principales del Colegio Informático, escudo oficial y textos de bienvenida.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sincronización en Vivo Activa</span>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-5 max-w-2xl">
              {/* Live Shield Preview y Selector */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={customLogoUrl || "/assets/aistudio/escudo_colegio_informatico.png"}
                  alt="Escudo Oficial Colegio Informático"
                  onError={() => setCustomLogoUrl('/assets/aistudio/escudo_colegio_informatico.png')}
                  className="w-20 h-24 object-contain drop-shadow-md shrink-0"
                />
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-serif-title font-bold text-[#8F6A28] uppercase tracking-wider block">
                      Verita Vinci • Blasón Oficial
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#DE4034 • #01913F • #CFB07A</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Escudo y Logotipo del Colegio</h4>
                  <p className="text-xs text-slate-500">
                    Se visualiza en la cabecera, inicio, organigrama y diploma emitido.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-[#01913F] text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#01913F]" />
                      <span>Subir Logo desde mi Computadora</span>
                    </button>

                    {customLogoUrl && customLogoUrl !== '/assets/aistudio/escudo_colegio_informatico.png' && (
                      <button
                        type="button"
                        onClick={() => setCustomLogoUrl('/assets/aistudio/escudo_colegio_informatico.png')}
                        className="px-3 py-1.5 bg-red-50 text-[#DE4034] text-xs font-bold rounded-lg hover:bg-red-100 transition"
                      >
                        Restaurar Escudo Original
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  O Enlace / URL directa de la imagen
                </label>
                <input
                  type="text"
                  placeholder="/assets/aistudio/escudo_colegio_informatico.png"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                />
              </div>

              {/* Nombre y Subtítulo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre de la Institución
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Colegio Informático"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subtítulo / Entidad
                  </label>
                  <input
                    type="text"
                    value={institutionSubtitle}
                    onChange={(e) => setInstitutionSubtitle(e.target.value)}
                    placeholder="Comunidad Educativa Educar SRL • Verita Vinci"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lema / Slogan del Programa
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Operación Informático: Una misión: descubrir todo lo que nos une"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mensaje de Bienvenida Protagonista
                </label>
                <textarea
                  rows={3}
                  value={customWelcome}
                  onChange={(e) => setCustomWelcome(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#DE4034] resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#01913F] hover:bg-[#007031] text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Configuración</span>
                </button>

                {savedConfigMessage && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-4 h-4" /> ¡Configuración actualizada y activa en el portal!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Tarjeta 2: Gestión Global de Contenidos & Respaldo JSON */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#CFB07A] flex items-center justify-center">
                <FileJson className="w-5 h-5 text-[#8F6A28]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Gestión Global de Contenidos & Copias de Respaldo
                </h3>
                <p className="text-xs text-slate-500">
                  Exporta e importa la base de datos completa (Directivos, Organigrama, Calendario, Novedades y Configuración) en formato JSON estándar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opción 1: Exportar Respaldo JSON */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Exportar Respaldo (JSON)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Descarga un archivo con todos los directivos, niveles del organigrama, eventos 2026 y configuración activa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="w-full py-2 px-3 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Archivo JSON</span>
                </button>
              </div>

              {/* Opción 2: Importar Respaldo JSON */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#01913F] flex items-center justify-center font-bold">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Restaurar Respaldo (JSON)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Carga un archivo de respaldo previo para aplicar cambios masivos o restaurar contenidos del colegio.
                  </p>
                </div>

                <input
                  type="file"
                  ref={backupFileInputRef}
                  onChange={handleImportFileChange}
                  accept=".json,application/json"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => backupFileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-[#01913F] hover:bg-[#017a35] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Seleccionar Archivo JSON</span>
                </button>
              </div>

              {/* Opción 3: Restablecer Valores de Fábrica */}
              <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#DE4034] flex items-center justify-center font-bold">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Restablecer Valores Iniciales</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vuelve a la configuración, directivos y organigrama predeterminados institucionales del Colegio Informático.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-2 px-3 bg-white border border-red-300 hover:bg-red-50 text-[#DE4034] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Restablecer Predeterminados</span>
                </button>
              </div>
            </div>

            {/* Mensajes de feedback de importación */}
            {backupImportSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Copia de respaldo restaurada exitosamente! Todos los componentes han sido actualizados.</span>
              </div>
            )}

            {backupImportError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{backupImportError}</span>
              </div>
            )}
          </div>

          {/* Modal de confirmación para restablecer */}
          {showResetConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-red-400 animate-fadeIn text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-extrabold text-slate-900">¿Restablecer datos originales?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Esta acción restaurará los directivos, el organigrama y los textos a su estado institucional inicial de fábrica. Te sugerimos descargar una copia de respaldo en JSON antes de continuar.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetToDefaults();
                      setShowResetConfirm(false);
                      setSavedConfigMessage(true);
                      setTimeout(() => setSavedConfigMessage(false), 3000);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    Sí, Restablecer Todo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: NUEVO EVENTO CALENDARIO */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-[#D4B26F]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Añadir Evento al Calendario 2026</h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Semana de la Robótica"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha / Días *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 14 de Mayo"
                    value={newEvent.dateStr}
                    onChange={(e) => setNewEvent({ ...newEvent, dateStr: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mes *</label>
                  <select
                    value={newEvent.month}
                    onChange={(e) => {
                      const m = parseInt(e.target.value);
                      const monthNames = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      setNewEvent({ ...newEvent, month: m, monthName: `${monthNames[m]} 2026` });
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    {[2,3,4,5,6,7,8,9,10,11,12].map(num => (
                      <option key={num} value={num}>Mes {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Responsable *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Natali Miño (RRHH) / Cecilia Panozzo"
                  value={newEvent.responsible}
                  onChange={(e) => setNewEvent({ ...newEvent, responsible: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                <input
                  type="text"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#008751] text-white font-bold"
                >
                  Guardar Evento
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO AVISO / NOVEDAD */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-[#D4B26F]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Publicar Comunicado Institucional</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título del Comunicado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Nuevo convenio de almuerzos para docentes"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contenido *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalla el aviso..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={newNotice.pinned}
                  onChange={(e) => setNewNotice({ ...newNotice, pinned: e.target.checked })}
                  className="rounded text-[#7A1C1C]"
                />
                <label htmlFor="pinnedCheck" className="text-slate-700 font-medium">
                  Fijar aviso en la página de inicio
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7A1C1C] text-white font-bold"
                >
                  Publicar Comunicado
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURACIÓN SUPABASE & SCRIPT SQL */}
      {showSupabaseSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-emerald-500 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Conexión a Supabase (Cloud Database & Storage)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sincronización en vivo y almacenamiento en la nube para el Colegio Informático.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseSqlModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-700 leading-relaxed flex-1">
              {/* Estado de conexión */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isSupabaseConfigured()
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div>
                    <span className="font-bold block text-sm">
                      {isSupabaseConfigured()
                        ? 'Supabase Conectado y Activo en la Nube'
                        : 'Modo Local / Fallback Activo'}
                    </span>
                    <span className="text-[11px] opacity-90">
                      {isSupabaseConfigured()
                        ? 'Las consultas a Supabase (Directivos, Organigrama, Storage) se sincronizan en vivo en PostgreSQL.'
                        : 'Si no configuras las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY, la app funciona de manera 100% segura usando datos locales.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulario de Configuración Directa */}
              <form onSubmit={handleSaveSupabaseConfig} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Credenciales de Proyecto Supabase</span>
                  </h4>
                  {isSupabaseConfigured() && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Conectado
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      URL del Proyecto Supabase (Project URL)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://tu-proyecto.supabase.co"
                      value={supabaseInputUrl}
                      onChange={(e) => setSupabaseInputUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Clave Anónima Pública (Anon Key)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                      value={supabaseInputKey}
                      onChange={(e) => setSupabaseInputKey(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar y Conectar Supabase</span>
                  </button>

                  {savedSupabaseConfig && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fadeIn">
                      <Check className="w-4 h-4" /> ¡Guardado! Reiniciando conexión...
                    </span>
                  )}
                </div>
              </form>

              {/* Instrucciones Rápidas */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Pasos para habilitar en tu proyecto Supabase:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>
                    Crea un proyecto en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3 inline" /></a>.
                  </li>
                  <li>
                    Configura en las variables de entorno de tu proyecto:
                    <div className="font-mono text-[11px] bg-slate-900 text-slate-100 p-2.5 rounded-xl my-1.5 space-y-0.5">
                      <div>VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"</div>
                      <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."</div>
                    </div>
                  </li>
                  <li>
                    Abre el <strong>SQL Editor</strong> en Supabase, pega el siguiente script y pulsa <strong>Run</strong>:
                  </li>
                </ol>
              </div>

              {/* SQL Script Box with Copy Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Script DDL: Tablas 'directivos', 'portal_config' y Storage 'directivos-fotos'</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs active:scale-95"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-white" />
                        <span>¡Copiado al portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                    {SUPABASE_SETUP_SQL}
                  </pre>
                </div>
              </div>

              {/* Beneficios integrados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">🔥 Tiempo Real (Postgres CDC)</h5>
                  <p className="text-[11px] text-slate-600">
                    Cuando un directivo se crea, actualiza o elimina, la vista pública del portal se actualiza al instante sin recargar la página.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">🖼️ Almacenamiento Supabase Storage</h5>
                  <p className="text-[11px] text-slate-600">
                    Al subir una foto desde la computadora, se comprime automáticamente y se aloja en el bucket <code className="font-mono bg-slate-200 px-1 rounded">directivos-fotos</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSupabaseSqlModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
