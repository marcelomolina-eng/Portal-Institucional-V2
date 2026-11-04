import React from 'react';
import { 
  sha256, 
  isAuthorizedEmail, 
  verifyAdminCredentials, 
  updateAdminPassword 
} from '../utils/crypto';
import { 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = React.useState<'login' | 'changePassword'>('login');

  // Login inputs - initialized completely empty for security
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Change password inputs - initialized completely empty
  const [changeEmail, setChangeEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [changeError, setChangeError] = React.useState('');
  const [changeSuccess, setChangeSuccess] = React.useState('');
  const [changeLoading, setChangeLoading] = React.useState(false);
  const [showChangeNewPassword, setShowChangeNewPassword] = React.useState(false);

  // Reset modal state when closed or opened
  React.useEffect(() => {
    if (!isOpen) {
      setError('');
      setChangeError('');
      setChangeSuccess('');
      setLoading(false);
      setChangeLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validate authorized email address
    if (!isAuthorizedEmail(cleanEmail)) {
      setError('Acceso denegado: Esta dirección de correo no cuenta con privilegios administrativos.');
      setLoading(false);
      return;
    }

    // 2. Verify credentials using SHA-256 and custom/default hashes
    const isValid = await verifyAdminCredentials(cleanEmail, password);

    if (isValid) {
      setTimeout(() => {
        setLoading(false);
        onSuccess(cleanEmail);
        onClose();
      }, 350);
    } else {
      setLoading(false);
      setError('Credenciales incorrectas. Verifique el correo y la contraseña ingresada.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    const cleanEmail = changeEmail.trim().toLowerCase();

    if (!isAuthorizedEmail(cleanEmail)) {
      setChangeError('La dirección de correo ingresada no está registrada como cuenta autorizada.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError('La confirmación de la nueva contraseña no coincide.');
      return;
    }

    if (newPassword.length < 6) {
      setChangeError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setChangeLoading(true);

    const result = await updateAdminPassword(cleanEmail, currentPassword, newPassword);
    setChangeLoading(false);

    if (result.success) {
      setChangeSuccess(result.message);
      // Clean inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Pre-set the updated email into login
      setEmail(cleanEmail);
      setPassword('');
    } else {
      setChangeError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#1C1A17] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#CFB07A] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg text-lg font-bold transition"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
          <img
            src="/assets/aistudio/logo_color_ver__63b2c974.png"
            alt="Escudo Colegio Informático"
            className="w-12 h-14 object-contain drop-shadow-md flex-shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#DE4034]/20 border border-[#DE4034]/50 text-[#F7F3EA] text-[10px] font-mono font-bold tracking-wider uppercase">
              <Lock className="w-3 h-3 text-[#CFB07A]" />
              <span>Acceso Restringido • SHA-256</span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1 leading-snug">
              {mode === 'login' ? 'Panel Administrador' : 'Restablecer Credenciales'}
            </h3>
            <span className="text-[11px] font-serif-title font-bold text-[#CFB07A] tracking-wider uppercase">
              Colegio Informático • Educar SRL
            </span>
          </div>
        </div>

        {/* MODE 1: LOGIN */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#CFB07A] uppercase tracking-wider mb-1.5">
                Correo Institucional Autorizado *
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@educarsrl.com.ar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#CFB07A]/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#CFB07A] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#CFB07A] uppercase tracking-wider">
                  Contraseña de Seguridad *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#CFB07A]/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#CFB07A] transition"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-[#DE4034] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#01913F] to-[#00602A] hover:from-[#00a848] hover:to-[#01913F] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-black/40 border border-emerald-400/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <KeyRound className="w-4 h-4 text-[#CFB07A]" />
              <span>{loading ? 'Verificando Hash SHA-256...' : 'Ingresar al Panel'}</span>
            </button>

            {/* Link to change password */}
            <div className="pt-2 text-center border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode('changePassword');
                  setChangeEmail(email);
                  setError('');
                }}
                className="text-xs text-[#CFB07A] hover:text-[#e4c995] hover:underline font-medium inline-flex items-center gap-1.5 transition py-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#CFB07A]" />
                <span>¿Deseas cambiar tu contraseña? Actualizar clave aquí</span>
              </button>
            </div>
          </form>
        ) : (
          /* MODE 2: CHANGE / RESET PASSWORD */
          <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#CFB07A] uppercase tracking-wider mb-1">
                Correo Institucional Autorizado *
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                value={changeEmail}
                onChange={(e) => setChangeEmail(e.target.value)}
                placeholder="ejemplo@educarsrl.com.ar"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#CFB07A]/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#CFB07A] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#CFB07A] uppercase tracking-wider mb-1">
                Contraseña Actual *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese contraseña vigente"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#CFB07A]/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#CFB07A] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#CFB07A] uppercase tracking-wider">
                  Nueva Contraseña *
                </label>
                <button
                  type="button"
                  onClick={() => setShowChangeNewPassword(!showChangeNewPassword)}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 focus:outline-none"
                >
                  {showChangeNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showChangeNewPassword ? 'Ocultar' : 'Ver'}</span>
                </button>
              </div>
              <input
                type={showChangeNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#CFB07A]/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#CFB07A] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#CFB07A] uppercase tracking-wider mb-1">
                Confirmar Nueva Contraseña *
              </label>
              <input
                type={showChangeNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Reingrese la nueva contraseña"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#CFB07A]/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#CFB07A] transition"
              />
            </div>

            {changeError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-[#DE4034] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{changeError}</span>
              </div>
            )}

            {changeSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-400/50 text-xs text-emerald-200 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#01913F] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{changeSuccess}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={changeLoading}
                className="w-full py-2.5 rounded-xl bg-[#DE4034] hover:bg-[#8F1F17] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#CFB07A]" />
                <span>{changeLoading ? 'Actualizando clave...' : 'Guardar Nueva Contraseña'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setChangeError('');
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Inicio de Sesión</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
