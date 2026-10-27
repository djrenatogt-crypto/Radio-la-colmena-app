import React from 'react';
import { Radio, Shield, Heart } from 'lucide-react';
import { SocialNetwork } from '../types/radio';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
  socials: SocialNetwork[];
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin, socials }) => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12 pb-28 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-neutral-900">
              <Radio className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <span className="font-display block text-base font-bold text-white">
                Radio La Colmena
              </span>
              <span className="text-xs text-amber-400">“Endulzando tu vida”</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-300">
            <button onClick={() => onNavigate('inicio')} className="hover:text-amber-400 transition-colors">
              Inicio
            </button>
            <button onClick={() => onNavigate('envivo')} className="hover:text-amber-400 transition-colors">
              En Vivo
            </button>
            <button onClick={() => onNavigate('programas')} className="hover:text-amber-400 transition-colors">
              Programas
            </button>
            <button onClick={() => onNavigate('redes')} className="hover:text-amber-400 transition-colors">
              Redes Sociales
            </button>
            <button onClick={() => onNavigate('contacto')} className="hover:text-amber-400 transition-colors">
              Contacto
            </button>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-amber-400/80 hover:text-amber-300 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Radio La Colmena · Amatitlán, Guatemala. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5 text-neutral-400">
            <span>Transmisión Oficial</span>
            <span>·</span>
            <a
              href="https://www.radiolacolmena.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/90 hover:underline"
            >
              radiolacolmena.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
