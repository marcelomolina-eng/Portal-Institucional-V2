import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleClearDataAndReload = () => {
    try {
      // Clear authorities & organigram specifically if corrupted
      localStorage.removeItem('ci_authorities_2026');
      localStorage.removeItem('ci_organigram_2026');
      localStorage.removeItem('ci_app_config_2026');
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1C1A17] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#24211D] border-2 border-[#CFB07A] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#DE4034]/20 border border-[#DE4034]/50 text-[#DE4034] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-[#DE4034]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#DE4034]/20 text-[#F7F3EA] uppercase">
                Sistema de Recuperación • Portal 2026
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Se ha detectado una interrupción
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {this.props.fallbackMessage || 
                  'Ocurrió un error inesperado al procesar los datos o la imagen. Tu sesión y datos institucionales están seguros.'}
              </p>
            </div>

            {/* Error Detail */}
            {this.state.error && (
              <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-left text-xs font-mono text-red-300 max-h-32 overflow-y-auto">
                <span className="font-bold text-red-400 block mb-1">Detalle del error:</span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-[#01913F] hover:bg-[#007033] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Intentar Continuar</span>
              </button>

              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-white/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recargar Portal</span>
              </button>
            </div>

            <button
              onClick={this.handleClearDataAndReload}
              className="text-[11px] text-[#CFB07A] hover:underline block mx-auto pt-2"
            >
              ¿Persiste el problema? Restaurar datos iniciales
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
