import React, { useState, useEffect } from 'react';
import { AudioProvider } from './context/AudioContext';
import { Header } from './components/Header';
import { BottomPlayerBar } from './components/BottomPlayerBar';
import { HomeSection } from './components/HomeSection';
import { LiveSection } from './components/LiveSection';
import { ProgramsSection } from './components/ProgramsSection';
import { SocialsSection } from './components/SocialsSection';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/admin/AdminPanel';
import { Footer } from './components/Footer';
import { RadioSegment, SocialNetwork } from './types/radio';
import { X, Clock, Calendar, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<RadioSegment | null>(null);

  const [segments, setSegments] = useState<RadioSegment[]>([]);
  const [socials, setSocials] = useState<SocialNetwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [segRes, socRes] = await Promise.all([
        fetch('/api/segments'),
        fetch('/api/socials'),
      ]);

      if (segRes.ok) {
        const segData = await segRes.json();
        setSegments(segData);
      }
      if (socRes.ok) {
        const socData = await socRes.json();
        setSocials(socData);
      }
    } catch (err) {
      console.error('Error fetching station data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Scroll to top on navigation change
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
        {/* Navigation Top Bar Contract */}
        <Header
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenAdmin={() => setAdminOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeSection === 'inicio' && (
            <HomeSection
              segments={segments}
              socials={socials}
              onNavigate={handleNavigate}
              onSelectSegment={setSelectedSegment}
            />
          )}

          {activeSection === 'envivo' && (
            <LiveSection onNavigateToContact={() => handleNavigate('contacto')} />
          )}

          {activeSection === 'programas' && (
            <ProgramsSection
              segments={segments}
              onSelectSegment={setSelectedSegment}
            />
          )}

          {activeSection === 'redes' && (
            <SocialsSection
              socials={socials}
              onOpenAdmin={() => setAdminOpen(true)}
            />
          )}

          {activeSection === 'contacto' && <ContactSection />}
        </main>

        {/* Segment Detail Modal from any view */}
        {selectedSegment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
              <button
                onClick={() => setSelectedSegment(null)}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950/80 border border-neutral-700 text-neutral-300 hover:text-white"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-neutral-950 flex items-center justify-center">
                  <img
                    src={selectedSegment.posterUrl}
                    alt={selectedSegment.title}
                    className="max-h-[500px] w-full object-contain p-2"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/official_poster.jpg';
                    }}
                  />
                </div>

                <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Detalles del Segmento
                      </span>
                      <h2 className="font-display text-2xl font-black text-white">
                        {selectedSegment.title}
                      </h2>
                      <p className="text-sm font-medium text-neutral-300">
                        Locutor: {selectedSegment.host}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="font-mono-num font-semibold text-white">
                          {selectedSegment.timeStart} a {selectedSegment.timeEnd}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-300">
                        <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{selectedSegment.days.join(', ')}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {selectedSegment.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-neutral-800">
                    <a
                      href={`https://wa.me/50251273046?text=Hola%20Radio%20La%20Colmena,%20estoy%20escuchando%20el%20programa%20${encodeURIComponent(selectedSegment.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500 py-3 text-xs font-extrabold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-lg"
                    >
                      <span>Contáctanos por WhatsApp (+502 5127 3046)</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Persistent Bottom Player Bar */}
        <BottomPlayerBar onOpenLiveView={() => handleNavigate('envivo')} />

        {/* Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenAdmin={() => setAdminOpen(true)}
          socials={socials}
        />

        {/* Admin Panel Modal */}
        <AdminPanel
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
          segments={segments}
          socials={socials}
          onRefreshData={fetchData}
        />
      </div>
    </AudioProvider>
  );
}
