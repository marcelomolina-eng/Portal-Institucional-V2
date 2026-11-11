import React from 'react';
import { MissionId, AppConfig } from '../types';
import { InstitutionalLogo } from './InstitutionalLogo';
import { 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Award, 
  Lock, 
  QrCode, 
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentMission: MissionId;
  onSelectMission: (mission: MissionId) => void;
  progressPercent: number;
  completedCount?: number;
  totalRequired?: number;
  isDiplomaUnlocked?: boolean;
  config: AppConfig;
  onOpenQrModal: () => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  adminUserName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentMission,
  onSelectMission,
  progressPercent,
  completedCount = 0,
  totalRequired = 3,
  isDiplomaUnlocked = false,
  config,
  onOpenQrModal,
  onOpenAdminLogin,
  isAdminLoggedIn,
  adminUserName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: MissionId; label: string; icon: React.ReactNode; isLocked?: boolean }[] = [
    { id: 'home', label: 'Inicio', icon: <Compass className="w-4 h-4" /> },
    { id: 'mision1', label: 'Misión 01: Identidad', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'mision2', label: 'Misión 02: Esencia', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'mision3', label: 'Misión 03: Comunidad', icon: <Users className="w-4 h-4" /> },
    { id: 'mision4', label: 'Misión 04: Mi rol', icon: <Compass className="w-4 h-4" /> },
    { 
      id: 'misionCumplida', 
      label: 'Certificación', 
      icon: isDiplomaUnlocked ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />,
      isLocked: !isDiplomaUnlocked
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1C1A17] text-white border-b-2 border-[#CFB07A] shadow-xl">
      {/* Top Utility Bar with subtle heraldic gradient */}
      <div className="bg-gradient-to-r from-[#8F1F17]/30 via-transparent to-[#01913F]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <button 
            onClick={() => onSelectMission('home')} 
            className="text-left focus:outline-none focus:ring-2 focus:ring-[#CFB07A] rounded-lg p-1 transition"
          >
            <InstitutionalLogo customUrl={config.logoUrl} size="md" />
          </button>

          {/* Right utility actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Progress Tracker Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-black/45 px-3 py-1.5 rounded-full border border-[#CFB07A]/50 text-xs shadow-inner">
              <span className="text-[#CFB07A] font-bold text-[11px] whitespace-nowrap">
                Progreso: {completedCount}/{totalRequired} misiones completadas
              </span>
              <div className="w-16 bg-black/70 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#DE4034] via-[#CFB07A] to-[#01913F] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-white text-[11px] font-bold">{progressPercent}%</span>
            </div>

            {/* Quick QR Access button */}
            <button
              onClick={onOpenQrModal}
              title="Abrir código QR para celulares o acceso rápido"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#CFB07A] text-xs font-medium border border-[#CFB07A]/40 transition"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Acceso QR</span>
            </button>

            {/* Panel Administrador Button */}
            <button
              onClick={onOpenAdminLogin}
              title="Panel Administrador"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isAdminLoggedIn || currentMission === 'admin'
                  ? 'bg-[#01913F] text-white border-emerald-400 shadow-md'
                  : 'bg-[#DE4034] hover:bg-[#8F1F17] text-white border-[#CFB07A]/60 shadow-xs'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Panel Administrador</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:block bg-[#24211D] border-t border-white/10 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-1">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1">
            {navItems.map((item) => {
              const isActive = currentMission === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMission(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#CFB07A] text-[#1C1A17] font-bold shadow-md shadow-black/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={isActive ? 'text-[#1C1A17]' : item.isLocked ? 'text-amber-400' : 'text-[#CFB07A]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.isLocked && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive ? 'bg-[#1C1A17] text-[#CFB07A]' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      Bloqueado
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#CFB07A] font-serif-title font-bold tracking-widest hidden lg:block uppercase">
            Verita Vinci • Educar 2026
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#24211D] border-t border-white/10 px-4 py-3 space-y-2">
          {/* Mobile Progress Bar */}
          <div className="p-3 rounded-xl bg-black/50 border border-[#CFB07A]/40 mb-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#CFB07A]">
              <span>Progreso: {completedCount}/{totalRequired} misiones completadas</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-black/70 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#DE4034] via-[#CFB07A] to-[#01913F] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {navItems.map((item) => {
            const isActive = currentMission === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectMission(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#CFB07A] text-[#1C1A17] font-bold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#1C1A17]' : item.isLocked ? 'text-amber-400' : 'text-[#CFB07A]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.isLocked && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                      Bloqueado
                    </span>
                  )}
                </div>
                {isActive && <CheckCircle2 className="w-4 h-4 text-[#1C1A17]" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Thin Heraldic Tricolor Progress line under header */}
      <div className="w-full bg-[#1C1A17] h-1.5 flex">
        <div 
          className="bg-gradient-to-r from-[#DE4034] via-[#CFB07A] to-[#01913F] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
