import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { MessageSquare, Phone, MapPin, Mail, Globe, Send, CheckCircle2, MessageCircle, Music, Clock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { stationConfig } = useAudio();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Por favor completa tu nombre y el mensaje.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          message,
          songRequest,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo enviar el mensaje a cabina.');
      }

      setSubmitted(true);
      setName('');
      setLocation('');
      setMessage('');
      setSongRequest('');
    } catch (err: any) {
      setError(err.message || 'Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 py-6 pb-28">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Atención al Oyente
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          Contacto & Saludos a Cabina
        </h1>
        <p className="text-base text-neutral-400 max-w-2xl">
          Envíanos tus saludos, felicitaciones y solicitudes de canciones para que los locutores las lean al aire.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 shadow-xl">
            <h2 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-400" />
              Escribe a la Cabina de Transmisión
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Tu mensaje llegará inmediatamente al panel de los locutores de turno.
            </p>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h3 className="font-display text-xl font-bold text-white">¡Mensaje Enviado a Cabina!</h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                  Gracias por escribirnos. Nuestro equipo en cabina revisará tu saludo y solicitud para compartirla al aire.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                    {error}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Tu Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Méndez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Tu Ciudad o País</label>
                    <input
                      type="text"
                      placeholder="Ej. Amatitlán, Guatemala"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Music className="h-3.5 w-3.5 text-amber-400" />
                    Canción Solicitada (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Marco Antonio Solís - Si no te hubieras ido"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Tu Saludo o Mensaje *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escribe aquí tu saludo para la familia, dedicatoria o comentario..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-xs font-extrabold text-neutral-950 shadow-lg shadow-amber-500/15 hover:brightness-105 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Enviando mensaje...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Enviar Saludo a Cabina</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Contact Details & Direct WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct Action */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-neutral-950 shadow-md">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Línea Directa de WhatsApp</h3>
                <p className="text-xs text-emerald-300">Atención rápida de mensajes y notas de voz</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              ¿Quieres enviar un audio o mensaje rápido? Comunícate directamente con la cabina a través de nuestro número oficial.
            </p>

            <div className="flex items-center justify-between text-xs font-mono-num font-bold text-emerald-400">
              <span>Número Oficial:</span>
              <span>+502 5127 3046</span>
            </div>

            <a
              href="https://wa.me/50251273046"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500 py-3 text-xs font-black text-neutral-950 hover:bg-emerald-400 transition-colors shadow-lg"
            >
              <span>Contáctanos por WhatsApp</span>
            </a>
          </div>

          {/* Station Information Card */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-7 space-y-4">
            <h3 className="font-display text-base font-bold text-white">Datos de la Emisora</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 block">Ubicación</span>
                  <span className="text-white font-medium">{stationConfig.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 block">Teléfono / Cabina</span>
                  <a href={`tel:${stationConfig.phone}`} className="text-white hover:text-amber-400 font-medium">
                    {stationConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 block">Correo Electrónico</span>
                  <a href={`mailto:${stationConfig.email}`} className="text-white hover:text-amber-400 font-medium">
                    {stationConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 block">Sitio Web Oficial</span>
                  <a
                    href={stationConfig.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-medium"
                  >
                    {stationConfig.website}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-4 w-4 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-neutral-400 block">Facebook Oficial</span>
                  <a
                    href="https://www.facebook.com/share/1F559sTg3X/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    facebook.com/share/1F559sTg3X/
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 block">Horario de Transmisión</span>
                  <span className="text-emerald-400 font-semibold">24 horas continuas, los 365 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
