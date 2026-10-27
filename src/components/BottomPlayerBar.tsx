import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Volume2, VolumeX, AlertCircle, RefreshCw, Radio, Maximize2 } from 'lucide-react';

interface BottomPlayerBarProps {
  onOpenLiveView: () => void;
}

export const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({ onOpenLiveView }) => {
  const {
    isPlaying,
    status,
    errorMessage,
    nowPlaying,
    volume,
    isMuted,
    stationConfig,
    togglePlay,
    setVolume,
    toggleMute,
    retry,
  } = useAudio();

  return (
    <aside
      aria-label="Reproductor persistente de Radio La Colmena"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-neutral-800/90 bg-neutral-950/95 backdrop-blur-xl shadow-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Left: Now Playing & Station info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[45%] sm:max-w-md">
          <div
            onClick={onOpenLiveView}
            className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-amber-500/30 bg-neutral-900"
            title="Abrir estudio en vivo"
          >
            <img
              src="/official_poster.jpg"
              alt="Logo Radio La Colmena"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                <span className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 bg-amber-400 rounded-full animate-wave-1 h-3" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-wave-2 h-4" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-wave-3 h-2" />
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                EN VIVO
              </span>
              <span className="text-[11px] text-neutral-400 hidden sm:inline">· 128 kbps</span>
            </div>
            <p className="truncate text-xs sm:text-sm font-semibold text-white">
              {nowPlaying.title || "Transmisión en Vivo"}
            </p>
            <p className="truncate text-[11px] sm:text-xs text-neutral-400">
              {nowPlaying.artist || stationConfig.name}
            </p>
          </div>
        </div>

        {/* Center: Controls & Status */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2 sm:gap-3">
            {status === 'error' ? (
              <button
                onClick={() => retry()}
                className="flex items-center gap-1.5 rounded-full bg-rose-600/20 border border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-600/30 transition-colors"
                title="Reintentar conexión"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reintentar</span>
              </button>
            ) : null}

            <button
              onClick={() => togglePlay()}
              disabled={status === 'loading'}
              className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
              aria-label={isPlaying ? "Pausar" : "Reproducir señal en vivo"}
            >
              {status === 'loading' ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {errorMessage && status === 'error' && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-rose-400">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-xs">{errorMessage}</span>
            </span>
          )}
        </div>

        {/* Right: Volume & Expand View */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1.5 w-20 sm:w-24 cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-amber-400"
              aria-label="Control de volumen"
            />
            <span className="text-[11px] font-mono-num text-neutral-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <button
            onClick={onOpenLiveView}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-300 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
            title="Ver pantalla completa del estudio"
            aria-label="Abrir vista de estudio en vivo"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
