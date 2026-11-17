import React, { useEffect, useRef, useState } from 'react';
import { InitiativeItem } from '../types';
import {
  Video,
  Upload,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Link2,
  UserCheck,
  Hash,
  Sparkles,
  Trash2
} from 'lucide-react';
import {
  fetchInitiatives,
  upsertMision2Iniciativa,
  uploadMision2Video
} from '../lib/supabase';
import { parseVideoSource } from '../utils/video';

interface AdminMision2Props {
  initiatives: InitiativeItem[];
  onUpdateInitiative: (initiative: InitiativeItem) => void;
  onUpdateAllInitiatives?: (initiatives: InitiativeItem[]) => void;
}

export const AdminMision2: React.FC<AdminMision2Props> = ({
  initiatives,
  onUpdateInitiative,
  onUpdateAllInitiatives
}) => {
  const [items, setItems] = useState<InitiativeItem[]>(() =>
    [...initiatives].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  );

  // Estado de subida de videos y progreso por ID
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number | null>>({});
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});
  const [savedSuccessMap, setSavedSuccessMap] = useState<Record<string, boolean>>({});
  const [errorMessageMap, setErrorMessageMap] = useState<Record<string, string>>({});
  const [isReloading, setIsReloading] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (initiatives && initiatives.length > 0) {
      setItems([...initiatives].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
    }
  }, [initiatives]);

  const handleFieldChange = (id: string, field: keyof InitiativeItem, value: string | number) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
    setSavedSuccessMap(prev => ({ ...prev, [id]: false }));
    setErrorMessageMap(prev => ({ ...prev, [id]: '' }));
  };

  // Subir archivo MP4 / WebM directamente al bucket 'mision2-videos' con progreso
  const handleVideoFileSelect = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isValidVideo =
      file.type === 'video/mp4' ||
      file.type === 'video/webm' ||
      lowerName.endsWith('.mp4') ||
      lowerName.endsWith('.webm');

    if (!isValidVideo) {
      setErrorMessageMap(prev => ({
        ...prev,
        [id]: 'Formato no compatible. Por favor selecciona un video .mp4 o .webm.'
      }));
      e.target.value = '';
      return;
    }

    setUploadingMap(prev => ({ ...prev, [id]: true }));
    setUploadProgressMap(prev => ({ ...prev, [id]: 0 }));
    setErrorMessageMap(prev => ({ ...prev, [id]: '' }));
    setSavedSuccessMap(prev => ({ ...prev, [id]: false }));

    try {
      const { publicUrl } = await uploadMision2Video(file, id, (percent) => {
        setUploadProgressMap(prev => ({ ...prev, [id]: percent }));
      });

      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, videoUrl: publicUrl } : item))
      );

      setUploadProgressMap(prev => ({ ...prev, [id]: 100 }));
      setTimeout(() => {
        setUploadProgressMap(prev => ({ ...prev, [id]: null }));
      }, 2000);
    } catch (err: any) {
      console.error(`Error subiendo video para ${id}:`, err);
      setErrorMessageMap(prev => ({
        ...prev,
        [id]: err?.message || 'Error al subir el video a Supabase Storage.'
      }));
      setUploadProgressMap(prev => ({ ...prev, [id]: null }));
    } finally {
      setUploadingMap(prev => ({ ...prev, [id]: false }));
      e.target.value = '';
    }
  };

  const handleSaveItem = async (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;

    if (!target.title.trim() || !target.referent.trim() || !target.category.trim()) {
      setErrorMessageMap(prev => ({
        ...prev,
        [id]: 'Categoría, título y referente son campos obligatorios.'
      }));
      return;
    }

    setSavingMap(prev => ({ ...prev, [id]: true }));
    setErrorMessageMap(prev => ({ ...prev, [id]: '' }));

    try {
      const saved = await upsertMision2Iniciativa(target);
      onUpdateInitiative(saved);

      setItems(prev =>
        prev
          .map(item => (item.id === id ? saved : item))
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      );
      setSavedSuccessMap(prev => ({ ...prev, [id]: true }));

      setTimeout(() => {
        setSavedSuccessMap(prev => ({ ...prev, [id]: false }));
      }, 4000);
    } catch (err: any) {
      console.error(`Error al guardar iniciativa ${id}:`, err);
      setErrorMessageMap(prev => ({
        ...prev,
        [id]: err?.message || 'No se pudieron guardar los cambios en Supabase.'
      }));
    } finally {
      setSavingMap(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    setGlobalMessage(null);

    try {
      const savedList: InitiativeItem[] = [];
      for (const item of items) {
        const saved = await upsertMision2Iniciativa(item);
        onUpdateInitiative(saved);
        savedList.push(saved);
      }

      const sorted = [...savedList].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setItems(sorted);
      if (onUpdateAllInitiatives) onUpdateAllInitiatives(sorted);

      setGlobalMessage({
        type: 'success',
        text: '¡Todas las iniciativas de Misión 02 han sido guardadas y sincronizadas con Supabase!'
      });
      setTimeout(() => setGlobalMessage(null), 5000);
    } catch (err: any) {
      console.error('Error al guardar todas las iniciativas:', err);
      setGlobalMessage({
        type: 'error',
        text: err?.message || 'Error al guardar las iniciativas en Supabase.'
      });
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    setGlobalMessage(null);
    try {
      const fresh = await fetchInitiatives();
      const sorted = [...fresh].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setItems(sorted);
      if (onUpdateAllInitiatives) onUpdateAllInitiatives(sorted);
      setGlobalMessage({
        type: 'success',
        text: 'Datos recargados desde Supabase (tabla mision2_iniciativas).'
      });
      setTimeout(() => setGlobalMessage(null), 3500);
    } catch (err) {
      console.error('Error recargando iniciativas:', err);
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#00602A] text-xs font-bold uppercase tracking-wider">
              <Video className="w-3.5 h-3.5" />
              <span>Misión 02: Esencia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Iniciativas que nos definen (Videos y Referentes)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Administra categoría, título, referente, orden y video explicativo de cada iniciativa. Los datos persisten en la tabla{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">mision2_iniciativas</code> y los archivos en el bucket público{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">mision2-videos</code>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleReload}
              disabled={isReloading}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-[#00875A]' : ''}`} />
              <span>{isReloading ? 'Cargando...' : 'Recargar'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className="px-4 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#007031] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingAll ? 'Guardando todos...' : 'Guardar Todos los Cambios'}</span>
            </button>
          </div>
        </div>

        {globalMessage && (
          <div
            className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
              globalMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {globalMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{globalMessage.text}</span>
          </div>
        )}
      </div>

      {/* Lista de tarjetas editables */}
      <div className="space-y-6">
        {items.map((item) => {
          const isUploading = !!uploadingMap[item.id];
          const uploadProgress = uploadProgressMap[item.id];
          const isSaving = !!savingMap[item.id];
          const isSavedSuccess = !!savedSuccessMap[item.id];
          const errorMessage = errorMessageMap[item.id];
          const parsedVideo = parseVideoSource(item.videoUrl);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 transition hover:border-slate-300"
            >
              {/* Header de la tarjeta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 font-bold text-sm font-mono"
                    style={{ backgroundColor: item.accentColor || '#008751' }}
                  >
                    #{item.order ?? '-'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#00602A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {item.category || 'Sin categoría'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        ID: {item.id}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSavedSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 animate-fadeIn">
                      <Check className="w-3.5 h-3.5" />
                      Guardado con éxito
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido en 2 columnas: Izquierda (Vista Previa + Upload) | Derecha (Campos) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Columna Izquierda: Vista Previa del Video & Subida */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Vista Previa de Video (16:9)
                    </label>
                    {item.videoUrl && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange(item.id, 'videoUrl', '')}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                        title="Quitar video asignado"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Quitar video</span>
                      </button>
                    )}
                  </div>

                  <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 shadow-2xs">
                    {parsedVideo.type === 'direct' && (
                      <video
                        key={parsedVideo.src}
                        src={parsedVideo.src}
                        controls
                        preload="metadata"
                        playsInline
                        autoPlay={false}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {(parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo') && (
                      <iframe
                        key={parsedVideo.embedUrl}
                        src={parsedVideo.embedUrl}
                        title={`Vista previa: ${item.title}`}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    )}

                    {parsedVideo.type === 'none' && (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <Video className="w-8 h-8 text-slate-500" />
                        <p className="text-xs font-semibold text-slate-300">
                          Sin video cargado
                        </p>
                        <p className="text-[11px] text-slate-400">
                          En el portal se mostrará: &ldquo;Video de presentación próximamente&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Input oculto para subir archivo MP4/WebM */}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[item.id] = el;
                    }}
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => handleVideoFileSelect(item.id, e)}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRefs.current[item.id]?.click()}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-[#00875A] bg-slate-50 hover:bg-emerald-50/40 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-[#00875A] animate-spin" />
                        <span>Subiendo video ({uploadProgress ?? 0}%)...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#00875A]" />
                        <span>Subir video (.mp4 / .webm) a Supabase</span>
                      </>
                    )}
                  </button>

                  {/* Barra de progreso de subida */}
                  {uploadProgress !== null && uploadProgress !== undefined && (
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-[#00875A] transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-mono text-emerald-700 text-right font-bold">
                        {uploadProgress === 100 ? '¡Video subido! Haz clic en Guardar cambios.' : `Subiendo: ${uploadProgress}%`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Columna Derecha: Edición de Campos */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                        Categoría
                      </label>
                      <div className="relative">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                          placeholder="Ej. Cultura & Personas"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                        Orden
                      </label>
                      <div className="relative">
                        <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          min={1}
                          value={item.order ?? 1}
                          onChange={(e) =>
                            handleFieldChange(item.id, 'order', Math.max(1, Number(e.target.value) || 1))
                          }
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                      Título de la iniciativa
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleFieldChange(item.id, 'title', e.target.value)}
                      placeholder="Ej. Wellness & Bienestar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                      Nombre del referente
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={item.referent}
                        onChange={(e) => handleFieldChange(item.id, 'referent', e.target.value)}
                        placeholder="Ej. Natali Miño"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                      URL del video (YouTube, Vimeo o archivo en bucket mision2-videos)
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={item.videoUrl || ''}
                        onChange={(e) => handleFieldChange(item.id, 'videoUrl', e.target.value)}
                        placeholder="https://youtube.com/watch?v=... o nombre-archivo.mp4"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isSavedSuccess && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ¡Cambios guardados con éxito!
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveItem(item.id)}
                      disabled={isSaving || isUploading}
                      className="px-5 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#007031] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Guardar cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
