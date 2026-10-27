import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Volume2, VolumeX, Radio, Share2, Copy, Check, ExternalLink, RefreshCw, AlertCircle, Headphones, Wifi, Music } from 'lucide-react';

interface LiveSectionProps {
  onNavigateToContact: () => void;
}

export const LiveSection: React.FC<LiveSectionProps> = ({ onNavigateToContact }) => {
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

  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCopyStream = () => {
    navigator.clipboard.writeText(stationConfig.streamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Radio La Colmena - En Vivo',
          text: `Escucha Radio La Colmena: "${stationConfig.motto}". Transmisión en vivo 24/7.`,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        // Ignored if cancelled
      }
    } else {
      handleCopyStream();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 pb-28">
      {/* Studio Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-ping' : 'bg-neutral-500'}`} />
          {isPlaying ? 'Transmitiendo en Vivo' : status === 'loading' ? 'Conectando señal...' : 'Estudio de Transmisión'}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          Cabina en Directo
        </h1>
        <p className="text-base text-neutral-400 max-w-lg mx-auto">
          Sintoniza la señal oficial de Radio La Colmena con audio digital de alta definición.
        </p>
      </div>

      {/* Main Studio Player Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-10 shadow-2xl">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          {/* Vinyl / Mascot Centerpiece */}
          <div className="relative">
            <div className={`relative h-56 w-56 sm:h-72 sm:w-72 overflow-hidden rounded-full border-4 border-amber-500/40 bg-neutral-950 shadow-2xl transition-transform duration-700 ${isPlaying ? 'scale-105 shadow-amber-500/20' : ''}`}>
              <img
                src="/official_poster.jpg"
                alt="Radio La Colmena Logo"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Center record hole */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full border-2 border-amber-400/80 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center">
                  <Radio className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Pulsing rings when playing */}
            {isPlaying && (
              <div className="pointer-events-none absolute -inset-4 rounded-full border border-amber-400/30 animate-pulse" />
            )}
          </div>

          {/* Song Metadata */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Music className="h-4 w-4" />
              <span>Sintonía Actual</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white text-balance">
              {nowPlaying.title || "Transmisión Oficial"}
            </h2>
            <p className="text-base font-medium text-neutral-300">
              {nowPlaying.artist || stationConfig.name}
            </p>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end justify-center gap-1.5 h-12 py-2">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 80, 50, 65, 85, 40].map((h, i) => (
              <span
                key={i}
                style={{
                  height: isPlaying ? `${Math.max(12, Math.min(48, (h * (i % 2 === 0 ? 1 : 0.8))))}px` : '6px',
                  transition: 'height 0.3s ease',
                }}
                className={`w-1.5 rounded-full transition-colors ${
                  isPlaying
                    ? 'bg-gradient-to-t from-amber-500 to-yellow-300 animate-pulse'
                    : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>

          {/* Error Message & Retry */}
          {errorMessage && status === 'error' && (
            <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span className="text-xs sm:text-sm">{errorMessage}</span>
              </div>
              <button
                onClick={() => retry()}
                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reconectar</span>
              </button>
            </div>
          )}

          {/* Giant Tactile Play Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => togglePlay()}
              disabled={status === 'loading'}
              className="group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-neutral-950 shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              aria-label={isPlaying ? "Pausar transmisión en vivo" : "Iniciar transmisión en vivo"}
            >
              {status === 'loading' ? (
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-950 border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-9 w-9 sm:h-10 sm:w-10 fill-current" />
              ) : (
                <Play className="h-9 w-9 sm:h-10 sm:w-10 fill-current ml-1" />
              )}
            </button>
            <span className="text-xs font-semibold text-neutral-400">
              {status === 'loading'
                ? 'Conectando con el servidor...'
                : isPlaying
                ? 'Presiona para pausar'
                : 'Presiona para escuchar en vivo'}
            </span>
          </div>

          {/* Volume Slider in Studio */}
          <div className="flex items-center gap-4 w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-3.5">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5 text-rose-400" />
              ) : (
                <Volume2 className="h-5 w-5 text-amber-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-amber-400"
              aria-label="Volumen del estudio"
            />
            <span className="text-xs font-mono-num font-bold text-neutral-300 w-10 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md pt-2">
            <button
              onClick={handleCopyStream}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-xs font-semibold text-neutral-300 hover:border-amber-500/40 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-amber-400" />}
              <span>{copied ? '¡URL Copiada!' : 'Copiar Stream'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-xs font-semibold text-neutral-300 hover:border-amber-500/40 hover:text-white transition-colors"
            >
              {shareSuccess ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-amber-400" />}
              <span>Compartir</span>
            </button>

            <button
              onClick={onNavigateToContact}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <span>Pedir Canción</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Transmission Specs */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
          <Wifi className="h-4 w-4 text-amber-400" />
          Especificaciones de Transmisión
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
            <span className="text-neutral-500">Calidad de Audio</span>
            <p className="font-mono-num font-bold text-white">128 kbps MP3</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
            <span className="text-neutral-500">Frecuencia de Muestreo</span>
            <p className="font-mono-num font-bold text-white">44.1 kHz Estéreo</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
            <span className="text-neutral-500">Servidor Streaming</span>
            <p className="font-bold text-white">SonicPanel / Shoutcast</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
            <span className="text-neutral-500">Disponibilidad</span>
            <p className="font-bold text-emerald-400">24 Horas / 7 Días</p>
          </div>
        </div>
      </div>
    </div>
  );
};
