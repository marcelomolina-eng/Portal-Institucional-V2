import React, { useState, useRef, useEffect } from 'react';
import { Authority } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  Briefcase, 
  Building, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  Camera,
  RefreshCw,
  Loader2,
  Cloud
} from 'lucide-react';
import { compressAndResizeImage } from '../utils/imageCompressor';
import { supabase, uploadDirectivoPhoto, isSupabaseConfigured } from '../lib/supabase';

interface AdminDirectivosProps {
  authorities: Authority[];
  onAddAuthority: (authority: Authority) => void;
  onUpdateAuthority: (authority: Authority) => void;
  onDeleteAuthority: (id: string) => void;
}

const COMMON_AREAS = [
  'Conducción Superior',
  'Dirección Pedagógica',
  'Secretaría Escolar',
  'Gestión y Desarrollo de Personas (RRHH)',
  'Tecnología & Soporte IT',
  'Formación Ética y Pastoral',
  'Lenguas Extranjeras & Bilingüe',
  'Orientación y Psicopedagogía (EAI)',
  'Vida Estudiantil & Deportes',
  'Innovación STEAM & Robótica'
];

export const AdminDirectivos: React.FC<AdminDirectivosProps> = ({
  authorities,
  onAddAuthority,
  onUpdateAuthority,
  onDeleteAuthority
}) => {
  const [directivosList, setDirectivosList] = useState<Authority[]>(authorities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState<Authority | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sincronizar con props de autoridades si cambian externamente
  useEffect(() => {
    if (authorities && authorities.length > 0) {
      setDirectivosList(authorities);
    }
  }, [authorities]);

  // useEffect inicial: carga las autoridades desde la base de datos Supabase
  useEffect(() => {
    const fetchDirectivosFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('directivos')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error("Error Supabase:", error);
        } else {
          console.log("Cargando desde Supabase:", data);
          if (data && data.length > 0) {
            const mappedAuthorities: Authority[] = data.map((row: any) => ({
              id: String(row.id || `auth-${Date.now()}`),
              name: row.nombre || row.name || '',
              role: row.cargo || row.role || '',
              area: row.area || '',
              email: row.email || '',
              phoneExt: row.telefono || row.phoneExt || '',
              bio: row.biografia || row.bio || '',
              photoUrl: row.foto_url || row.photoUrl || ''
            }));
            setDirectivosList(mappedAuthorities);

            // Sincronizar en el estado superior de la aplicación
            mappedAuthorities.forEach(auth => {
              if (authorities.some(a => a.id === auth.id)) {
                onUpdateAuthority(auth);
              } else {
                onAddAuthority(auth);
              }
            });
          }
        }
      } catch (err) {
        console.error("Error Supabase:", err);
      }
    };

    fetchDirectivosFromSupabase();
  }, []);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    role: string;
    area: string;
    email: string;
    phoneExt: string;
    bio: string;
    photoUrl: string;
  }>({
    id: '',
    name: '',
    role: '',
    area: COMMON_AREAS[0],
    email: '',
    phoneExt: '',
    bio: '',
    photoUrl: ''
  });

  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploadingToStorage, setIsUploadingToStorage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toastAlert, setToastAlert] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter authorities
  const filteredAuthorities = directivosList.filter(auth => {
    const matchesSearch = 
      auth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = selectedArea === 'todos' || auth.area === selectedArea;

    return matchesSearch && matchesArea;
  });

  // Unique areas present in list
  const uniqueAreas = Array.from(new Set(directivosList.map(a => a.area)));

  const handleOpenCreate = () => {
    setEditingAuthority(null);
    setFormData({
      id: `auth-${Date.now()}`,
      name: '',
      role: '',
      area: COMMON_AREAS[1],
      email: '',
      phoneExt: '',
      bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });
    setPreviewPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setPhotoError(null);
    setSaveError(null);
    setIsCompressing(false);
    setIsUploadingToStorage(false);
    setIsSaving(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (auth: Authority) => {
    setEditingAuthority(auth);
    setFormData({
      id: auth.id,
      name: auth.name,
      role: auth.role,
      area: auth.area,
      email: auth.email,
      phoneExt: auth.phoneExt || '',
      bio: auth.bio,
      photoUrl: auth.photoUrl
    });
    setPreviewPhoto(auth.photoUrl);
    setPhotoError(null);
    setSaveError(null);
    setIsCompressing(false);
    setIsUploadingToStorage(false);
    setIsSaving(false);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoError(`La imagen seleccionada supera los 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Por favor selecciona una imagen de menor peso.`);
      return;
    }

    setPhotoError(null);
    setSaveError(null);
    setIsCompressing(true);

    try {
      // 1. Auto-compress and resize image to max 400x400px (WebP format, ~20-40KB)
      const compressedDataUrl = await compressAndResizeImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.82
      });

      // Show preview immediately for instantaneous UX
      setFormData(prev => ({ ...prev, photoUrl: compressedDataUrl }));
      setPreviewPhoto(compressedDataUrl);

      // 2. Upload to Supabase Storage bucket 'directivos-fotos' if configured
      if (isSupabaseConfigured()) {
        setIsUploadingToStorage(true);
        try {
          const res = await fetch(compressedDataUrl);
          const blob = await res.blob();
          const targetName = formData.name || formData.id || 'directivo';
          const publicUrl = await uploadDirectivoPhoto(blob, targetName);

          if (publicUrl) {
            setFormData(prev => ({ ...prev, photoUrl: publicUrl }));
            setPreviewPhoto(publicUrl);
          }
        } catch (storageErr) {
          console.warn('[Supabase Storage] Fallback to compressed local image:', storageErr);
        } finally {
          setIsUploadingToStorage(false);
        }
      }
    } catch (err: unknown) {
      console.error('Error al optimizar imagen local:', err);
      const msg = err instanceof Error ? err.message : 'No se pudo procesar la imagen local.';
      setPhotoError(msg);
    } finally {
      setIsCompressing(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrl: url }));
    setPreviewPhoto(url);
    setPhotoError(null);
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim()) {
      setSaveError('Por favor completa los campos obligatorios: Nombre, Cargo y Correo institucional.');
      return;
    }

    setIsSaving(true);

    try {
      const authorityPayload: Authority = {
        id: formData.id || `auth-${Date.now()}`,
        name: formData.name.trim(),
        role: formData.role.trim(),
        area: formData.area.trim(),
        email: formData.email.trim(),
        phoneExt: formData.phoneExt.trim(),
        bio: formData.bio.trim() || 'Referente del Colegio Informático comprometido con la excelencia formativa.',
        photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      };

      const directivoData = {
        id: authorityPayload.id,
        nombre: authorityPayload.name,
        cargo: authorityPayload.role,
        area: authorityPayload.area,
        email: authorityPayload.email,
        telefono: authorityPayload.phoneExt,
        biografia: authorityPayload.bio,
        foto_url: authorityPayload.photoUrl
      };

      // Guardar o actualizar directamente en Supabase usando .upsert() con onConflict: 'id'
      try {
        const { data, error } = await supabase
          .from('directivos')
          .upsert(directivoData, { onConflict: 'id' })
          .select();

        if (error) {
          console.error("Error Supabase:", error);
          const errorMsg = "Error al guardar en Supabase: " + error.message;
          setSaveError(errorMsg);
          setToastAlert({
            type: 'error',
            message: errorMsg
          });
          setIsSaving(false);
          return;
        }

        console.log("Cargando desde Supabase:", data);
        setToastAlert({
          type: 'success',
          message: `Directivo "${authorityPayload.name}" guardado exitosamente en Supabase.`
        });
        setTimeout(() => setToastAlert(null), 4000);
      } catch (supabaseErr: any) {
        console.error("Error Supabase:", supabaseErr);
        const errorMsg = "Error al guardar en Supabase: " + (supabaseErr?.message || String(supabaseErr));
        setSaveError(errorMsg);
        setToastAlert({
          type: 'error',
          message: errorMsg
        });
        setIsSaving(false);
        return;
      }

      if (editingAuthority) {
        onUpdateAuthority(authorityPayload);
        setDirectivosList(prev => prev.map(a => a.id === authorityPayload.id ? authorityPayload : a));
      } else {
        onAddAuthority(authorityPayload);
        setDirectivosList(prev => [...prev, authorityPayload]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error('Error al guardar directivo:', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos del directivo.';
      setSaveError(`No se pudieron guardar los cambios: ${msg}`);
      setToastAlert({
        type: 'error',
        message: "Error al guardar en Supabase: " + msg
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('directivos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error Supabase:", error);
        const errorMsg = "Error al guardar en Supabase: " + error.message;
        setToastAlert({
          type: 'error',
          message: errorMsg
        });
        return;
      }

      console.log("Eliminado de Supabase:", id);
      setToastAlert({
        type: 'success',
        message: "Directivo eliminado correctamente en Supabase."
      });
      setTimeout(() => setToastAlert(null), 3000);
    } catch (supabaseErr: any) {
      console.error("Error Supabase:", supabaseErr);
      const errorMsg = "Error al guardar en Supabase: " + (supabaseErr?.message || String(supabaseErr));
      setToastAlert({
        type: 'error',
        message: errorMsg
      });
      return;
    }

    onDeleteAuthority(id);
    setDirectivosList(prev => prev.filter(a => a.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Alerta Visual Toast de Supabase */}
      {toastAlert && (
        <div 
          role="alert"
          className={`fixed top-5 right-5 z-50 max-w-md p-4 rounded-2xl shadow-2xl border-2 flex items-start gap-3 transition-all duration-300 animate-slideDown ${
            toastAlert.type === 'error'
              ? 'bg-red-600 text-white border-white/80'
              : 'bg-[#01913F] text-white border-white/80'
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm">
              {toastAlert.type === 'error' ? 'Alerta de Supabase' : 'Sincronización Exitosa'}
            </p>
            <p className="mt-1 font-medium leading-relaxed">{toastAlert.message}</p>
          </div>
          <button
            onClick={() => setToastAlert(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/20 transition"
            title="Cerrar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header y Estadísticas */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#01913F]" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Directivos & Referentes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administra los miembros del equipo de conducción, actualiza sus fotos reales y datos de contacto institucional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <Users className="w-4 h-4 text-[#DE4034]" />
            <span>{authorities.length} Registrados</span>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#01913F] hover:bg-[#017a35] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Directivo</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cargo, área o correo..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F] shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F] text-slate-700 shadow-xs font-medium"
        >
          <option value="todos">Todas las áreas ({authorities.length})</option>
          {uniqueAreas.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Directivos */}
      {filteredAuthorities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron directivos</h3>
          <p className="text-xs text-slate-400 mt-1">
            Intenta con otro término de búsqueda o agrega un nuevo integrante al equipo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAuthorities.map((auth) => (
            <div
              key={auth.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#CFB07A] hover:shadow-md transition flex flex-col justify-between group relative"
            >
              <div className="space-y-4">
                {/* Cabecera de la tarjeta con foto y datos principales */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={auth.photoUrl}
                      alt={auth.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#CFB07A] shadow-xs group-hover:scale-105 transition"
                    />
                    <button
                      onClick={() => handleOpenEdit(auth)}
                      title="Cambiar foto o editar"
                      className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                    >
                      <Camera className="w-3 h-3 text-[#01913F]" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#01913F] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 mb-1 truncate max-w-full">
                      {auth.area}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate">
                      {auth.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold line-clamp-1 mt-0.5">
                      {auth.role}
                    </p>
                  </div>
                </div>

                {/* Biografía / Funciones */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {auth.bio}
                </p>

                {/* Contacto */}
                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2 font-mono text-[11px] truncate">
                    <Mail className="w-3.5 h-3.5 text-[#DE4034] shrink-0" />
                    <span className="truncate">{auth.email}</span>
                  </div>
                  {auth.phoneExt && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-[#CFB07A] shrink-0" />
                      <span>{auth.phoneExt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(auth)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-[#DE4034] hover:text-white text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Datos</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(auth.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Eliminar directivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Modal de confirmación de eliminación en la tarjeta */}
              {deleteConfirmId === auth.id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl p-5 flex flex-col justify-center items-center text-center z-10 space-y-3">
                  <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
                  <p className="text-xs font-bold text-slate-800">
                    ¿Confirmas eliminar a <span className="text-red-600 font-extrabold">{auth.name}</span>?
                  </p>
                  <div className="flex gap-2 w-full pt-1">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(auth.id)}
                      className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL AGREGAR / EDITAR DIRECTIVO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#CFB07A] space-y-6 my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#DE4034]">
                  {editingAuthority ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingAuthority ? 'Editar Directivo / Referente' : 'Nuevo Directivo Institucional'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Los cambios se reflejarán instantáneamente en la Misión 03 del portal.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selector de Foto con Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Foto del Directivo (Subir archivo real o URL)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={previewPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Vista previa"
                      onError={() => setPhotoError('No se pudo cargar la imagen. Verifica la URL o sube un archivo.')}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#CFB07A] shadow-sm"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* Tabs de tipo de foto */}
                    <div className="flex border-b border-slate-200 text-xs font-bold gap-3">
                      <button
                        type="button"
                        onClick={() => setPhotoMode('upload')}
                        className={`pb-1.5 border-b-2 flex items-center gap-1.5 transition ${
                          photoMode === 'upload'
                            ? 'border-[#01913F] text-[#01913F]'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir desde mi Equipo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhotoMode('url')}
                        className={`pb-1.5 border-b-2 flex items-center gap-1.5 transition ${
                          photoMode === 'url'
                            ? 'border-[#01913F] text-[#01913F]'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Pegar Enlace URL</span>
                      </button>
                    </div>

                    {photoMode === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                          disabled={isCompressing || isUploadingToStorage}
                        />
                        <button
                          type="button"
                          disabled={isCompressing || isUploadingToStorage}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 px-3 border-2 border-dashed border-slate-300 hover:border-[#01913F] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-600 hover:text-[#01913F] bg-white flex items-center justify-center gap-2 transition"
                        >
                          {isCompressing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#01913F]" />
                              <span>Comprimiendo imagen (WebP 400x400)...</span>
                            </>
                          ) : isUploadingToStorage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              <span>Subiendo a Supabase Storage (directivos-fotos)...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Seleccionar Imagen de la Computadora</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Admite JPG, PNG o WebP. {isSupabaseConfigured() ? 'Se almacena en el bucket "directivos-fotos" de Supabase.' : 'Se almacena de forma persistente y segura.'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={formData.photoUrl}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://ejemplo.com/foto-directivo.jpg"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Pega un enlace directo de Google Drive (abierto) o servidor de imágenes.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {photoError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{photoError}</span>
                  </p>
                )}
              </div>

              {/* Nombre y Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Lic. Sofi Lorenzo"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Cargo / Rol Institucional <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Ej: Directora Académica Institucional"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>
              </div>

              {/* Área y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Área o Sector Escolar
                  </label>
                  <input
                    type="text"
                    list="areas-sugeridas"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="Ej: Dirección Pedagógica"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                  <datalist id="areas-sugeridas">
                    {COMMON_AREAS.map(a => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Correo Institucional <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nombre@educarsrl.com.ar"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>
              </div>

              {/* Interno Telefónico */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Teléfono / Interno Telefónico (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.phoneExt}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneExt: e.target.value }))}
                  placeholder="Ej: Int. 101 / +54 379 442-xxxx"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                />
              </div>

              {/* Biografía / Descripción de funciones */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Biografía / Responsabilidades Principales
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe brevemente su rol formativo, experiencia y proyectos que lidera en la comunidad..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F] leading-relaxed resize-none"
                />
              </div>

              {/* Mensaje de error al guardar */}
              {saveError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-[#DE4034] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{saveError}</span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSaving || isCompressing}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="px-5 py-2.5 bg-[#DE4034] hover:bg-[#c7352a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingAuthority ? 'Guardar Cambios' : 'Registrar Directivo'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
