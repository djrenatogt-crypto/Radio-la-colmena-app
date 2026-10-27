import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Radio, Menu, X, Shield, Volume2 } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, onOpenAdmin }) => {
  const { isPlaying, status, togglePlay } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'envivo', label: 'En Vivo' },
    { id: 'programas', label: 'Programas' },
    { id: 'redes', label: 'Redes' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleLinkClick('inicio')}
            className="group flex items-center gap-3 text-left whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
            aria-label="Radio La Colmena - Ir a inicio"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-neutral-900 shadow-inner">
              <img
                src="/official_poster.jpg"
                alt="Logo Radio La Colmena"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Radio className="absolute h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-display block text-lg font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Radio La Colmena
              </span>
              <span className="block text-[11px] font-medium text-amber-400/90 tracking-wide">
                Endulzando tu vida
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + Socials */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct WhatsApp button */}
            <a
              href="https://wa.me/50251273046"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500 transition-colors"
              title="WhatsApp: +502 5127 3046"
              aria-label="Contáctanos por WhatsApp al +502 5127 3046"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.477-.15-.678.15-.201.301-.78 0.979-.955 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.055 1.03-1.055 2.511 1.08 2.912 1.231 3.113c.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zm-5.467 7.424c-2.003 0-3.96-.539-5.679-1.558l-.407-.242-4.223 1.107 1.127-4.116-.265-.422c-1.119-1.783-1.711-3.847-1.711-5.962 0-6.182 5.03-11.213 11.218-11.213 2.994 0 5.808 1.166 7.925 3.284 2.117 2.118 3.282 4.933 3.281 7.929 0 6.183-5.03 11.213-11.22 11.213zm9.645-19.231C19.167 0.088 15.713-.001 12.005 0 5.385 0 0 5.386 0 12.006c0 2.112.551 4.174 1.597 5.992L0 24l6.177-1.62c1.751.954 3.731 1.458 5.748 1.458 6.621 0 12.007-5.387 12.007-12.006 0-3.208-1.25-6.223-3.282-8.258z"/>
              </svg>
              <span className="hidden xl:inline">WhatsApp</span>
            </a>

            {/* Direct Facebook button */}
            <a
              href="https://www.facebook.com/share/1F559sTg3X/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500 transition-colors"
              title="Facebook Oficial"
              aria-label="Facebook Oficial de Radio La Colmena"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <button
              onClick={() => togglePlay()}
              disabled={status === 'loading'}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-4 py-2 text-xs font-bold text-neutral-950 shadow-md shadow-amber-500/15 transition-all hover:brightness-105 active:scale-95 disabled:opacity-60 whitespace-nowrap shrink-0"
              aria-label={isPlaying ? "Pausar transmisión" : "Escuchar radio en vivo"}
            >
              {status === 'loading' ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                  <span>Conectando...</span>
                </>
              ) : isPlaying ? (
                <>
                  <span className="flex items-center gap-1 h-3.5">
                    <span className="w-1 bg-neutral-950 rounded-full animate-wave-1 h-3" />
                    <span className="w-1 bg-neutral-950 rounded-full animate-wave-2 h-4" />
                    <span className="w-1 bg-neutral-950 rounded-full animate-wave-3 h-2.5" />
                  </span>
                  <span>EN VIVO</span>
                  <Pause className="h-3.5 w-3.5 fill-current ml-0.5" />
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Escuchar en Vivo</span>
                </>
              )}
            </button>

            {/* Admin shortcut button */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
              title="Panel Administrativo"
              aria-label="Panel de Administración"
            >
              <Shield className="h-4 w-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 text-neutral-300 hover:text-white"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] z-30 border-b border-neutral-800 bg-neutral-950/95 p-6 shadow-2xl backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="h-2 w-2 rounded-full bg-amber-400" />}
                </button>
              );
            })}
            <div className="pt-2 border-t border-neutral-800/80 mt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-400 hover:text-amber-400"
              >
                <Shield className="h-4 w-4" />
                <span>Panel Administrativo</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
