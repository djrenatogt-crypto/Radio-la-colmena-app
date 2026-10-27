import React, { useState } from 'react';
import { RadioSegment } from '../types/radio';
import { Clock, User, Calendar, ExternalLink, Search, Filter } from 'lucide-react';

interface ProgramsSectionProps {
  segments: RadioSegment[];
  onSelectSegment: (seg: RadioSegment) => void;
}

const DAYS = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ segments, onSelectSegment }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSegments = segments.filter(seg => {
    if (seg.status === 'archived') return false;
    const matchesDay = selectedDay === 'Todos' || seg.days.some(d => d.toLowerCase().includes(selectedDay.toLowerCase()));
    const matchesSearch =
      searchQuery === '' ||
      seg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesSearch;
  });

  return (
    <div className="space-y-10 py-6 pb-28">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Parrilla de Emisión
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          Programas y Segmentos
        </h1>
        <p className="text-base text-neutral-400 max-w-2xl">
          Conoce a los locutores, horarios y temáticas que acompañan tus días en Radio La Colmena.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Day filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-x-auto">
          {DAYS.map((day) => {
            const isActive = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por programa o locutor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Segments Grid */}
      {filteredSegments.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-12 text-center space-y-3">
          <p className="text-neutral-400 text-sm">No encontramos segmentos para los filtros seleccionados.</p>
          <button
            onClick={() => {
              setSelectedDay('Todos');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSegments.map((segment) => (
            <div
              key={segment.id}
              onClick={() => onSelectSegment(segment)}
              className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 transition-all duration-300 hover:border-amber-500/40 hover:bg-neutral-900 hover:shadow-xl"
            >
              <div>
                {/* Poster Preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={segment.posterUrl}
                    alt={segment.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/official_poster.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                      {segment.days.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-mono-num font-medium text-neutral-300">
                      {segment.timeStart} - {segment.timeEnd}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 truncate">
                      <User className="h-3 w-3 text-amber-400" />
                      {segment.host}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {segment.title}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                    {segment.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-neutral-800/80 text-xs font-semibold text-amber-400">
                <span>Ver detalles del programa</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
