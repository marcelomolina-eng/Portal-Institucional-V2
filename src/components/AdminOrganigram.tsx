import React, { useState } from 'react';
import { OrganigramLevel, OrganigramNode, OrganigramMember, Authority } from '../types';
import { 
  Building, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Users, 
  Layers, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  Eye, 
  Palette,
  UserCheck,
  UserPlus
} from 'lucide-react';

interface AdminOrganigramProps {
  levels: OrganigramLevel[];
  onUpdateLevels: (newLevels: OrganigramLevel[]) => void;
  availableAuthorities: Authority[];
}

const PRESET_COLORS = [
  { name: 'Rojo Carmesí (Escudo)', value: '#DE4034' },
  { name: 'Verde Institucional (Escudo)', value: '#01913F' },
  { name: 'Dorado Arena (Escudo)', value: '#CFB07A' },
  { name: 'Azul Conducción', value: '#1E3A8A' },
  { name: 'Púrpura Valores', value: '#7C3AED' },
  { name: 'Naranja STEAM', value: '#EA580C' },
  { name: 'Celeste EdTech', value: '#0284C7' },
  { name: 'Pizarra Operativa', value: '#334155' }
];

export const AdminOrganigram: React.FC<AdminOrganigramProps> = ({
  levels,
  onUpdateLevels,
  availableAuthorities
}) => {
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  
  // Modals state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<OrganigramLevel | null>(null);
  const [levelFormData, setLevelFormData] = useState({
    levelName: '',
    badge: '',
    description: '',
    color: PRESET_COLORS[0].value
  });

  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [targetLevelId, setTargetLevelId] = useState<string>('');
  const [editingNode, setEditingNode] = useState<OrganigramNode | null>(null);
  const [nodeFormData, setNodeFormData] = useState<{
    id: string;
    title: string;
    subtitle: string;
    colorTheme: string;
    description: string;
    responsibles: OrganigramMember[];
  }>({
    id: '',
    title: '',
    subtitle: '',
    colorTheme: PRESET_COLORS[0].value,
    description: '',
    responsibles: []
  });

  // Assign member helper state
  const [selectedAuthId, setSelectedAuthId] = useState<string>('');
  const [customMember, setCustomMember] = useState({ name: '', role: '', email: '' });
  const [memberMode, setMemberMode] = useState<'fromAuthorities' | 'custom'>('fromAuthorities');

  // Confirmation state
  const [deleteLevelConfirmId, setDeleteLevelConfirmId] = useState<string | null>(null);
  const [deleteNodeConfirm, setDeleteNodeConfirm] = useState<{ levelId: string; nodeId: string } | null>(null);

  // LEVEL CRUD
  const handleOpenCreateLevel = () => {
    setEditingLevel(null);
    const nextNum = levels.length + 1;
    setLevelFormData({
      levelName: `Nivel ${nextNum}: Nueva Área Jerárquica`,
      badge: `Nivel ${nextNum}`,
      description: 'Descripción de alcance y funciones del nivel',
      color: PRESET_COLORS[nextNum % PRESET_COLORS.length].value
    });
    setIsLevelModalOpen(true);
  };

  const handleOpenEditLevel = (lvl: OrganigramLevel) => {
    setEditingLevel(lvl);
    setLevelFormData({
      levelName: lvl.levelName,
      badge: lvl.badge,
      description: lvl.description || '',
      color: lvl.color || PRESET_COLORS[0].value
    });
    setIsLevelModalOpen(true);
  };

  const handleSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!levelFormData.levelName.trim()) return;

    if (editingLevel) {
      const updated = levels.map(l => {
        if (l.id === editingLevel.id) {
          return {
            ...l,
            levelName: levelFormData.levelName.trim(),
            badge: levelFormData.badge.trim() || `NIVEL ${l.levelNumber}`,
            description: levelFormData.description.trim(),
            color: levelFormData.color
          };
        }
        return l;
      });
      onUpdateLevels(updated);
    } else {
      const newLvl: OrganigramLevel = {
        id: `lvl-${Date.now()}`,
        levelNumber: levels.length + 1,
        levelName: levelFormData.levelName.trim(),
        badge: levelFormData.badge.trim() || `NIVEL ${levels.length + 1}`,
        description: levelFormData.description.trim(),
        color: levelFormData.color,
        nodes: []
      };
      onUpdateLevels([...levels, newLvl]);
    }
    setIsLevelModalOpen(false);
  };

  const handleDeleteLevel = (id: string) => {
    const updated = levels
      .filter(l => l.id !== id)
      .map((l, idx) => ({ ...l, levelNumber: idx + 1 }));
    onUpdateLevels(updated);
    setDeleteLevelConfirmId(null);
  };

  const handleMoveLevel = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === levels.length - 1)
    ) {
      return;
    }

    const newLevels = [...levels];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newLevels[index];
    newLevels[index] = newLevels[targetIdx];
    newLevels[targetIdx] = temp;

    // Recalculate level numbers
    const reordered = newLevels.map((l, idx) => ({
      ...l,
      levelNumber: idx + 1
    }));
    onUpdateLevels(reordered);
  };

  // NODE / AREA CRUD
  const handleOpenCreateNode = (levelId: string) => {
    setTargetLevelId(levelId);
    setEditingNode(null);
    const parentLevel = levels.find(l => l.id === levelId);
    setNodeFormData({
      id: `node-${Date.now()}`,
      title: '',
      subtitle: '',
      colorTheme: parentLevel?.color || PRESET_COLORS[0].value,
      description: '',
      responsibles: []
    });
    setSelectedAuthId('');
    setCustomMember({ name: '', role: '', email: '' });
    setIsNodeModalOpen(true);
  };

  const handleOpenEditNode = (levelId: string, node: OrganigramNode) => {
    setTargetLevelId(levelId);
    setEditingNode(node);
    setNodeFormData({
      id: node.id,
      title: node.title,
      subtitle: node.subtitle || '',
      colorTheme: node.colorTheme || PRESET_COLORS[0].value,
      description: node.description || '',
      responsibles: [...node.responsibles]
    });
    setSelectedAuthId('');
    setCustomMember({ name: '', role: '', email: '' });
    setIsNodeModalOpen(true);
  };

  const handleAddResponsibleFromAuthorities = () => {
    if (!selectedAuthId) return;
    const auth = availableAuthorities.find(a => a.id === selectedAuthId);
    if (!auth) return;

    if (nodeFormData.responsibles.some(r => r.name.toLowerCase() === auth.name.toLowerCase())) {
      alert('Esta persona ya está asignada a esta área.');
      return;
    }

    const newMember: OrganigramMember = {
      id: auth.id,
      name: auth.name,
      role: auth.role,
      photoUrl: auth.photoUrl,
      email: auth.email
    };

    setNodeFormData(prev => ({
      ...prev,
      responsibles: [...prev.responsibles, newMember]
    }));
    setSelectedAuthId('');
  };

  const handleAddCustomResponsible = () => {
    if (!customMember.name.trim() || !customMember.role.trim()) {
      alert('Ingresa al menos Nombre y Cargo del responsable.');
      return;
    }

    const newMember: OrganigramMember = {
      id: `custom-${Date.now()}`,
      name: customMember.name.trim(),
      role: customMember.role.trim(),
      email: customMember.email.trim()
    };

    setNodeFormData(prev => ({
      ...prev,
      responsibles: [...prev.responsibles, newMember]
    }));
    setCustomMember({ name: '', role: '', email: '' });
  };

  const handleRemoveResponsible = (id: string) => {
    setNodeFormData(prev => ({
      ...prev,
      responsibles: prev.responsibles.filter(r => r.id !== id)
    }));
  };

  const handleSaveNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeFormData.title.trim()) return;

    const payload: OrganigramNode = {
      id: nodeFormData.id || `node-${Date.now()}`,
      title: nodeFormData.title.trim(),
      subtitle: nodeFormData.subtitle.trim(),
      colorTheme: nodeFormData.colorTheme,
      description: nodeFormData.description.trim(),
      responsibles: nodeFormData.responsibles
    };

    const updatedLevels = levels.map(lvl => {
      if (lvl.id === targetLevelId) {
        if (editingNode) {
          return {
            ...lvl,
            nodes: lvl.nodes.map(n => n.id === editingNode.id ? payload : n)
          };
        } else {
          return {
            ...lvl,
            nodes: [...lvl.nodes, payload]
          };
        }
      }
      return lvl;
    });

    onUpdateLevels(updatedLevels);
    setIsNodeModalOpen(false);
  };

  const handleDeleteNode = (levelId: string, nodeId: string) => {
    const updated = levels.map(lvl => {
      if (lvl.id === levelId) {
        return {
          ...lvl,
          nodes: lvl.nodes.filter(n => n.id !== nodeId)
        };
      }
      return lvl;
    });
    onUpdateLevels(updated);
    setDeleteNodeConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header del Módulo con Tabs de Vista */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Estructura Jerárquica & Organigrama
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crea niveles de decisión (Representación Legal → Dirección → Secretarías → Departamentos) y asigna responsables a cada área.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch Modo Editor / Vista Previa */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Editor de Estructura</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-white text-[#01913F] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa en Vivo</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreateLevel}
            className="px-4 py-2 bg-[#DE4034] hover:bg-[#c7352a] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Nivel</span>
          </button>
        </div>
      </div>

      {/* MODO VISTA PREVIA */}
      {viewMode === 'preview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#01913F]" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Vista Previa del Organigrama en la Misión 03
              </h3>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
              Sincronizado con la vista pública
            </span>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto py-2">
            {levels
              .slice()
              .sort((a, b) => a.levelNumber - b.levelNumber)
              .map((level, levelIdx, arr) => (
                <div key={level.id} className="relative">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: level.color || '#DE4034' }}
                        />
                        <span 
                          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white font-mono"
                          style={{ backgroundColor: level.color || '#DE4034' }}
                        >
                          {level.badge}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">{level.levelName}</h4>
                      </div>
                      <span className="text-xs text-slate-400 italic hidden sm:inline whitespace-pre-wrap">{level.description}</span>
                    </div>

                    <div className={`grid gap-4 ${
                      level.nodes.length === 1 
                        ? 'grid-cols-1 max-w-md mx-auto' 
                        : level.nodes.length === 2 
                          ? 'grid-cols-1 sm:grid-cols-2' 
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {level.nodes.map(node => (
                        <div 
                          key={node.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5"
                          style={{ borderTop: `4px solid ${node.colorTheme || level.color || '#DE4034'}` }}
                        >
                          <span 
                            className="text-[10px] font-bold uppercase tracking-wider block"
                            style={{ color: node.colorTheme || level.color || '#DE4034' }}
                          >
                            {node.subtitle || 'Área'}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm leading-snug">{node.title}</h5>
                          {node.description && (
                            <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{node.description}</p>
                          )}
                          {node.responsibles.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 space-y-1.5">
                              {node.responsibles.map(m => (
                                <div key={m.id} className="flex items-center gap-2.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                  {m.photoUrl ? (
                                    <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-[#CFB07A]" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                                      {m.name.charAt(0)}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 truncate">{m.name}</p>
                                    <p className="text-[10px] text-[#01913F] truncate">{m.role}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {levelIdx < arr.length - 1 && (
                    <div className="flex flex-col items-center justify-center my-2">
                      <div className="w-0.5 h-6 bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#CFB07A] border-2 border-white shadow-xs" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODO EDITOR DE ESTRUCTURA */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          {levels.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Building className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">No hay niveles en el organigrama</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Comienza agregando el primer nivel jerárquico (ej: Representación Legal / Conducción Superior).
              </p>
              <button
                onClick={handleOpenCreateLevel}
                className="px-4 py-2 bg-[#DE4034] text-white text-xs font-bold rounded-xl"
              >
                + Crear Primer Nivel
              </button>
            </div>
          ) : (
            levels
              .slice()
              .sort((a, b) => a.levelNumber - b.levelNumber)
              .map((level, levelIdx) => (
                <div
                  key={level.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs overflow-hidden transition"
                >
                  {/* Barra Superior del Nivel */}
                  <div 
                    className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    style={{ borderLeft: `6px solid ${level.color || '#DE4034'}` }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Controles de Reordenamiento */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          disabled={levelIdx === 0}
                          onClick={() => handleMoveLevel(levelIdx, 'up')}
                          className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none border border-slate-200 transition"
                          title="Subir Nivel Jerárquico"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={levelIdx === levels.length - 1}
                          onClick={() => handleMoveLevel(levelIdx, 'down')}
                          className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none border border-slate-200 transition"
                          title="Bajar Nivel Jerárquico"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white font-mono"
                            style={{ backgroundColor: level.color || '#DE4034' }}
                          >
                            {level.badge || `NIVEL ${level.levelNumber}`}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                            {level.levelName}
                          </h3>
                        </div>
                        {level.description && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {level.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleOpenCreateNode(level.id)}
                        className="px-3 py-1.5 bg-[#01913F] hover:bg-[#017a35] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Área / Cargo</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditLevel(level)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                        title="Editar nombre y color del nivel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteLevelConfirmId(level.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar este nivel jerárquico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Confirmación de eliminación de Nivel */}
                  {deleteLevelConfirmId === level.id && (
                    <div className="p-4 bg-red-50 border-b border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-red-700 font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>¿Seguro que deseas eliminar este nivel completo y todas sus áreas ({level.nodes.length})?</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteLevelConfirmId(null)}
                          className="px-3 py-1 bg-white text-slate-700 rounded-lg font-bold border border-slate-200 hover:bg-slate-100"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDeleteLevel(level.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                        >
                          Confirmar Eliminación
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lista de Áreas / Nodos de este Nivel */}
                  <div className="p-5">
                    {level.nodes.length === 0 ? (
                      <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                        <p>No hay áreas asignadas en este nivel todavía.</p>
                        <button
                          onClick={() => handleOpenCreateNode(level.id)}
                          className="mt-2 text-[#01913F] font-bold hover:underline"
                        >
                          + Añadir primera área
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {level.nodes.map((node) => (
                          <div
                            key={node.id}
                            className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-3"
                            style={{ borderTop: `4px solid ${node.colorTheme || level.color || '#DE4034'}` }}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <span 
                                  className="text-[10px] font-bold uppercase tracking-wider"
                                  style={{ color: node.colorTheme || level.color || '#DE4034' }}
                                >
                                  {node.subtitle || 'Área'}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleOpenEditNode(level.id, node)}
                                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded transition"
                                    title="Editar área"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteNodeConfirm({ levelId: level.id, nodeId: node.id })}
                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                    title="Eliminar área"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                                {node.title}
                              </h4>

                              {node.description && (
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                                  {node.description}
                                </p>
                              )}
                            </div>

                            {/* Personas / Responsables asignados */}
                            <div className="pt-2 border-t border-slate-200/60 space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>Personal ({node.responsibles.length})</span>
                                <button
                                  onClick={() => handleOpenEditNode(level.id, node)}
                                  className="text-[#01913F] hover:underline flex items-center gap-0.5"
                                >
                                  <Plus className="w-2.5 h-2.5" /> Asignar
                                </button>
                              </div>

                              {node.responsibles.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic">
                                  Sin responsables asignados aún.
                                </p>
                              ) : (
                                <div className="space-y-1.5">
                                  {node.responsibles.map((m) => (
                                    <div 
                                      key={m.id}
                                      className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200/80 text-xs"
                                    >
                                      {m.photoUrl ? (
                                        <img 
                                          src={m.photoUrl} 
                                          alt={m.name} 
                                          className="w-7 h-7 rounded-full object-cover border border-[#CFB07A] shrink-0"
                                        />
                                      ) : (
                                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                                          {m.name.charAt(0)}
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 text-[11px] truncate">{m.name}</p>
                                        <p className="text-[10px] text-[#01913F] truncate">{m.role}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Confirmación eliminación de nodo */}
                            {deleteNodeConfirm?.levelId === level.id && deleteNodeConfirm?.nodeId === node.id && (
                              <div className="p-2 bg-red-50 rounded-lg text-center space-y-1.5 text-xs">
                                <p className="text-red-700 font-bold text-[11px]">¿Eliminar esta área?</p>
                                <div className="flex gap-1 justify-center">
                                  <button
                                    onClick={() => setDeleteNodeConfirm(null)}
                                    className="px-2 py-0.5 bg-white text-slate-600 rounded text-[10px] font-bold border"
                                  >
                                    No
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNode(level.id, node.id)}
                                    className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                                  >
                                    Sí, eliminar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* MODAL CREAR / EDITAR NIVEL */}
      {isLevelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#CFB07A] space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#DE4034] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingLevel ? 'Editar Nivel Jerárquico' : 'Nuevo Nivel Jerárquico'}
                </h3>
              </div>
              <button onClick={() => setIsLevelModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLevel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Nombre del Nivel Jerárquico <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={levelFormData.levelName}
                  onChange={(e) => setLevelFormData(prev => ({ ...prev, levelName: e.target.value }))}
                  placeholder="Ej: Representación Legal & Conducción Superior"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Etiqueta / Insignia de Nivel
                </label>
                <input
                  type="text"
                  value={levelFormData.badge}
                  onChange={(e) => setLevelFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="Ej: Nivel 1 • Conducción Superior"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE4034]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Descripción / Alcance General (Soporta múltiples párrafos)
                </label>
                <textarea
                  rows={3}
                  value={levelFormData.description}
                  onChange={(e) => setLevelFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe la función central de este nivel en el colegio..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE4034] resize-y font-sans whitespace-pre-wrap"
                />
              </div>

              {/* Selector de color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Color Identificador Institucional
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setLevelFormData(prev => ({ ...prev, color: c.value }))}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                        levelFormData.color === c.value
                          ? 'border-slate-800 ring-2 ring-slate-800/20 bg-slate-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: c.value }} />
                      <span className="text-[10px] font-bold text-slate-700 truncate">{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLevelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DE4034] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#c7352a]"
                >
                  {editingLevel ? 'Guardar Cambios' : 'Crear Nivel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR ÁREA / NODO */}
      {isNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#CFB07A] space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#01913F] flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingNode ? 'Editar Área / Cargo' : 'Nueva Área / Cargo Institucional'}
                </h3>
              </div>
              <button onClick={() => setIsNodeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNode} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Título del Área / Cargo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nodeFormData.title}
                    onChange={(e) => setNodeFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Dirección Académica Institucional"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Subtítulo / Alcance
                  </label>
                  <input
                    type="text"
                    value={nodeFormData.subtitle}
                    onChange={(e) => setNodeFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Ej: Nivel Inicial, Primario y Secundario"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Descripción o Funciones del Área (Soporta múltiples párrafos)
                </label>
                <textarea
                  rows={3}
                  value={nodeFormData.description}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Supervisión curricular, proyectos ABP, acompañamiento docente y vínculo con familias..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F] resize-y font-sans whitespace-pre-wrap"
                />
              </div>

              {/* Selector de color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Color Temático del Área
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNodeFormData(prev => ({ ...prev, colorTheme: c.value }))}
                      className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                        nodeFormData.colorTheme === c.value
                          ? 'border-slate-800 ring-2 ring-slate-800/20 font-bold bg-slate-50'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                      <span>{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECCIÓN ASIGNACIÓN DE PERSONAL */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#01913F]" />
                    <span>Personal Asignado a esta Área ({nodeFormData.responsibles.length})</span>
                  </label>

                  <div className="flex text-[11px] font-bold gap-2">
                    <button
                      type="button"
                      onClick={() => setMemberMode('fromAuthorities')}
                      className={`px-2 py-0.5 rounded transition ${
                        memberMode === 'fromAuthorities' ? 'bg-[#01913F] text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Desde Directivos
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemberMode('custom')}
                      className={`px-2 py-0.5 rounded transition ${
                        memberMode === 'custom' ? 'bg-[#01913F] text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Personalizado
                    </button>
                  </div>
                </div>

                {/* Sub-formulario: Desde Directivos */}
                {memberMode === 'fromAuthorities' ? (
                  <div className="flex gap-2">
                    <select
                      value={selectedAuthId}
                      onChange={(e) => setSelectedAuthId(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01913F]"
                    >
                      <option value="">-- Seleccionar directivo registrado --</option>
                      {availableAuthorities.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.role})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedAuthId}
                      onClick={handleAddResponsibleFromAuthorities}
                      className="px-3 py-1.5 bg-[#01913F] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Asignar
                    </button>
                  </div>
                ) : (
                  /* Sub-formulario: Personalizado */
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={customMember.name}
                        onChange={(e) => setCustomMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre completo"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={customMember.role}
                        onChange={(e) => setCustomMember(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="Cargo en el área"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={customMember.email}
                        onChange={(e) => setCustomMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Correo institucional (opcional)"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomResponsible}
                        className="px-3 py-1.5 bg-[#01913F] text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de responsables ya agregados en este nodo */}
                <div className="space-y-1.5 pt-1">
                  {nodeFormData.responsibles.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover border border-[#CFB07A] shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 truncate">
                          <p className="font-bold text-slate-900 truncate">{member.name}</p>
                          <p className="text-[10px] text-[#01913F] truncate">{member.role}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveResponsible(member.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                        title="Desvincular del área"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción modal */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNodeModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#01913F] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#017a35]"
                >
                  {editingNode ? 'Guardar Cambios del Área' : 'Registrar Área'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
