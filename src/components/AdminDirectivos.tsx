import React, { useState, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState<Authority | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter authorities
  const filteredAuthorities = authorities.filter(auth => {
    const matchesSearch = 
      auth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = selectedArea === 'todos' || auth.area === selectedArea;

    return matchesSearch && matchesArea;
  });

  // Unique areas present in list
  const uniqueAreas = Array.from(new Set(authorities.map(a => a.area)));

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
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('La imagen supera los 5 MB. Te recomendamos una imagen menor para optimizar la velocidad.');
      return;
    }

    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, photoUrl: result }));
      setPreviewPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrl: url }));
    setPreviewPhoto(url);
    setPhotoError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim()) {
      alert('Por favor completa los campos obligatorios: Nombre, Cargo y Correo institucional.');
      return;
    }

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

    if (editingAuthority) {
      onUpdateAuthority(authorityPayload);
    } else {
      onAddAuthority(authorityPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onDeleteAuthority(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
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
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-3 border-2 border-dashed border-slate-300 hover:border-[#01913F] rounded-xl text-xs font-bold text-slate-600 hover:text-[#01913F] bg-white flex items-center justify-center gap-2 transition"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Seleccionar Imagen de la Computadora</span>
                        </button>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Admite JPG, PNG o WebP. La imagen se almacena de forma persistente.
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

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#DE4034] hover:bg-[#c7352a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingAuthority ? 'Guardar Cambios' : 'Registrar Directivo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
