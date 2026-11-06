import { useState, useEffect, useCallback, useMemo } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';
import { MissionId } from '../types';

export interface MissionProgressInfo {
  id: MissionId;
  number: string;
  code: string;
  title: string;
  subtitle: string;
  desc: string;
  isCompleted: boolean;
}

export const REQUIRED_MISSION_IDS: MissionId[] = ['mision1', 'mision2', 'mision3'];

export const MISSION_METADATA: Record<string, { code: string; title: string; subtitle: string; desc: string }> = {
  mision1: {
    code: 'Misión 01',
    title: 'Identidad Institucional',
    subtitle: 'Nuestra Identidad Institucional',
    desc: 'Historia del colegio, blasón Verita Vinci, misión, visión y valores fundacionales.'
  },
  mision2: {
    code: 'Misión 02',
    title: 'Esencia en Acción',
    subtitle: 'Nuestra Esencia en Acción',
    desc: 'Las 8 iniciativas pilares (Robótica, IA, Wellness, STEAM) y el Calendario Anual 2026.'
  },
  mision3: {
    code: 'Misión 03',
    title: 'Comunidad Educativa',
    subtitle: 'Nuestra Comunidad Educativa',
    desc: 'Organigrama institucional, autoridades de conducción y canales oficiales de comunicación.'
  },
  mision4: {
    code: 'Misión 04',
    title: 'Mi Rol en Educar',
    subtitle: 'Mi Rol en Educar',
    desc: 'Pautas de convivencia, puntualidad, uniforme y la cultura del trabajo colaborativo.'
  }
};

const STORAGE_KEY = 'ci_completed_missions_2026';

export function useMissionProgress() {
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>(() => {
    return safeLocalStorageGet<Record<string, boolean>>(STORAGE_KEY, {});
  });

  // Persistir en localStorage ante cualquier cambio
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEY, completedMissions);
  }, [completedMissions]);

  const markMissionCompleted = useCallback((missionId: string) => {
    setCompletedMissions(prev => {
      if (prev[missionId]) return prev;
      return { ...prev, [missionId]: true };
    });
  }, []);

  const toggleMissionCompleted = useCallback((missionId: string) => {
    setCompletedMissions(prev => ({
      ...prev,
      [missionId]: !prev[missionId]
    }));
  }, []);

  const isMissionCompleted = useCallback((missionId: string): boolean => {
    return Boolean(completedMissions[missionId]);
  }, [completedMissions]);

  // Lista detallada de las misiones requeridas
  const requiredMissionsList: MissionProgressInfo[] = useMemo(() => {
    return REQUIRED_MISSION_IDS.map(id => ({
      id,
      number: id.replace('mision', '0'),
      code: MISSION_METADATA[id]?.code || id,
      title: MISSION_METADATA[id]?.title || id,
      subtitle: MISSION_METADATA[id]?.subtitle || '',
      desc: MISSION_METADATA[id]?.desc || '',
      isCompleted: Boolean(completedMissions[id])
    }));
  }, [completedMissions]);

  // Conteo de misiones requeridas completadas (0 a 3)
  const completedCount = useMemo(() => {
    return REQUIRED_MISSION_IDS.filter(id => Boolean(completedMissions[id])).length;
  }, [completedMissions]);

  const totalRequired = REQUIRED_MISSION_IDS.length; // 3

  // Porcentaje de progreso de 0 a 100%
  const progressPercent = useMemo(() => {
    return Math.round((completedCount / totalRequired) * 100);
  }, [completedCount, totalRequired]);

  // El diploma sólo se desbloquea al completar el 100% de las 3 misiones requeridas
  const isDiplomaUnlocked = useMemo(() => {
    return completedCount === totalRequired;
  }, [completedCount, totalRequired]);

  // Primera misión pendiente
  const nextPendingMission = useMemo((): MissionId => {
    const pending = REQUIRED_MISSION_IDS.find(id => !completedMissions[id]);
    return pending || 'mision1';
  }, [completedMissions]);

  const nextPendingMissionTitle = useMemo(() => {
    return `${MISSION_METADATA[nextPendingMission]?.code}: ${MISSION_METADATA[nextPendingMission]?.title}`;
  }, [nextPendingMission]);

  const resetProgress = useCallback(() => {
    setCompletedMissions({});
    safeLocalStorageSet(STORAGE_KEY, {});
  }, []);

  return {
    completedMissions,
    setCompletedMissions,
    markMissionCompleted,
    toggleMissionCompleted,
    isMissionCompleted,
    requiredMissionsList,
    completedCount,
    totalRequired,
    progressPercent,
    isDiplomaUnlocked,
    nextPendingMission,
    nextPendingMissionTitle,
    resetProgress
  };
}
