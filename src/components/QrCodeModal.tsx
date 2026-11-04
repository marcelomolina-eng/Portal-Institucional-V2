import React from 'react';
import { QrCode, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { InstitutionalLogo } from './InstitutionalLogo';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://colegioinformatico.educar.edu.ar/onboarding';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#CFB07A] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg text-lg font-bold"
        >
          ✕
        </button>

        <div className="space-y-1">
          <img
            src="/assets/aistudio/escudo_colegio_informatico.png"
            alt="Escudo Colegio Informático"
            className="w-14 h-auto mx-auto object-contain drop-shadow-sm"
          />
          <span className="text-[10px] font-serif-title font-bold text-[#8F6A28] tracking-widest block uppercase pt-1">
            Verita Vinci
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Acceso Rápido por Código QR
          </h3>
          <p className="text-xs text-slate-500">
            Escanea desde tu teléfono móvil para acceder al portal de inducción sin usuario ni contraseña.
          </p>
        </div>

        {/* SVG QR Code Simulation with Shield Colors */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#CFB07A] shadow-inner inline-block mx-auto">
          <svg viewBox="0 0 160 160" className="w-48 h-48 mx-auto" fill="#1E293B">
            {/* Corner Markers in Shield Red */}
            <rect x="10" y="10" width="40" height="40" fill="#DE4034" rx="6" />
            <rect x="18" y="18" width="24" height="24" fill="#FFFFFF" rx="3" />
            <rect x="24" y="24" width="12" height="12" fill="#DE4034" rx="2" />

            <rect x="110" y="10" width="40" height="40" fill="#DE4034" rx="6" />
            <rect x="118" y="18" width="24" height="24" fill="#FFFFFF" rx="3" />
            <rect x="124" y="24" width="12" height="12" fill="#DE4034" rx="2" />

            <rect x="10" y="110" width="40" height="40" fill="#DE4034" rx="6" />
            <rect x="18" y="118" width="24" height="24" fill="#FFFFFF" rx="3" />
            <rect x="24" y="124" width="12" height="12" fill="#DE4034" rx="2" />

            {/* Pattern Dots in Shield Green, Sand Gold and Charcoal */}
            <circle cx="60" cy="20" r="4" fill="#01913F" />
            <circle cx="80" cy="20" r="3" fill="#CFB07A" />
            <circle cx="95" cy="25" r="4" fill="#22201B" />
            <circle cx="65" cy="40" r="4" fill="#22201B" />
            <circle cx="85" cy="45" r="5" fill="#01913F" />
            <circle cx="70" cy="65" r="4" fill="#DE4034" />
            <circle cx="90" cy="70" r="3" fill="#22201B" />
            <circle cx="25" cy="75" r="4" fill="#22201B" />
            <circle cx="45" cy="85" r="4" fill="#01913F" />
            <circle cx="120" cy="80" r="4" fill="#DE4034" />
            <circle cx="140" cy="90" r="4" fill="#CFB07A" />
            <circle cx="75" cy="95" r="5" fill="#01913F" />
            <circle cx="105" cy="115" r="4" fill="#22201B" />
            <circle cx="125" cy="125" r="4" fill="#01913F" />
            <circle cx="80" cy="135" r="4" fill="#DE4034" />
            <circle cx="140" cy="140" r="4" fill="#22201B" />
            <circle cx="60" cy="145" r="3" fill="#CFB07A" />

            {/* Center Emblem */}
            <rect x="65" y="65" width="30" height="30" fill="#FFFFFF" rx="6" stroke="#CFB07A" strokeWidth="2" />
            <text x="80" y="83" textAnchor="middle" fill="#DE4034" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              CI
            </text>
          </svg>
        </div>

        {/* Copy Link input */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-transparent px-2 font-mono text-[11px] text-slate-600 focus:outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-[#01913F] hover:bg-[#007031] text-white font-bold transition flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <Smartphone className="w-3.5 h-3.5 text-[#008751]" />
            <span>Compatible con Android, iOS y cualquier navegador web</span>
          </div>
        </div>
      </div>
    </div>
  );
};
