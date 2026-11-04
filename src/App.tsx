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
  OrganigramLevel
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

export default function App() {
  // Navigation & Mission state
  const [currentMission, setCurrentMission] = useState<MissionId>('home');
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>(() => {
    return safeLocalStorageGet('ci_completed_missions_2026', {});
  });

  // Data states with persistence
  const [config, setConfig] = useState<AppConfig>(() => {
    return safeLocalStorageGet('ci_app_config_2026', INITIAL_CONFIG);
  });

  const [authorities, setAuthorities] = useState<Authority[]>(() => {
    return safeLocalStorageGet('ci_authorities_2026', AUTHORITIES);
  });

  const [organigramLevels, setOrganigramLevels] = useState<OrganigramLevel[]>(() => {
    return safeLocalStorageGet('ci_organigram_2026', INITIAL_ORGANIGRAM);
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    return safeLocalStorageGet('ci_calendar_2026', INITIAL_CALENDAR);
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    return safeLocalStorageGet('ci_notices_2026', INITIAL_NOTICES);
  });

  const [diplomas, setDiplomas] = useState<DiplomaRecord[]>(() => {
    return safeLocalStorageGet('ci_diplomas_2026', INITIAL_DIPLOMAS);
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(() => {
    return safeLocalStorageGet('ci_feedbacks_2026', INITIAL_FEEDBACK);
  });

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

  // Sync to localStorage safely
  useEffect(() => {
    safeLocalStorageSet('ci_completed_missions_2026', completedMissions);
  }, [completedMissions]);

  useEffect(() => {
    safeLocalStorageSet('ci_app_config_2026', config);
  }, [config]);

  useEffect(() => {
    safeLocalStorageSet('ci_calendar_2026', calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    safeLocalStorageSet('ci_notices_2026', notices);
  }, [notices]);

  useEffect(() => {
    safeLocalStorageSet('ci_diplomas_2026', diplomas);
  }, [diplomas]);

  useEffect(() => {
    safeLocalStorageSet('ci_feedbacks_2026', feedbacks);
  }, [feedbacks]);

  useEffect(() => {
    safeLocalStorageSet('ci_authorities_2026', authorities);
  }, [authorities]);

  useEffect(() => {
    safeLocalStorageSet('ci_organigram_2026', organigramLevels);
  }, [organigramLevels]);

  // Calculate mission progress percentage
  const progressPercent = (() => {
    const keys = ['mision1', 'mision2', 'mision3', 'mision4', 'misionCumplida'];
    const done = keys.filter(k => completedMissions[k]).length;
    return Math.round((done / keys.length) * 100);
  })();

  // Mission completion handler
  const handleCompleteMission = (missionKey: string) => {
    setCompletedMissions(prev => ({ ...prev, [missionKey]: true }));
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

  // Diploma handler
  const handleSaveDiploma = (newDiploma: DiplomaRecord) => {
    setDiplomas(prev => [newDiploma, ...prev]);
    handleCompleteMission('misionCumplida');
  };

  // Feedback handler
  const handleSaveFeedback = (newFeedback: FeedbackRecord) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  // Calendar handlers
  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  // Notice handlers
  const handleAddNotice = (newNotice: NoticeItem) => {
    setNotices(prev => [newNotice, ...prev]);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteDiploma = (id: string) => {
    setDiplomas(prev => prev.filter(d => d.id !== id));
  };

  // Authority (Directivos) handlers
  const handleAddAuthority = (newAuth: Authority) => {
    try {
      setAuthorities(prev => [...prev, newAuth]);
    } catch (err) {
      console.error('Error adding authority to state:', err);
      throw err;
    }
  };

  const handleUpdateAuthority = (updatedAuth: Authority) => {
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
    } catch (err) {
      console.error('Error updating authority and syncing organigram:', err);
      throw err;
    }
  };

  const handleDeleteAuthority = (id: string) => {
    setAuthorities(prev => prev.filter(a => a.id !== id));
    // Desvincular del organigrama
    setOrganigramLevels(prevLevels => prevLevels.map(lvl => ({
      ...lvl,
      nodes: lvl.nodes.map(node => ({
        ...node,
        responsibles: node.responsibles.filter(r => r.id !== id)
      }))
    })));
  };

  // Organigram handlers
  const handleUpdateOrganigramLevels = (newLevels: OrganigramLevel[]) => {
    setOrganigramLevels(newLevels);
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
      if (data.config) setConfig(data.config);
      if (Array.isArray(data.authorities)) setAuthorities(data.authorities);
      if (Array.isArray(data.organigramLevels)) setOrganigramLevels(data.organigramLevels);
      if (Array.isArray(data.calendarEvents)) setCalendarEvents(data.calendarEvents);
      if (Array.isArray(data.notices)) setNotices(data.notices);
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
            initiatives={INITIATIVES}
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
            commitmentRules={COMMITMENT_RULES}
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
            onUpdateConfig={setConfig}
            onOpenGasFiles={() => setCurrentMission('gasFiles')}
            authorities={authorities}
            onAddAuthority={handleAddAuthority}
            onUpdateAuthority={handleUpdateAuthority}
            onDeleteAuthority={handleDeleteAuthority}
            organigramLevels={organigramLevels}
            onUpdateOrganigramLevels={handleUpdateOrganigramLevels}
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
      <footer className="bg-[#1C1A17] text-slate-400 py-6 border-t-2 border-[#CFB07A] text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InstitutionalLogo size="sm" showSubtitle={false} />
            <div>
              <p className="font-bold text-slate-200">
                Colegio Informático • Comunidad Educativa Educar SRL
              </p>
              <p className="text-[11px] text-[#CFB07A] font-serif-title font-semibold tracking-wider">
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
