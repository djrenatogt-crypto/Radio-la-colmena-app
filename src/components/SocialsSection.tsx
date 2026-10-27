import React from 'react';
import { SocialNetwork } from '../types/radio';
import { ExternalLink, Globe, Smartphone, Play } from 'lucide-react';

interface SocialsSectionProps {
  socials: SocialNetwork[];
  onOpenAdmin: () => void;
}

export const SocialsSection: React.FC<SocialsSectionProps> = ({ socials, onOpenAdmin }) => {
  const enabledSocials = socials.filter(s => s.enabled);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return (
          <svg className="h-6 w-6 fill-current text-emerald-400" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.477-.15-.678.15-.201.301-.78 0.979-.955 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zm-5.467 7.424c-2.003 0-3.96-.539-5.679-1.558l-.407-.242-4.223 1.107 1.127-4.116-.265-.422c-1.119-1.783-1.711-3.847-1.711-5.962 0-6.182 5.03-11.213 11.218-11.213 2.994 0 5.808 1.166 7.925 3.284 2.117 2.118 3.282 4.933 3.281 7.929 0 6.183-5.03 11.213-11.22 11.213zm9.645-19.231C19.167 0.088 15.713-.001 12.005 0 5.385 0 0 5.386 0 12.006c0 2.112.551 4.174 1.597 5.992L0 24l6.177-1.62c1.751.954 3.731 1.458 5.748 1.458 6.621 0 12.007-5.387 12.007-12.006 0-3.208-1.25-6.223-3.282-8.258z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="h-6 w-6 fill-current text-blue-500" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return <span className="font-bold text-pink-400 text-lg font-display">IG</span>;
      case 'tiktok':
        return <span className="font-bold text-cyan-400 text-lg font-display">TK</span>;
      case 'youtube':
        return <Play className="h-6 w-6 text-rose-500 fill-current" />;
      case 'googleplay':
        return <Smartphone className="h-6 w-6 text-amber-400" />;
      case 'web':
        return <Globe className="h-6 w-6 text-amber-400" />;
      default:
        return <Globe className="h-6 w-6 text-neutral-400" />;
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/60';
      case 'facebook':
        return 'border-blue-500/30 bg-blue-500/10 hover:border-blue-500/60';
      case 'instagram':
        return 'border-pink-500/30 bg-pink-500/10 hover:border-pink-500/60';
      case 'tiktok':
        return 'border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-500/60';
      case 'youtube':
        return 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/60';
      case 'googleplay':
        return 'border-amber-500/30 bg-amber-500/10 hover:border-amber-500/60';
      default:
        return 'border-neutral-800 bg-neutral-900/60 hover:border-amber-500/40';
    }
  };

  return (
    <div className="space-y-12 py-6 pb-28">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Comunidad Digital
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          Redes Sociales y Enlaces Oficiales
        </h1>
        <p className="text-base text-neutral-400 max-w-2xl">
          Conéctate con Radio La Colmena en todas nuestras plataformas oficiales para estar al día de transmisiones especiales, saludos y promociones.
        </p>
      </div>

      {/* Featured Primary Channels (WhatsApp Directo + Facebook Oficial) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Priority 1: WhatsApp Directo */}
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-neutral-950 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/20">
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.477-.15-.678.15-.201.301-.78 0.979-.955 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zm-5.467 7.424c-2.003 0-3.96-.539-5.679-1.558l-.407-.242-4.223 1.107 1.127-4.116-.265-.422c-1.119-1.783-1.711-3.847-1.711-5.962 0-6.182 5.03-11.213 11.218-11.213 2.994 0 5.808 1.166 7.925 3.284 2.117 2.118 3.282 4.933 3.281 7.929 0 6.183-5.03 11.213-11.22 11.213zm9.645-19.231C19.167 0.088 15.713-.001 12.005 0 5.385 0 0 5.386 0 12.006c0 2.112.551 4.174 1.597 5.992L0 24l6.177-1.62c1.751.954 3.731 1.458 5.748 1.458 6.621 0 12.007-5.387 12.007-12.006 0-3.208-1.25-6.223-3.282-8.258z"/>
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Canal Oficial de Contacto Directo
              </span>
              <h2 className="font-display text-2xl font-black text-white">
                WhatsApp Oficial
              </h2>
              <p className="text-sm font-mono-num font-bold text-emerald-300">
                +502 5127 3046
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Escribe directamente a nuestra cabina de radio para solicitar tu canción favorita, enviar felicitaciones o mandar notas de voz a los locutores.
          </p>

          <a
            href="https://wa.me/50251273046"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-emerald-500 py-3.5 text-xs font-black text-neutral-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Contáctanos por WhatsApp</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Priority 2: Facebook Oficial */}
        <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 to-neutral-950 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Página Oficial en Redes
              </span>
              <h2 className="font-display text-2xl font-black text-white">
                Facebook Oficial
              </h2>
              <p className="text-xs text-neutral-300">
                Radio La Colmena · Endulzando tu vida
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Sigue nuestra página de Facebook para enterarte de transmisiones en vivo con video, noticias locales, coberturas especiales e interactuar con la comunidad.
          </p>

          <a
            href="https://www.facebook.com/share/1F559sTg3X/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-blue-600 py-3.5 text-xs font-black text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            <span>Ir a Facebook Oficial</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Full Social Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Todas Nuestras Plataformas
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enabledSocials.map((social) => {
            const isWhatsApp = social.platform === 'whatsapp';
            const isFacebook = social.platform === 'facebook';
            const targetUrl = isFacebook
              ? 'https://www.facebook.com/share/1F559sTg3X/'
              : isWhatsApp
              ? 'https://wa.me/50251273046'
              : social.url;

            return (
              <a
                key={social.id}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 shadow-md hover:scale-[1.01] hover:shadow-xl ${getPlatformBadgeColor(social.platform)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950/80 border border-neutral-800">
                    {getPlatformIcon(social.platform)}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {social.label}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate max-w-[180px] sm:max-w-[200px]">
                      {isWhatsApp ? '+502 5127 3046' : targetUrl.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950/60 text-neutral-400 group-hover:text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Admin Notice */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">¿Deseas actualizar los enlaces oficiales?</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Puedes agregar nuevas redes, cambiar enlaces o reordenar los accesos en cualquier momento desde el panel de control.
          </p>
        </div>
        <button
          onClick={onOpenAdmin}
          className="shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
        >
          Gestionar Redes en Admin
        </button>
      </div>
    </div>
  );
};
