import React, { useState, useRef, useEffect } from 'react';
import { Coordinador } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  AlertCircle,
  Camera,
  Loader2,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { compressAndResizeImage } from '../utils/imageCompressor';
import { 
  supabase, 
  uploadDirectivoPhoto, 
  isSupabaseConfigured,
  resolveDirectivoFotoUrl 
} from '../lib/supabase';

interface AdminCoordinadoresProps {
  coordinadores: Coordinador[];
  onAddCoordinador: (coordinador: Coordinador) => void;
  onUpdateCoordinador: (coordinador: Coordinador) => void;
  onDeleteCoordinador: (id: number) => void;
}

const COMMON_CARGOS = [
  'Coordinador del Departamento de Lenguas Extranjeras & Bilingüe',
  'Coordinadora de Orientación y EAI (Espacio de Apoyo e Integración)',
  'Coordinadora de Vida Estudiantil y Deportes',
  'Líder de Transformación Digital & IA Educativa',
  'Responsable de Robótica STEAM & Maker Lab',
  'Coordinación Pastoral, Valores y Formación Ética',
  'Coordinador de Ciclo Básico Secundario',
  'Coordinadora Pedagógica Nivel Primario',
  'Coordinadora de Nivel Inicial',
  'Coordinador de Prácticas Profesionalizantes & Pasantías'
];

export const AdminCoordinadores: React.FC<AdminCoordinadoresProps> = ({
  coordinadores = [],
  onAddCoordinador,
  onUpdateCoordinador,
  onDeleteCoordinador
}) => {
  const [coordinadoresList, setCoordinadoresList] = useState<Coordinador[]>(coordinadores || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoordinador, setEditingCoordinador] = useState<Coordinador | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Sincronizar cuando cambian las props
  useEffect(() => {
    if (coordinadores && coordinadores.length > 0) {
      setCoordinadoresList(coordinadores);
    }
  }, [coordinadores]);

  // Carga inicial y re-sincronización con la tabla 'coordinadores' de Supabase
  useEffect(() => {
    const fetchCoordinadoresFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('coordinadores')
          .select('*')
          .order('orden', { ascending: true });

        if (error) {
          console.warn("[AdminCoordinadores] Supabase coordinadores:", error.message);
        } else if (data && data.length > 0) {
          const mapped: Coordinador[] = data.map((row: any) => ({
            id: Number(row.id),
            nombre: row.nombre || '',
            cargo: row.cargo || '',
            foto_url: row.foto_url ?? null,
            orden: row.orden !== undefined && row.orden !== null ? Number(row.orden) : 1
          }));
          setCoordinadoresList(mapped);
        }
      } catch (err) {
        console.warn("[AdminCoordinadores] Error al conectar con Supabase:", err);
      }
    };

    fetchCoordinadoresFromSupabase();
  }, []);

  // Form State
  const [formData, setFormData] = useState<{
    id?: number;
    nombre: string;
    cargo: string;
    orden: number;
    foto_url: string;
  }>({
    nombre: '',
    cargo: '',
    orden: 1,
    foto_url: ''
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

  // Helper para iniciales de avatar institucional
  const getInitials = (nombre: string): string => {
    if (!nombre) return 'CI';
    const cleaned = nombre.replace(/^(Lic\.|Prof\.|Dr\.|Dra\.|Ing\.|Sr\.|Sra\.)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'CI';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Filtrado y ordenamiento de coordinadores (seguro con opcional chaining)
  const filteredCoordinadores = (coordinadoresList || [])
    .filter(c => {
      const term = searchTerm.toLowerCase();
      return (
        (c.nombre || '').toLowerCase().includes(term) ||
        (c.cargo || '').toLowerCase().includes(term)
      );
    })
    .sort((a, b) => (a.orden ?? 1) - (b.orden ?? 1));

  const handleOpenCreate = () => {
    const nextOrder = (coordinadoresList?.length || 0) + 1;
    setEditingCoordinador(null);
    setFormData({
      nombre: '',
      cargo: COMMON_CARGOS[0],
      orden: nextOrder,
      foto_url: ''
    });
    setPreviewPhoto('');
    setPhotoError(null);
    setSaveError(null);
    setIsCompressing(false);
    setIsUploadingToStorage(false);
    setIsSaving(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coord: Coordinador) => {
    setEditingCoordinador(coord);
    setFormData({
      id: coord.id,
      nombre: coord.nombre,
      cargo: coord.cargo,
      orden: coord.orden ?? 1,
      foto_url: coord.foto_url || ''
    });
    setPreviewPhoto(coord.foto_url ? resolveDirectivoFotoUrl(coord.foto_url) : '');
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
      setPhotoError(`La imagen seleccionada supera los 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setPhotoError(null);
    setSaveError(null);
    setIsCompressing(true);

    try {
      // 1. Comprimir a formato WebP optimizado (400x400)
      const compressedDataUrl = await compressAndResizeImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85
      });

      setPreviewPhoto(compressedDataUrl);

      // 2. Subida directa al bucket 'directivos-fotos' de Supabase Storage
      if (isSupabaseConfigured()) {
        setIsUploadingToStorage(true);
        try {
          const res = await fetch(compressedDataUrl);
          const blob = await res.blob();
          const targetName = formData.nombre ? `coord_${formData.nombre}` : 'coordinador';
          const publicUrl = await uploadDirectivoPhoto(blob, targetName);

          if (publicUrl) {
            setFormData(prev => ({ ...prev, foto_url: publicUrl }));
            setPreviewPhoto(publicUrl);
          } else {
            setFormData(prev => ({ ...prev, foto_url: compressedDataUrl }));
          }
        } catch (storageErr) {
          console.warn('[Supabase Storage] Fallback a imagen local comprimida:', storageErr);
          setFormData(prev => ({ ...prev, foto_url: compressedDataUrl }));
        } finally {
          setIsUploadingToStorage(false);
        }
      } else {
        setFormData(prev => ({ ...prev, foto_url: compressedDataUrl }));
      }
    } catch (err: unknown) {
      console.error('Error al procesar la imagen:', err);
      const msg = err instanceof Error ? err.message : 'No se pudo procesar la imagen.';
      setPhotoError(msg);
    } finally {
      setIsCompressing(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, foto_url: url }));
    setPreviewPhoto(url ? resolveDirectivoFotoUrl(url) : '');
    setPhotoError(null);
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!formData.nombre.trim() || !formData.cargo.trim()) {
      setSaveError('Por favor completa los campos obligatorios: Nombre y Cargo del Coordinador.');
      return;
    }

    setIsSaving(true);

    try {
      const isEditing = Boolean(editingCoordinador && editingCoordinador.id);
      const targetId = isEditing && editingCoordinador?.id ? editingCoordinador.id : Date.now();

      const payload: Coordinador = {
        id: targetId,
        nombre: formData.nombre.trim(),
        cargo: formData.cargo.trim(),
        orden: Number(formData.orden || 1),
        foto_url: formData.foto_url.trim() || null
      };

      // Guardar o actualizar en Supabase table 'coordinadores'
      try {
        const supabasePayload: any = {
          nombre: payload.nombre,
          cargo: payload.cargo,
          orden: payload.orden,
          foto_url: payload.foto_url
        };

        if (isEditing) {
          supabasePayload.id = payload.id;
        }

        const { data, error } = await supabase
          .from('coordinadores')
          .upsert(supabasePayload, { onConflict: 'id' })
          .select();

        if (error) {
          console.warn("[Supabase] Advertencia al guardar coordinador en base de datos:", error.message);
        } else if (data && data.length > 0) {
          payload.id = Number(data[0].id);
        }

        setToastAlert({
          type: 'success',
          message: `Coordinador "${payload.nombre}" sincronizado correctamente.`
        });
        setTimeout(() => setToastAlert(null), 3500);
      } catch (sbErr) {
        console.warn("[Supabase] Error no bloqueante al persistir en Supabase:", sbErr);
      }

      if (isEditing) {
        onUpdateCoordinador(payload);
        setCoordinadoresList(prev => prev.map(c => c.id === payload.id ? payload : c));
      } else {
        onAddCoordinador(payload);
        setCoordinadoresList(prev => [...prev, payload]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error('Error al guardar coordinador:', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos del coordinador.';
      setSaveError(`No se pudieron guardar los cambios: ${msg}`);
      setToastAlert({
        type: 'error',
        message: msg
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('coordinadores')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn("[Supabase] Error al eliminar de tabla 'coordinadores':", error.message);
      }

      setToastAlert({
        type: 'success',
        message: "Coordinador eliminado correctamente."
      });
      setTimeout(() => setToastAlert(null), 3000);
    } catch (sbErr) {
      console.warn("[Supabase] Error no bloqueante al eliminar en Supabase:", sbErr);
    }

    onDeleteCoordinador(id);
    setCoordinadoresList(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
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
              {toastAlert.type === 'error' ? 'Alerta de Coordinación' : 'Operación Exitosa'}
            </p>
            <p className="mt-1 font-medium leading-relaxed">{toastAlert.message}</p>
          </div>
          <button
            onClick={() => setToastAlert(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/20 transition cursor-pointer"
            title="Cerrar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header y Estadísticas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#01913F]" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Coordinadores de Área
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-[75ch]">
            Administra los referentes pedagógicos y operativos de cada departamento institucional. Se reflejan en la pestaña 'Autoridades y Referentes' de la Misión 03.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <Users className="w-4 h-4 text-[#01913F]" />
            <span>{coordinadores?.length || 0} Registrados</span>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#01913F] hover:bg-[#007031] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Coordinador</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar coordinador por nombre o cargo..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F] shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grilla de Coordinadores */}
      {filteredCoordinadores.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron coordinadores</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchTerm 
              ? 'No hay registros que coincidan con la búsqueda. Intenta con otros términos.'
              : 'Aún no se han registrado coordinadores de área. Pulsa en "Nuevo Coordinador" para agregar el primero.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCoordinadores.map((coord) => {
            const hasPhoto = Boolean(coord.foto_url && coord.foto_url.trim().length > 0);
            const photoSrc = hasPhoto ? resolveDirectivoFotoUrl(coord.foto_url) : '';

            return (
              <div
                key={coord.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#CFB07A] hover:shadow-md transition flex flex-col justify-between group relative"
              >
                <div className="space-y-4">
                  {/* Cabecera con Foto / Avatar y Datos */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      {hasPhoto ? (
                        <img
                          src={photoSrc}
                          alt={coord.nombre}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#CFB07A] shadow-xs group-hover:scale-105 transition"
                        />
                      ) : (
                        <div 
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#01913F] via-[#00602A] to-[#003D1B] text-white flex items-center justify-center font-extrabold text-lg border-2 border-[#CFB07A] shadow-xs tracking-wider group-hover:scale-105 transition shrink-0 font-serif-title"
                          title={coord.nombre}
                        >
                          {getInitials(coord.nombre)}
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenEdit(coord)}
                        title="Cambiar foto o editar"
                        className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-[#01913F]" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DE4034] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          <ArrowUpDown className="w-3 h-3" />
                          <span>Orden #{coord.orden ?? 1}</span>
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate">
                        {coord.nombre}
                      </h3>
                      <p className="text-xs text-[#00602A] font-bold line-clamp-2 mt-0.5">
                        {coord.cargo}
                      </p>
                    </div>
                  </div>

                  {/* Detalle Operativo */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    Referente pedagógico y operativo del área, coordinando proyectos departamentales y vinculación académica.
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(coord)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-[#00875A] hover:text-white text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Datos</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(coord.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Eliminar coordinador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Confirmación de eliminación inline */}
                {deleteConfirmId === coord.id && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl p-5 flex flex-col justify-center items-center text-center z-10 space-y-3">
                    <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
                    <p className="text-xs font-bold text-slate-800">
                      ¿Confirmas eliminar al coordinador <span className="text-red-600 font-extrabold">{coord.nombre}</span>?
                    </p>
                    <div className="flex gap-2 w-full pt-1">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(coord.id)}
                        className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL AGREGAR / EDITAR COORDINADOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#CFB07A] space-y-6 my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#01913F]">
                  {editingCoordinador ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingCoordinador ? 'Editar Coordinador de Área' : 'Nuevo Coordinador de Área'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Los cambios se sincronizan en Supabase y se visualizan en la Misión 03.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selector de Foto con Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Foto del Coordinador (Opcional - Subir a Supabase Storage o URL)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    {previewPhoto ? (
                      <img
                        src={previewPhoto}
                        alt="Vista previa"
                        onError={() => setPhotoError('No se pudo cargar la vista previa.')}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-[#CFB07A] shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#01913F] via-[#00602A] to-[#003D1B] text-white flex items-center justify-center font-bold text-xl border-2 border-[#CFB07A] shadow-sm font-serif-title">
                        {getInitials(formData.nombre)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex border-b border-slate-200 text-xs font-bold gap-3">
                      <button
                        type="button"
                        onClick={() => setPhotoMode('upload')}
                        className={`pb-1.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                          photoMode === 'upload'
                            ? 'border-[#01913F] text-[#01913F]'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Imagen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhotoMode('url')}
                        className={`pb-1.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                          photoMode === 'url'
                            ? 'border-[#01913F] text-[#01913F]'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Enlace / URL</span>
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
                          className="w-full py-2.5 px-3 border-2 border-dashed border-slate-300 hover:border-[#01913F] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-600 hover:text-[#01913F] bg-white flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          {isCompressing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#01913F]" />
                              <span>Comprimiendo imagen...</span>
                            </>
                          ) : isUploadingToStorage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              <span>Subiendo a 'directivos-fotos'...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Seleccionar Imagen del Equipo</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Admite JPG, PNG o WebP. Se almacena directamente en el bucket 'directivos-fotos'.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={formData.foto_url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://... o nombre-foto.jpg"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Si no se proporciona foto, se mostrará el avatar institucional con sus iniciales.
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

              {/* Nombre y Orden */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Lic. Lucas Maidana"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Orden de Aparición <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.orden}
                    onChange={(e) => setFormData(prev => ({ ...prev, orden: parseInt(e.target.value, 10) || 1 }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>
              </div>

              {/* Cargo / Área */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Cargo / Área Institucional <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  list="cargos-coordinadores-sugeridos"
                  value={formData.cargo}
                  onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                  placeholder="Ej: Coordinador del Departamento de Lenguas Extranjeras & Bilingüe"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                />
                <datalist id="cargos-coordinadores-sugeridos">
                  {COMMON_CARGOS.map((c, i) => (
                    <option key={i} value={c} />
                  ))}
                </datalist>
              </div>

              {/* Error al guardar */}
              {saveError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
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
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="px-5 py-2.5 bg-[#01913F] hover:bg-[#007031] disabled:opacity-60 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingCoordinador ? 'Guardar Cambios' : 'Registrar Coordinador'}</span>
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
