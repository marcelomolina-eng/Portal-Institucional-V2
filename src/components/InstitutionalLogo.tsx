import React from 'react';

interface LogoProps {
  customUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  theme?: 'dark' | 'light';
  showMotto?: boolean;
}

export const InstitutionalLogo: React.FC<LogoProps> = ({ 
  customUrl, 
  className = '', 
  size = 'md',
  showSubtitle = true,
  theme = 'dark',
  showMotto = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-11 h-14',
    lg: 'w-16 h-20',
    xl: 'w-24 h-28',
    '2xl': 'w-36 h-44'
  };

  // The official shield uploaded by the user
  const defaultShieldUrl = '/assets/aistudio/escudo_colegio_informatico.png';
  const logoSrc = (customUrl && customUrl.trim() !== '') ? customUrl : defaultShieldUrl;

  const isLight = theme === 'light';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Shield Image */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0 transition-transform duration-200 hover:scale-105 flex items-center justify-center`}>
        <img 
          src={logoSrc} 
          alt="Escudo Oficial Colegio Informático - Verita Vinci" 
          className="w-full h-full object-contain drop-shadow-md"
          onError={(e) => {
            // Fallback to original uploaded asset if trimmed path fails
            const target = e.currentTarget;
            if (target.src !== '/assets/aistudio/logo_color_ver__63b2c974.png') {
              target.src = '/assets/aistudio/logo_color_ver__63b2c974.png';
            }
          }}
        />
      </div>

      {showSubtitle && (
        <div className="leading-tight text-left">
          <div className="flex items-center gap-2">
            <span className={`block font-extrabold text-base sm:text-lg tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Colegio Informático
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#01913F] text-white uppercase tracking-wider shadow-xs">
              Educar
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {showMotto && (
              <span className="font-serif-title text-[11px] font-bold text-[#CFB07A] tracking-wider uppercase">
                Verita Vinci
              </span>
            )}
            <span className={`text-[11px] font-medium tracking-wide ${isLight ? 'text-slate-500' : 'text-slate-200'}`}>
              • Portal Onboarding 2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
