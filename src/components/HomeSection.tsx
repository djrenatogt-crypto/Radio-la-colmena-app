import React from 'react';
import { useAudio } from '../context/AudioContext';
import { RadioSegment, SocialNetwork } from '../types/radio';
import { Play, Pause, Radio, Calendar, Clock, MessageSquare, Download, ExternalLink, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';

interface HomeSectionProps {
  segments: RadioSegment[];
  socials: SocialNetwork[];
  onNavigate: (section: string) => void;
  onSelectSegment: (seg: RadioSegment) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  segments,
  socials,
  onNavigate,
  onSelectSegment,
}) => {
  const { isPlaying, status, nowPlaying, stationConfig, togglePlay, retry, errorMessage } = useAudio();

  const activeSegments = segments.filter(s => s.status !== 'archived');
  const featuredSegments = activeSegments.slice(0, 3);
  const whatsappSocial = socials.find(s => s.platform === 'whatsapp' && s.enabled);
  const playStoreSocial = socials.find(s => s.platform === 'googleplay' && s.enabled);

  return (
    <div className="space-y-16 py-6 pb-28">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Subtle decorative honey-amber ambient glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Station Identity & Live Action */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 font-bold uppercase tracking-wider text-amber-400">
                <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-ping' : 'bg-amber-400'}`} />
                SEÑAL DIGITAL EN DIRECTO
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-300 font-medium">{stationConfig.location}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-400">{stationConfig.audioQuality}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-balance">
                Radio La Colmena
              </h1>
              <p className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                “{stationConfig.motto}”
              </p>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                {stationConfig.description}
              </p>
            </div>

            {/* Now Playing Widget inside Hero */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-medium text-amber-400 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5" />
                  Al aire ahora
                </span>
                <span className="font-mono-num text-[11px]">En Vivo 24/7</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-white truncate">
                {nowPlaying.title || "Radio La Colmena - Transmisión Oficial"}
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">
                {nowPlaying.artist || "Endulzando tu vida"}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => togglePlay()}
                disabled={status === 'loading'}
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-7 py-4 text-base font-extrabold text-neutral-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] hover:brightness-105 active:scale-95 disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                    <span>Conectando señal...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 fill-current" />
                    <span>Pausar Emisión</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    <span>Sintonizar en Vivo</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp Action */}
              <a
                href="https://wa.me/50251273046"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-4 text-sm font-bold text-emerald-400 hover:bg-emerald-900/50 hover:border-emerald-500 transition-all shadow-lg shadow-emerald-950/40"
                aria-label="Contáctanos por WhatsApp al +502 5127 3046"
              >
                <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.477-.15-.678.15-.201.301-.78 0.979-.955 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zm-5.467 7.424c-2.003 0-3.96-.539-5.679-1.558l-.407-.242-4.223 1.107 1.127-4.116-.265-.422c-1.119-1.783-1.711-3.847-1.711-5.962 0-6.182 5.03-11.213 11.218-11.213 2.994 0 5.808 1.166 7.925 3.284 2.117 2.118 3.282 4.933 3.281 7.929 0 6.183-5.03 11.213-11.22 11.213zm9.645-19.231C19.167 0.088 15.713-.001 12.005 0 5.385 0 0 5.386 0 12.006c0 2.112.551 4.174 1.597 5.992L0 24l6.177-1.62c1.751.954 3.731 1.458 5.748 1.458 6.621 0 12.007-5.387 12.007-12.006 0-3.208-1.25-6.223-3.282-8.258z"/>
                </svg>
                <div className="text-left">
                  <span className="block leading-tight">Contáctanos por WhatsApp</span>
                  <span className="block text-[11px] font-normal text-emerald-300/80 font-mono-num">+502 5127 3046</span>
                </div>
              </a>

              {/* Direct Facebook Action */}
              <a
                href="https://www.facebook.com/share/1F559sTg3X/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-2xl border border-blue-500/40 bg-blue-950/40 px-5 py-4 text-sm font-bold text-blue-400 hover:bg-blue-900/50 hover:border-blue-500 transition-all shadow-lg shadow-blue-950/40"
                aria-label="Facebook Oficial de Radio La Colmena"
              >
                <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook Oficial</span>
              </a>

              <button
                onClick={() => onNavigate('contacto')}
                className="flex items-center gap-2 rounded-2xl border border-neutral-700/80 bg-neutral-900/60 px-5 py-4 text-sm font-semibold text-neutral-200 transition-colors hover:border-amber-500/40 hover:bg-neutral-800"
              >
                <MessageSquare className="h-4 w-4 text-amber-400" />
                <span>Enviar Saludo</span>
              </button>
            </div>

            {errorMessage && status === 'error' && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center justify-between gap-3">
                <span>{errorMessage}</span>
                <button
                  onClick={() => retry()}
                  className="shrink-0 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-500"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Radio Visualizer / Mascot Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-5 shadow-2xl">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
                <img
                  src="/official_poster.jpg"
                  alt="Mascota y Logotipo Oficial Radio La Colmena"
                  className="h-full w-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {/* Audio wave overlay when playing */}
                {isPlaying && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Transmisión Activa</span>
                    </div>
                    <div className="flex items-end gap-1 h-6">
                      <span className="w-1 bg-amber-400 rounded-full animate-wave-1" />
                      <span className="w-1 bg-amber-400 rounded-full animate-wave-2" />
                      <span className="w-1 bg-amber-400 rounded-full animate-wave-3" />
                      <span className="w-1 bg-amber-400 rounded-full animate-wave-4" />
                      <span className="w-1 bg-amber-400 rounded-full animate-wave-5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                <span>Transmisión Oficial HD</span>
                <button
                  onClick={() => onNavigate('envivo')}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Ver Estudio Completo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUESTROS SEGMENTOS DESTACADOS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Nuestros Segmentos
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Programación diaria creada para llenar de ritmo y alegría cada momento de tu día.
            </p>
          </div>
          <button
            onClick={() => onNavigate('programas')}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300 whitespace-nowrap self-start sm:self-auto"
          >
            Ver toda la programación →
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSegments.map((segment) => (
            <div
              key={segment.id}
              onClick={() => onSelectSegment(segment)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 transition-all duration-300 hover:border-amber-500/40 hover:bg-neutral-900 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <img
                  src={segment.posterUrl}
                  alt={`Cartel de ${segment.title}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/official_poster.jpg';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                    {segment.days.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-mono-num">{segment.timeStart} - {segment.timeEnd}</span>
                  <span>·</span>
                  <span className="truncate">{segment.host}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {segment.title}
                </h3>

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {segment.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Ver detalles del programa</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CANALES OFICIALES DIRECTOS (WHATSAPP & FACEBOOK) */}
      <section className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-6 sm:p-8 shadow-xl">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          {/* WhatsApp Direct Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5 transition-all hover:border-emerald-500/60">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-neutral-950 shadow-md">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.477-.15-.678.15-.201.301-.78 0.979-.955 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zm-5.467 7.424c-2.003 0-3.96-.539-5.679-1.558l-.407-.242-4.223 1.107 1.127-4.116-.265-.422c-1.119-1.783-1.711-3.847-1.711-5.962 0-6.182 5.03-11.213 11.218-11.213 2.994 0 5.808 1.166 7.925 3.284 2.117 2.118 3.282 4.933 3.281 7.929 0 6.183-5.03 11.213-11.22 11.213zm9.645-19.231C19.167 0.088 15.713-.001 12.005 0 5.385 0 0 5.386 0 12.006c0 2.112.551 4.174 1.597 5.992L0 24l6.177-1.62c1.751.954 3.731 1.458 5.748 1.458 6.621 0 12.007-5.387 12.007-12.006 0-3.208-1.25-6.223-3.282-8.258z"/>
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Línea de Cabina
                </span>
                <span className="font-display text-base font-bold text-white block">
                  +502 5127 3046
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/50251273046"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-md whitespace-nowrap shrink-0"
            >
              Contáctanos por WhatsApp
            </a>
          </div>

          {/* Facebook Direct Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-blue-950/30 p-5 transition-all hover:border-blue-500/60">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
                  Página Oficial
                </span>
                <span className="font-display text-base font-bold text-white block">
                  Radio La Colmena en Facebook
                </span>
              </div>
            </div>
            <a
              href="https://www.facebook.com/share/1F559sTg3X/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-md whitespace-nowrap shrink-0"
            >
              Visitar Facebook
            </a>
          </div>
        </div>
      </section>

      {/* 4. SINTONIZA EN TODAS PARTES (APP OFICIAL & STREAMING) */}
      <section className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-950 p-6 sm:p-10 shadow-xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Download className="h-4 w-4" />
              Lleva Radio La Colmena en tu Bolsillo
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Disponible en Google Play Store y Navegadores
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
              Descarga nuestra aplicación oficial para dispositivos Android o escucha directamente desde cualquier reproductor compatible (Winamp, VLC, iTunes o navegador web). Sin interrupciones, con la mayor fidelidad de audio.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {playStoreSocial && (
                <a
                  href={playStoreSocial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-neutral-950 font-bold text-sm shadow hover:bg-neutral-100 transition-colors"
                >
                  <img
                    src="https://www.radiolacolmena.com/sitepad-data/uploads/2021/12/google-play-badge-es-300x116.png"
                    alt="Disponible en Google Play"
                    className="h-7 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>Descargar en Google Play</span>
                </a>
              )}
              <a
                href="https://vivo.miradio.in/8178/stream"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
              >
                <span>Enlace Directo Stream MP3</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://vivo.miradio.in/cp/links.php?p=8178&m=pls"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
              >
                <span>VLC / Winamp (.pls)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
              <Radio className="h-12 w-12 text-amber-400 mb-3" />
              <h3 className="font-display font-bold text-white text-base">Streaming HD Continuo</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Servidor SonicPanel Shoutcast 128 kbps con latencia optimizada para redes móviles 3G, 4G y 5G.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOBRE NOSOTROS */}
      <section className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Nuestra Historia & Comunidad
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Radio La Colmena: La Voz Dulce de Amatitlán
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Nacida con la convicción de acompañar a las familias, trabajadores y jóvenes, <strong>Radio La Colmena</strong> transmite música, cultura, entretenimiento y mensajes de aliento bajo el lema <em>“Endulzando tu vida”</em>.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Vinculada activamente a iniciativas educativas y comunitarias en Amatitlán, Guatemala, nuestra señal digital llega a oyentes tanto en territorio guatemalteco como a la comunidad hispana en Estados Unidos y todo el mundo.
            </p>
            <div className="pt-2 flex flex-wrap gap-6 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Emisión Oficial Verificada</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-amber-400" />
                <span>Música para toda la familia</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 aspect-square">
              <img
                src="/microfono.jpg"
                alt="Micrófono de estudio Radio La Colmena"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 aspect-square">
              <img
                src="/consola.jpg"
                alt="Consola de audio Radio La Colmena"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
