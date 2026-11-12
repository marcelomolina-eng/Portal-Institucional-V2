/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MissionId, 
  AppConfig, 
  DiplomaRecord, 
  CalendarEvent, 
  NoticeItem, 
  FeedbackRecord, 
  Authority,
  OrganigramLevel,
  InitiativeItem,
  CommitmentRule
} from './types';
import { 
  INITIAL_CONFIG, 
  INITIATIVES, 
  AUTHORITIES, 
  COMMITMENT_RULES, 
  INITIAL_CALENDAR, 
  INITIAL_NOTICES, 
  INITIAL_DIPLOMAS, 
  INITIAL_FEEDBACK,
  INITIAL_ORGANIGRAM
} from './data/initialData';
import { safeLocalStorageSet, safeLocalStorageGet } from './utils/storage';
import { 
  fetchDirectivos, 
  insertDirectivo, 
  updateDirectivo, 
  deleteDirectivo, 
  fetchOrganigram, 
  saveOrganigram,
  fetchCalendarEvents,
  upsertCalendarEvent,
  deleteCalendarEvent,
  fetchNotices,
  upsertNotice,
  deleteNotice,
  fetchDiplomas,
  insertDiploma,
  deleteDiploma,
  fetchFeedbacks,
  insertFeedback,
  fetchPortalConfig,
  savePortalConfig,
  fetchInitiatives,
  fetchCommitmentRules,
  upsertMision4Compromiso,
  subscribeToTable
} from './lib/supabase';
import { Header } from './components/Header';
import { HomeMission } from './components/HomeMission';
import { Mission1Identity } from './components/Mission1Identity';
import { Mission2Essence } from './components/Mission2Essence';
import { Mission3Community } from './components/Mission3Community';
import { Mission4Role } from './components/Mission4Role';
import { MissionCompleted } from './components/MissionCompleted';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { QrCodeModal } from './components/QrCodeModal';
import { GasFilesViewer } from './components/GasFilesViewer';
import { InstitutionalLogo } from './components/InstitutionalLogo';
import { useMissionProgress } from './hooks/useMissionProgress';

export default function App() {
  // Navigation & Mission state
  const [currentMission, setCurrentMission] = useState<MissionId>('home');
  const {
    completedMissions,
    markMissionCompleted,
    requiredMissionsList,
    completedCount,
    totalRequired,
    progressPercent,
    isDiplomaUnlocked,
    nextPendingMission,
    nextPendingMissionTitle
  } = useMissionProgress();

  // Data states (Supabase-first with institutional fallbacks)
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [authorities, setAuthorities] = useState<Authority[]>(AUTHORITIES);
  const [organigramLevels, setOrganigramLevels] = useState<OrganigramLevel[]>(INITIAL_ORGANIGRAM);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [diplomas, setDiplomas] = useState<DiplomaRecord[]>(INITIAL_DIPLOMAS);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(INITIAL_FEEDBACK);
  const [initiatives, setInitiatives] = useState<InitiativeItem[]>(INITIATIVES);
  const [commitmentRules, setCommitmentRules] = useState<CommitmentRule[]>(COMMITMENT_RULES);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('ci_admin_logged_in') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return sessionStorage.getItem('ci_admin_email') || 'rrhh@educarsrl.com.ar';
  });

  // Modals state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Carga inicial desde Supabase y suscripciones en tiempo real (PostgreSQL CDC)
  useEffect(() => {
    let isMounted = true;

    // 1. Carga inicial de todas las tablas con fallback automático si están vacías
    fetchPortalConfig()
      .then(cfg => { if (isMounted && cfg) setConfig(cfg); })
      .catch(err => console.error('[Supabase] Error al cargar portal_config:', err));

    fetchDirectivos()
      .then(auths => { if (isMounted && auths && auths.length > 0) setAuthorities(auths); })
      .catch(err => console.error('[Supabase] Error al cargar directivos:', err));

    fetchOrganigram()
      .then(levels => { if (isMounted && levels && levels.length > 0) setOrganigramLevels(levels); })
      .catch(err => console.error('[Supabase] Error al cargar organigrama:', err));

    fetchCalendarEvents()
      .then(evts => { if (isMounted && evts && evts.length > 0) setCalendarEvents(evts); })
      .catch(err => console.error('[Supabase] Error al cargar calendario:', err));

    fetchNotices()
      .then(nts => { if (isMounted && nts && nts.length > 0) setNotices(nts); })
      .catch(err => console.error('[Supabase] Error al cargar novedades:', err));

    fetchDiplomas()
      .then(dips => { if (isMounted && dips && dips.length > 0) setDiplomas(dips); })
      .catch(err => console.error('[Supabase] Error al cargar diplomas:', err));

    fetchFeedbacks()
      .then(fbs => { if (isMounted && fbs && fbs.length > 0) setFeedbacks(fbs); })
      .catch(err => console.error('[Supabase] Error al cargar feedback:', err));

    fetchInitiatives()
      .then(inits => { if (isMounted && inits && inits.length > 0) setInitiatives(inits); })
      .catch(err => console.error('[Supabase] Error al cargar iniciativas:', err));

    fetchCommitmentRules()
      .then(rules => { if (isMounted && rules && rules.length > 0) setCommitmentRules(rules); })
      .catch(err => console.error('[Supabase] Error al cargar compromisos:', err));

    // 2. Suscripciones Realtime a cambios en Supabase (PostgreSQL CDC)
    const unsubDirectivos = subscribeToTable('directivos', async () => {
      const data = await fetchDirectivos();
      if (isMounted && data && data.length > 0) setAuthorities(data);
    });

    const unsubOrganigram = subscribeToTable('organigrama_niveles', async () => {
      const data = await fetchOrganigram();
      if (isMounted && data && data.length > 0) setOrganigramLevels(data);
    });

    const unsubCalendar = subscribeToTable('calendario_eventos', async () => {
      const data = await fetchCalendarEvents();
      if (isMounted && data && data.length > 0) setCalendarEvents(data);
    });

    const unsubNotices = subscribeToTable('novedades_avisos', async () => {
      const data = await fetchNotices();
      if (isMounted && data && data.length > 0) setNotices(data);
    });

    const unsubDiplomas = subscribeToTable('diplomas_emitidos', async () => {
      const data = await fetchDiplomas();
      if (isMounted && data && data.length > 0) setDiplomas(data);
    });

    const unsubFeedback = subscribeToTable('feedback_satisfaccion', async () => {
      const data = await fetchFeedbacks();
      if (isMounted && data && data.length > 0) setFeedbacks(data);
    });

    const unsubConfig = subscribeToTable('portal_config', async () => {
      const cfg = await fetchPortalConfig();
      if (isMounted && cfg) setConfig(cfg);
      const levels = await fetchOrganigram();
      if (isMounted && levels && levels.length > 0) setOrganigramLevels(levels);
    });

    const unsubMision4 = subscribeToTable('mision4_compromisos', async () => {
      const rules = await fetchCommitmentRules();
      if (isMounted && rules && rules.length > 0) setCommitmentRules(rules);
    });

    return () => {
      isMounted = false;
      unsubDirectivos();
      unsubOrganigram();
      unsubCalendar();
      unsubNotices();
      unsubDiplomas();
      unsubFeedback();
      unsubConfig();
      unsubMision4();
    };
  }, []);

  // Mission completion handler
  const handleCompleteMission = (missionKey: string) => {
    markMissionCompleted(missionKey);
  };

  // Admin login handler
  const handleAdminSuccess = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    sessionStorage.setItem('ci_admin_logged_in', 'true');
    sessionStorage.setItem('ci_admin_email', email);
    setCurrentMission('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('ci_admin_logged_in');
    sessionStorage.removeItem('ci_admin_email');
    setCurrentMission('home');
  };

  // Config handler with Supabase persistence
  const handleUpdateConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      await savePortalConfig(newConfig);
    } catch (err) {
      console.error('Error guardando configuración en Supabase:', err);
    }
  };

  // Diploma handlers with Supabase persistence
  const handleSaveDiploma = async (newDiploma: DiplomaRecord) => {
    setDiplomas(prev => [newDiploma, ...prev]);
    handleCompleteMission('misionCumplida');
    try {
      await insertDiploma(newDiploma);
    } catch (err) {
      console.error('Error guardando diploma en Supabase:', err);
    }
  };

  const handleDeleteDiploma = async (id: string) => {
    setDiplomas(prev => prev.filter(d => d.id !== id));
    try {
      await deleteDiploma(id);
    } catch (err) {
      console.error('Error eliminando diploma en Supabase:', err);
    }
  };

  // Feedback handler with Supabase persistence
  const handleSaveFeedback = async (newFeedback: FeedbackRecord) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
    try {
      await insertFeedback(newFeedback);
    } catch (err) {
      console.error('Error guardando feedback en Supabase:', err);
    }
  };

  // Calendar handlers with Supabase persistence
  const handleAddCalendarEvent = async (newEvent: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, newEvent]);
    try {
      await upsertCalendarEvent(newEvent);
    } catch (err) {
      console.error('Error guardando evento en Supabase:', err);
    }
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    try {
      await deleteCalendarEvent(id);
    } catch (err) {
      console.error('Error eliminando evento en Supabase:', err);
    }
  };

  // Notice handlers with Supabase persistence
  const handleAddNotice = async (newNotice: NoticeItem) => {
    setNotices(prev => [newNotice, ...prev]);
    try {
      await upsertNotice(newNotice);
    } catch (err) {
      console.error('Error guardando aviso en Supabase:', err);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotice(id);
    } catch (err) {
      console.error('Error eliminando aviso en Supabase:', err);
    }
  };

  // Authority (Directivos) handlers - with Supabase persistence and local fallback
  const handleAddAuthority = async (newAuth: Authority) => {
    try {
      setAuthorities(prev => [...prev, newAuth]);
      // Persist to Supabase if configured
      await insertDirectivo(newAuth);
    } catch (err) {
      console.error('Error adding authority to state / Supabase:', err);
    }
  };

  const handleUpdateAuthority = async (updatedAuth: Authority) => {
    try {
      setAuthorities(prev => prev.map(a => a.id === updatedAuth.id ? updatedAuth : a));
      // Sincronizar en el organigrama si esta persona está asignada a alguna área
      setOrganigramLevels(prevLevels => prevLevels.map(lvl => ({
        ...lvl,
        nodes: lvl.nodes.map(node => ({
          ...node,
          responsibles: node.responsibles.map(r => {
            if (r.id === updatedAuth.id || r.name.toLowerCase() === updatedAuth.name.toLowerCase()) {
              return {
                ...r,
                name: updatedAuth.name,
                role: updatedAuth.role,
                photoUrl: updatedAuth.photoUrl,
                email: updatedAuth.email
              };
            }
            return r;
          })
        }))
      })));
      // Persist to Supabase if configured
      await updateDirectivo(updatedAuth);
    } catch (err) {
      console.error('Error updating authority in Supabase:', err);
    }
  };

  const handleDeleteAuthority = async (id: string) => {
    try {
      setAuthorities(prev => prev.filter(a => a.id !== id));
      // Desvincular del organigrama
      setOrganigramLevels(prevLevels => prevLevels.map(lvl => ({
        ...lvl,
        nodes: lvl.nodes.map(node => ({
          ...node,
          responsibles: node.responsibles.filter(r => r.id !== id)
        }))
      })));
      // Persist to Supabase if configured
      await deleteDirectivo(id);
    } catch (err) {
      console.error('Error deleting authority in Supabase:', err);
    }
  };

  // Organigram handlers - with Supabase persistence
  const handleUpdateOrganigramLevels = async (newLevels: OrganigramLevel[]) => {
    setOrganigramLevels(newLevels);
    await saveOrganigram(newLevels);
  };

  // Misión 04 (Compromisos) handler - with Supabase persistence
  const handleUpdateCommitmentRule = async (updatedRule: CommitmentRule) => {
    try {
      setCommitmentRules(prev => prev.map(r => r.number === updatedRule.number ? updatedRule : r));
      await upsertMision4Compromiso(updatedRule);
    } catch (err) {
      console.error('Error al persistir compromiso de Misión 04 en Supabase:', err);
    }
  };

  // Export complete site configuration & content to JSON
  const handleExportBackup = () => {
    const backupPayload = {
      sistema: 'Portal Digital Colegio Informático San Juan de Vera',
      version: '2026.2',
      fechaExportacion: new Date().toISOString(),
      config,
      authorities,
      organigramLevels,
      calendarEvents,
      notices
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataStr);
    downloadLink.setAttribute('download', `Respaldo_Colegio_Informatico_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  // Import JSON backup and apply immediately
  const handleImportBackup = (backupJson: string): boolean => {
    try {
      const data = JSON.parse(backupJson);
      if (data.config) {
        setConfig(data.config);
        savePortalConfig(data.config).catch(() => {});
      }
      if (Array.isArray(data.authorities)) {
        setAuthorities(data.authorities);
        data.authorities.forEach((a: Authority) => insertDirectivo(a).catch(() => {}));
      }
      if (Array.isArray(data.organigramLevels)) {
        setOrganigramLevels(data.organigramLevels);
        saveOrganigram(data.organigramLevels).catch(() => {});
      }
      if (Array.isArray(data.calendarEvents)) {
        setCalendarEvents(data.calendarEvents);
        data.calendarEvents.forEach((e: CalendarEvent) => upsertCalendarEvent(e).catch(() => {}));
      }
      if (Array.isArray(data.notices)) {
        setNotices(data.notices);
        data.notices.forEach((n: NoticeItem) => upsertNotice(n).catch(() => {}));
      }
      return true;
    } catch (e) {
      console.error('Error importando JSON:', e);
      return false;
    }
  };

  // Reset to institutional defaults
  const handleResetToDefaults = () => {
    setConfig(INITIAL_CONFIG);
    setAuthorities(AUTHORITIES);
    setOrganigramLevels(INITIAL_ORGANIGRAM);
    setCalendarEvents(INITIAL_CALENDAR);
    setNotices(INITIAL_NOTICES);
    localStorage.removeItem('ci_app_config_2026');
    localStorage.removeItem('ci_authorities_2026');
    localStorage.removeItem('ci_organigram_2026');
    localStorage.removeItem('ci_calendar_2026');
    localStorage.removeItem('ci_notices_2026');
    savePortalConfig(INITIAL_CONFIG).catch(() => {});
    saveOrganigram(INITIAL_ORGANIGRAM).catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
      {/* Institutional Header */}
      <Header
        currentMission={currentMission}
        onSelectMission={(m) => {
          if (m === 'admin' && !isAdminLoggedIn) {
            setIsAdminLoginModalOpen(true);
          } else {
            setCurrentMission(m);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalRequired={totalRequired}
        isDiplomaUnlocked={isDiplomaUnlocked}
        config={config}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) {
            setCurrentMission('admin');
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUserName={adminEmail}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMission === 'home' && (
          <HomeMission
            config={config}
            onNavigate={(m) => {
              setCurrentMission(m);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            notices={notices}
            completedMissions={completedMissions}
            completedCount={completedCount}
            totalRequired={totalRequired}
            progressPercent={progressPercent}
            isDiplomaUnlocked={isDiplomaUnlocked}
            nextPendingMissionTitle={nextPendingMissionTitle}
          />
        )}

        {currentMission === 'mision1' && (
          <Mission1Identity
            onComplete={() => handleCompleteMission('mision1')}
            onNavigateNext={() => {
              setCurrentMission('mision2');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isCompleted={!!completedMissions['mision1']}
          />
        )}

        {currentMission === 'mision2' && (
          <Mission2Essence
            initiatives={initiatives}
            calendarEvents={calendarEvents}
            onComplete={() => handleCompleteMission('mision2')}
            onNavigateNext={() => {
              setCurrentMission('mision3');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isCompleted={!!completedMissions['mision2']}
          />
        )}

        {currentMission === 'mision3' && (
          <Mission3Community
            authorities={authorities}
            organigramLevels={organigramLevels}
            onComplete={() => handleCompleteMission('mision3')}
            onNavigateNext={() => {
              setCurrentMission('mision4');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isCompleted={!!completedMissions['mision3']}
          />
        )}

        {currentMission === 'mision4' && (
          <Mission4Role
            commitmentRules={commitmentRules}
            onComplete={() => handleCompleteMission('mision4')}
            onNavigateNext={() => {
              setCurrentMission('misionCumplida');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isCompleted={!!completedMissions['mision4']}
          />
        )}

        {currentMission === 'misionCumplida' && (
          <MissionCompleted
            onSaveDiploma={handleSaveDiploma}
            onSaveFeedback={handleSaveFeedback}
            isDiplomaUnlocked={isDiplomaUnlocked}
            completedCount={completedCount}
            totalRequired={totalRequired}
            progressPercent={progressPercent}
            requiredMissionsList={requiredMissionsList}
            nextPendingMission={nextPendingMission}
            nextPendingMissionTitle={nextPendingMissionTitle}
            onNavigateToMission={(id) => {
              setCurrentMission(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={() => {
              setCurrentMission('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentMission === 'admin' && (
          <AdminPanel
            adminEmail={adminEmail}
            onLogout={handleAdminLogout}
            diplomas={diplomas}
            onDeleteDiploma={handleDeleteDiploma}
            calendarEvents={calendarEvents}
            onAddCalendarEvent={handleAddCalendarEvent}
            onDeleteCalendarEvent={handleDeleteCalendarEvent}
            notices={notices}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
            feedbacks={feedbacks}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onOpenGasFiles={() => setCurrentMission('gasFiles')}
            authorities={authorities}
            onAddAuthority={handleAddAuthority}
            onUpdateAuthority={handleUpdateAuthority}
            onDeleteAuthority={handleDeleteAuthority}
            organigramLevels={organigramLevels}
            onUpdateOrganigramLevels={handleUpdateOrganigramLevels}
            commitmentRules={commitmentRules}
            onUpdateCommitmentRule={handleUpdateCommitmentRule}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onResetToDefaults={handleResetToDefaults}
          />
        )}

        {currentMission === 'gasFiles' && (
          <GasFilesViewer
            onBackToApp={() => setCurrentMission('home')}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#1C1A17] text-slate-300 py-6 border-t-2 border-[#CFB07A] text-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InstitutionalLogo size="sm" showSubtitle={false} />
            <div className="text-left space-y-0.5">
              <p className="font-bold text-slate-100 text-sm leading-[1.5]">
                Colegio Informático • Comunidad Educativa Educar SRL
              </p>
              <p className="text-xs text-[#CFB07A] font-serif-title font-semibold tracking-[0.06em] leading-[1.5]">
                Verita Vinci • Operación Informático: Una misión: descubrir todo lo que nos une © 2026
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
