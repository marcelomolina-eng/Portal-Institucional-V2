import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Music, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  FileText,
  Volume
} from 'lucide-react';

interface HimnoPlayerProps {
  audioSrc?: string;
}

export const HimnoPlayer: React.FC<HimnoPlayerProps> = ({
  audioSrc = '/assets/himno Colegio.mpeg'
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(true);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      console.warn('Audio playback error or format notice for:', audioSrc);
      setAudioError(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch(err => {
          console.warn('Playback initiation error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume > 0 ? volume : 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#1C1A17] text-white rounded-3xl border-2 border-[#CFB07A] shadow-2xl overflow-hidden relative">
      {/* Hidden audio element with encoded URI */}
      <audio
        ref={audioRef}
        src={encodeURI(audioSrc)}
        preload="metadata"
      />

      {/* Subtle heraldic ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#01913F]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#DE4034]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Card */}
      <div className="p-6 sm:p-8 relative z-10 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8F1F17] to-[#1C1A17] border-2 border-[#CFB07A] flex items-center justify-center text-[#CFB07A] shadow-lg ${isPlaying ? 'ring-4 ring-[#01913F]/40 animate-pulse' : ''}`}>
                <Music className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              {isPlaying && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#01913F] border-2 border-[#1C1A17] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#CFB07A]/20 border border-[#CFB07A]/50 text-[#CFB07A] text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#01913F]" />
                <span>Patrimonio Cultural & Musical</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                <span>Himno Institucional</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-serif-title italic">
                Colegio Informático San Juan de Vera • <span className="text-[#CFB07A] font-bold">"VERITA VINCI"</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-right hidden sm:block">
              <span className="text-[10px] font-mono text-[#CFB07A] uppercase tracking-wider block font-bold">
                Lema Oficial
              </span>
              <span className="text-xs font-serif-title font-bold text-white tracking-widest uppercase">
                Vencer en la Verdad
              </span>
            </div>
          </div>
        </div>

        {/* REPRODUCTOR INTERACTIVO */}
        <div className="mt-6 bg-black/40 rounded-2xl p-4 sm:p-5 border border-[#CFB07A]/30 backdrop-blur-xs space-y-4 shadow-inner">
          {/* Timeline and scrubber */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#CFB07A]">
              <span>{formatTime(currentTime)}</span>
              <span className="text-[11px] text-slate-400">
                {isPlaying ? '● Reproduciendo' : 'Audio Oficial MPEG'}
              </span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="relative group flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700/80 accent-[#CFB07A] focus:outline-none"
              />
              {/* Visible progress fill */}
              <div 
                className="absolute left-0 top-0 h-2 bg-gradient-to-r from-[#DE4034] via-[#CFB07A] to-[#01913F] rounded-lg pointer-events-none transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls: Play/Pause, Rewind, Volume */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              {/* Play / Pause Primary Button */}
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pausar himno' : 'Reproducir himno'}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#01913F] to-[#00602A] hover:from-[#00a848] hover:to-[#01913F] text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/50 transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-current text-[#CFB07A] ml-0.5" />
                )}
              </button>

              {/* Restart button */}
              <button
                onClick={handleRestart}
                title="Reiniciar desde el inicio"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center border border-white/15 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#CFB07A]" />
              </button>

              <div className="text-left pl-1">
                <span className="text-xs font-bold text-white block">
                  {isPlaying ? 'Sonando Himno del Colegio' : 'Pausado'}
                </span>
                <span className="text-[11px] text-slate-400">
                  Archivo institucional • /assets/himno Colegio.mpeg
                </span>
              </div>
            </div>

            {/* Volume controls */}
            <div className="flex items-center gap-2.5 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 w-full sm:w-auto justify-end">
              <button
                onClick={toggleMute}
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
                className="text-[#CFB07A] hover:text-white transition"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 sm:w-24 h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-[#CFB07A]"
              />
              <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACORDEÓN / DESPLEGABLE CON LA LETRA COMPLETA */}
      <div className="p-6 sm:p-8 bg-[#181613]">
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#CFB07A]/40 transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DE4034]/20 border border-[#DE4034]/40 flex items-center justify-center text-[#CFB07A]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#CFB07A] block">
                Poesía & Canto
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#CFB07A] transition">
                Letra Completa del Himno Oficial
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#CFB07A]">
            <span className="hidden sm:inline">
              {isLyricsOpen ? 'Ocultar Letra' : 'Ver Letra'}
            </span>
            {isLyricsOpen ? (
              <ChevronUp className="w-5 h-5 text-[#CFB07A]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#CFB07A]" />
            )}
          </div>
        </button>

        {/* Desplegable animado */}
        {isLyricsOpen && (
          <div className="mt-4 p-6 sm:p-8 rounded-2xl bg-[#221F1B] border border-white/10 shadow-inner space-y-6 animate-fadeIn">
            <div className="text-center space-y-1 pb-4 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase text-[#01913F] font-bold tracking-widest">
                Colegio Informático San Juan de Vera
              </span>
              <h4 className="text-lg font-serif-title font-bold text-[#CFB07A] tracking-wider uppercase">
                Himno Institucional
              </h4>
              <p className="text-xs text-slate-400 italic">
                Fundación Torres Vera y Aragón • Educar SRL
              </p>
            </div>

            {/* Estrofas */}
            <div className="space-y-6 text-center max-w-2xl mx-auto font-serif-title leading-relaxed">
              {/* Estrofa 1 */}
              <div className="space-y-1 p-4 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[10px] font-mono text-[#DE4034] font-bold uppercase tracking-widest block mb-2">
                  [ Estrofa I ]
                </span>
                <p className="text-sm sm:text-base text-slate-100">
                  De las raíces de un río que te acuna
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  San Juan de Vera con orgullo naces ya,
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  Para sumar y unirse a juventudes
                </p>
                <p className="text-sm sm:text-base font-bold text-[#CFB07A]">
                  Tienes a tu lema: vencer en la verdad.
                </p>
              </div>

              {/* Estrofa 2 - Estribillo / Fuerza */}
              <div className="space-y-1 p-4 rounded-xl bg-[#01913F]/10 border border-[#01913F]/30">
                <span className="text-[10px] font-mono text-[#01913F] font-bold uppercase tracking-widest block mb-2">
                  [ Estrofa II • Estribillo ]
                </span>
                <p className="text-sm sm:text-base text-slate-100">
                  Ofrendas del corazón, ideales a conquistar
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  La lucha está dentro y es tiempo de afrontar.
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  El mundo de hoy está aquí, las mentes a preparar
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  La vida sin tregua nos da para andar.
                </p>
                <p className="text-sm sm:text-base text-[#CFB07A] pt-2 font-semibold">
                  En libros y en aulas busquemos el ahora conscientes de la identidad,
                </p>
                <p className="text-sm sm:text-base text-[#CFB07A] font-bold">
                  Ser signo encendido en la patria, amar lo que hacemos, crecer y crecer.
                </p>
              </div>

              {/* Estrofa 3 */}
              <div className="space-y-1 p-4 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[10px] font-mono text-[#DE4034] font-bold uppercase tracking-widest block mb-2">
                  [ Estrofa III ]
                </span>
                <p className="text-sm sm:text-base text-slate-100">
                  Llevas en tus patios y recreos
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  El canto tierno de niños muy pequeños,
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  Adolescentes que sonríen,
                </p>
                <p className="text-sm sm:text-base text-slate-100">
                  Cantan y juegan al mundo del vivir.
                </p>
              </div>

              {/* Estrofa 4 - Cierre Triunfal */}
              <div className="space-y-1 p-4 rounded-xl bg-[#DE4034]/10 border border-[#DE4034]/30">
                <span className="text-[10px] font-mono text-[#DE4034] font-bold uppercase tracking-widest block mb-2">
                  [ Estrofa IV • Cierre ]
                </span>
                <p className="text-sm sm:text-base text-slate-100 font-semibold">
                  Abigarradas juventudes, Fundación Torres Vera y Aragón,
                </p>
                <p className="text-base sm:text-lg font-bold text-[#CFB07A]">
                  Eres la fuerza educadora para el nordeste de un mundo mejor.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] font-serif-title uppercase tracking-widest text-[#CFB07A]/80 font-bold">
                "VERITA VINCI" • LA VERDAD TRIUNFA
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
