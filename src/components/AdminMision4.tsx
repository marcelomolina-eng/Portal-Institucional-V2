import React, { useState, useRef, useEffect } from 'react';
import { CommitmentRule } from '../types';
import { 
  Compass, 
  Upload, 
  Save, 
  Check, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  Smile, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  RefreshCw, 
  Database,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  resolveMision4ImageUrl, 
  uploadMision4Image, 
  upsertMision4Compromiso, 
  fetchCommitmentRules,
  isSupabaseConfigured,
  MISION4_BUCKET_PUBLIC_URL 
} from '../lib/supabase';

interface AdminMision4Props {
  commitmentRules: CommitmentRule[];
  onUpdateCommitmentRule: (rule: CommitmentRule) => void;
  onUpdateAllRules?: (rules: CommitmentRule[]) => void;
}

export const AdminMision4: React.FC<AdminMision4Props> = ({
  commitmentRules,
  onUpdateCommitmentRule,
  onUpdateAllRules
}) => {
  // Estado local de los 6 compromisos ordenados
  const [rules, setRules] = useState<CommitmentRule[]>(() => {
    return [...commitmentRules].sort((a, b) => a.number - b.number);
  });

  // Archivos pendientes por número de compromiso (1 a 6)
  const [pendingFiles, setPendingFiles] = useState<Record<number, File>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});
  
  // Estados de guardado y feedback
  const [savingMap, setSavingMap] = useState<Record<number, boolean>>({});
  const [savedSuccessMap, setSavedSuccessMap] = useState<Record<number, boolean>>({});
  const [errorMessageMap, setErrorMessageMap] = useState<Record<number, string>>({});
  const [isReloading, setIsReloading] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Referencias a los inputs de archivo
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Sincronizar si las props cambian
  useEffect(() => {
    if (commitmentRules && commitmentRules.length > 0) {
      setRules([...commitmentRules].sort((a, b) => a.number - b.number));
    }
  }, [commitmentRules]);

  const getRuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-5 h-5 text-[#7A1C1C]" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-[#008751]" />;
      case 'Smile': return <Smile className="w-5 h-5 text-[#D4B26F]" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-[#1E3A8A]" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#7C3AED]" />;
      default: return <Sparkles className="w-5 h-5 text-[#EA580C]" />;
    }
  };

  // Manejar cambio en inputs de texto
  const handleFieldChange = (number: number, field: keyof CommitmentRule, value: any) => {
    setRules(prev => prev.map(r => r.number === number ? { ...r, [field]: value } : r));
    // Limpiar mensaje de éxito para indicar cambios pendientes
    setSavedSuccessMap(prev => ({ ...prev, [number]: false }));
  };

  // Manejar selección de nuevo archivo de imagen
  const handleFileSelect = (number: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessageMap(prev => ({ ...prev, [number]: 'El archivo debe ser una imagen válida (.jpg, .png, .webp)' }));
      return;
    }

    // Crear vista previa local inmediata
    const preview = URL.createObjectURL(file);
    setPendingFiles(prev => ({ ...prev, [number]: file }));
    setPreviewUrls(prev => ({ ...prev, [number]: preview }));
    setErrorMessageMap(prev => ({ ...prev, [number]: '' }));
    setSavedSuccessMap(prev => ({ ...prev, [number]: false }));
  };

  // Guardar un compromiso individual
  const handleSaveCommitment = async (number: number) => {
    const commitment = rules.find(r => r.number === number);
    if (!commitment) return;

    setSavingMap(prev => ({ ...prev, [number]: true }));
    setErrorMessageMap(prev => ({ ...prev, [number]: '' }));

    try {
      let finalImageUrl = commitment.image || `mision4-${number}.jpg`;

      // Si hay archivo seleccionado, subirlo primero a Supabase Storage
      const pendingFile = pendingFiles[number];
      if (pendingFile) {
        const uploadResult = await uploadMision4Image(pendingFile, number);
        finalImageUrl = uploadResult.publicUrl || uploadResult.fileName;
        // Limpiar archivo pendiente ya subido
        setPendingFiles(prev => {
          const next = { ...prev };
          delete next[number];
          return next;
        });
      }

      const updatedRule: CommitmentRule = {
        ...commitment,
        image: finalImageUrl
      };

      // Guardar en la tabla 'mision4_compromisos' de Supabase
      const savedRule = await upsertMision4Compromiso(updatedRule);

      // Notificar al componente superior
      onUpdateCommitmentRule(savedRule);

      // Actualizar estado local
      setRules(prev => prev.map(r => r.number === number ? savedRule : r));
      setSavedSuccessMap(prev => ({ ...prev, [number]: true }));

      setTimeout(() => {
        setSavedSuccessMap(prev => ({ ...prev, [number]: false }));
      }, 4000);
    } catch (err: any) {
      console.error(`Error al guardar compromiso #${number}:`, err);
      setErrorMessageMap(prev => ({
        ...prev,
        [number]: err?.message || 'Error al guardar los cambios en Supabase.'
      }));
    } finally {
      setSavingMap(prev => ({ ...prev, [number]: false }));
    }
  };

  // Guardar todos los compromisos en lote
  const handleSaveAll = async () => {
    setIsSavingAll(true);
    setGlobalMessage(null);

    try {
      const updatedList: CommitmentRule[] = [];

      for (const rule of rules) {
        let finalImageUrl = rule.image || `mision4-${rule.number}.jpg`;
        const pendingFile = pendingFiles[rule.number];
        if (pendingFile) {
          const uploadResult = await uploadMision4Image(pendingFile, rule.number);
          finalImageUrl = uploadResult.publicUrl || uploadResult.fileName;
        }

        const updatedRule: CommitmentRule = {
          ...rule,
          image: finalImageUrl
        };

        const saved = await upsertMision4Compromiso(updatedRule);
        onUpdateCommitmentRule(saved);
        updatedList.push(saved);
      }

      setPendingFiles({});
      setRules(updatedList);
      if (onUpdateAllRules) onUpdateAllRules(updatedList);

      setGlobalMessage({
        type: 'success',
        text: '¡Los 6 compromisos han sido actualizados y sincronizados exitosamente con Supabase!'
      });

      setTimeout(() => setGlobalMessage(null), 5000);
    } catch (err: any) {
      console.error('Error al guardar todos los compromisos:', err);
      setGlobalMessage({
        type: 'error',
        text: err?.message || 'Error al persistir cambios en Supabase.'
      });
    } finally {
      setIsSavingAll(false);
    }
  };

  // Recargar datos desde Supabase
  const handleReload = async () => {
    setIsReloading(true);
    setGlobalMessage(null);
    try {
      const freshRules = await fetchCommitmentRules();
      const sorted = [...freshRules].sort((a, b) => a.number - b.number);
      setRules(sorted);
      setPendingFiles({});
      setPreviewUrls({});
      if (onUpdateAllRules) onUpdateAllRules(sorted);
      setGlobalMessage({
        type: 'success',
        text: 'Datos actualizados directamente desde Supabase (tabla mision4_compromisos).'
      });
      setTimeout(() => setGlobalMessage(null), 3500);
    } catch (err) {
      console.error('Error al recargar desde Supabase:', err);
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#c2410c] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Misión 04: Mi Rol en Educar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Administración de los 6 Compromisos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Edita los títulos, mensajes destacados, descripciones y fotografías institucionales.
              Los cambios persisten en la tabla <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">mision4_compromisos</code> y las imágenes en el bucket público <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">mision4-imagenes</code>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="Recargar desde Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-[#00875A]' : ''}`} />
              <span>{isReloading ? 'Cargando...' : 'Recargar'}</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className="px-4 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#007031] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingAll ? 'Guardando todos...' : 'Guardar Todos los Cambios'}</span>
            </button>
          </div>
        </div>

        {/* Global notification */}
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

      {/* Grid de las 6 Tarjetas de Compromisos */}
      <div className="space-y-6">
        {rules.map((rule) => {
          const isSaving = !!savingMap[rule.number];
          const isSavedSuccess = !!savedSuccessMap[rule.number];
          const errorMessage = errorMessageMap[rule.number];
          const hasPendingFile = !!pendingFiles[rule.number];
          
          const currentDisplayPhoto = previewUrls[rule.number] || resolveMision4ImageUrl(rule.image || `mision4-${rule.number}.jpg`);

          return (
            <div
              key={rule.number}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 transition hover:border-slate-300"
            >
              {/* Header de la tarjeta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0">
                    {getRuleIcon(rule.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono uppercase tracking-wider text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-md">
                        Compromiso #{rule.number}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {rule.badge}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {rule.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasPendingFile && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      Imagen nueva lista para guardar
                    </span>
                  )}
                  {isSavedSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 animate-fadeIn">
                      <Check className="w-3.5 h-3.5" />
                      Guardado con éxito
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido en dos columnas: Izquierda (Imagen & Upload) | Derecha (Campos de Texto) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Columna Izquierda: Imagen y Selector de Archivo */}
                <div className="lg:col-span-4 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Fotografía Institucional
                  </label>

                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 border-2 border-slate-200 bg-slate-100 group shadow-2xs">
                    <img
                      src={currentDisplayPhoto}
                      alt={rule.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('docente_ingreso')) {
                          target.src = '/src/assets/images/docente_ingreso_colegio_1794425649449.jpg';
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {hasPendingFile && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        Vista previa nueva
                      </div>
                    )}
                  </div>

                  {/* Input de archivo oculto */}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[rule.number] = el;
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(rule.number, e)}
                    className="hidden"
                  />

                  {/* Botón de selección de archivo */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[rule.number]?.click()}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-4 h-4 text-[#00875A]" />
                      <span>{hasPendingFile ? 'Cambiar imagen seleccionada' : 'Seleccionar nueva imagen'}</span>
                    </button>

                    {/* Campo de URL / Nombre de imagen */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Ruta o nombre de archivo en bucket <code className="font-mono text-slate-600">mision4-imagenes</code>:
                      </span>
                      <input
                        type="text"
                        value={rule.image || `mision4-${rule.number}.jpg`}
                        onChange={(e) => handleFieldChange(rule.number, 'image', e.target.value)}
                        placeholder={`mision4-${rule.number}.jpg o https://...`}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00875A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Título, Mensaje Destacado y Descripción */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                      Título del Compromiso
                    </label>
                    <input
                      type="text"
                      value={rule.title}
                      onChange={(e) => handleFieldChange(rule.number, 'title', e.target.value)}
                      placeholder="Ej. Cada día comienza con nosotros"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs"
                    />
                  </div>

                  {/* Mensaje Destacado (Caja de resalte) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                      Mensaje Destacado (Frase inspiradora)
                    </label>
                    <textarea
                      rows={2}
                      value={rule.highlight}
                      onChange={(e) => handleFieldChange(rule.number, 'highlight', e.target.value)}
                      placeholder="Ej. La puntualidad no es solo un reloj que corre: es el respeto por el tiempo del otro..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-amber-900 font-medium bg-amber-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition shadow-2xs leading-relaxed"
                    />
                  </div>

                  {/* Descripción Institucional */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-1.5">
                      Descripción del Compromiso
                    </label>
                    <textarea
                      rows={3}
                      value={rule.description}
                      onChange={(e) => handleFieldChange(rule.number, 'description', e.target.value)}
                      placeholder="Texto descriptivo con pautas y expectativas de la institución..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00875A] transition shadow-2xs leading-relaxed"
                    />
                  </div>

                  {/* Frase destacada de cierre (Solo en Compromiso #6) */}
                  {rule.number === 6 && (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-[#CFB07A]/50 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#CFB07A] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Frase Destacada de Cierre del Recorrido</span>
                      </div>
                      <textarea
                        rows={2}
                        value={rule.closingQuote || 'No importa cuál sea tu función: tu manera de hacer las cosas también forma parte de nuestra identidad.'}
                        onChange={(e) => handleFieldChange(6, 'closingQuote', e.target.value)}
                        placeholder="Frase institucional de cierre..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 text-slate-100 border border-slate-700 text-xs sm:text-sm font-serif-title focus:outline-none focus:ring-2 focus:ring-[#CFB07A] leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Feedback de error */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Botón Guardar individual */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isSavedSuccess && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ¡Cambios guardados con éxito en Supabase!
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveCommitment(rule.number)}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#007031] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Guardando en Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Guardar Cambios</span>
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
