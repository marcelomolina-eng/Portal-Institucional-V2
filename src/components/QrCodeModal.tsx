import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check, ExternalLink, Smartphone, Share2 } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const [portalUrl, setPortalUrl] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Priorizar URL actual del navegador o variable de despliegue de Vercel/Vite
      const vercelUrl = 
        import.meta.env.VITE_APP_URL || 
        import.meta.env.NEXT_PUBLIC_VERCEL_URL || 
        import.meta.env.VERCEL_URL;

      let resolvedUrl = window.location.href;
      if (vercelUrl && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
        resolvedUrl = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
      } else if (window.location.origin) {
        resolvedUrl = `${window.location.origin}${window.location.pathname}`;
      }
      setPortalUrl(resolvedUrl);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = portalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://colegioinformatico.educar.edu.ar');

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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg text-lg font-bold cursor-pointer transition"
          aria-label="Cerrar modal"
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
            Verita Vinci • Acceso Móvil
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Acceso Rápido por Código QR
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Escanea desde la cámara de tu teléfono móvil para ingresar directamente a este portal en producción.
          </p>
        </div>

        {/* Generador Real de Código QR con alta corrección de errores */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#CFB07A] shadow-inner inline-block mx-auto">
          <QRCodeSVG
            value={currentUrl}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#1C1A17"
            imageSettings={{
              src: '/assets/aistudio/escudo_colegio_informatico.png',
              x: undefined,
              y: undefined,
              height: 38,
              width: 32,
              excavate: true,
            }}
          />
        </div>

        {/* Campo para copiar enlace directo */}
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
              className="px-3 py-1.5 rounded-lg bg-[#00875A] hover:bg-[#007031] text-white font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-1 text-slate-600">
              <Smartphone className="w-3.5 h-3.5 text-[#00875A]" />
              <span>Compatible con iOS y Android</span>
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00875A] hover:underline flex items-center gap-0.5 font-bold"
            >
              <span>Abrir</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
