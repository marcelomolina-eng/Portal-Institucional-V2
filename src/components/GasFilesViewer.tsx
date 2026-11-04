import React from 'react';
import { 
  CODIGO_GS, 
  INDEX_HTML_GAS, 
  ESTILOS_HTML_GAS, 
  JAVASCRIPT_HTML_GAS, 
  GUIA_DESPLIEGUE_GAS 
} from '../data/gasCode';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  BookOpen, 
  ExternalLink,
  Code2,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';

interface GasFilesViewerProps {
  onBackToApp: () => void;
}

export const GasFilesViewer: React.FC<GasFilesViewerProps> = ({ onBackToApp }) => {
  const [selectedFile, setSelectedFile] = React.useState<
    'codigo' | 'index' | 'estilos' | 'javascript' | 'guia'
  >('codigo');
  const [copied, setCopied] = React.useState(false);

  const files = {
    codigo: {
      name: 'Código.gs',
      desc: 'Servidor: doGet(), setupDatabase(), generarDiplomaPDF(), loginAdmin()',
      lang: 'javascript',
      content: CODIGO_GS,
      ext: '.gs'
    },
    index: {
      name: 'Index.html',
      desc: 'Plantilla SPA HTML Service con scriptlets <?!= include(...) ?>',
      lang: 'html',
      content: INDEX_HTML_GAS,
      ext: '.html'
    },
    estilos: {
      name: 'Estilos.html',
      desc: 'CSS institucional con paleta granate, verde y dorado',
      lang: 'html',
      content: ESTILOS_HTML_GAS,
      ext: '.html'
    },
    javascript: {
      name: 'JavaScript.html',
      desc: 'Lógica cliente y llamadas RPC con google.script.run',
      lang: 'html',
      content: JAVASCRIPT_HTML_GAS,
      ext: '.html'
    },
    guia: {
      name: 'Guia_Despliegue.md',
      desc: 'Instructivo paso a paso para Google Sheets y Apps Script',
      lang: 'markdown',
      content: GUIA_DESPLIEGUE_GAS,
      ext: '.md'
    }
  };

  const current = files[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = current.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4B26F] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4B26F] text-[#5A1212] text-[11px] font-mono font-bold uppercase">
              GOOGLE APPS SCRIPT ASSETS
            </span>
            <span className="text-xs text-slate-400">Arquitectura de Entrega Solicitada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Archivos del Servidor y Base de Datos (Google Sheets)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Aquí dispones de los 4 archivos listos para copiar y pegar en <span className="font-mono text-[#D4B26F]">script.google.com</span> con la función de inicialización <span className="font-mono font-bold text-emerald-400">setupDatabase()</span>.
          </p>
        </div>

        <button
          onClick={onBackToApp}
          className="self-start md:self-center px-4 py-2.5 rounded-xl bg-[#7A1C1C] hover:bg-[#5A1212] text-white text-xs font-bold transition flex items-center gap-2"
        >
          <span>Volver al Portal</span>
          <ArrowRight className="w-4 h-4 text-[#D4B26F]" />
        </button>
      </div>

      {/* Selector de Archivos */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(files) as Array<keyof typeof files>).map((key) => {
          const item = files[key];
          const isSelected = selectedFile === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedFile(key)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#7A1C1C] shadow-md ring-2 ring-[#7A1C1C]/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileCode2 className={`w-5 h-5 ${isSelected ? 'text-[#7A1C1C]' : 'text-slate-400'}`} />
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">{item.ext}</span>
              </div>
              <div className="mt-2">
                <span className={`block font-mono font-bold text-xs ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.name}
                </span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                  {item.desc.split(':')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visualizador de Código */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Editor Toolbar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-xs font-bold text-slate-300 ml-2">
              {current.name}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">— {current.desc}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4B26F]" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre font-mono-code">
            {current.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
