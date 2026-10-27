import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { StationConfig, NowPlayingData } from '../types/radio';

interface AudioContextType {
  isPlaying: boolean;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  errorMessage: string | null;
  volume: number;
  isMuted: boolean;
  stationConfig: StationConfig;
  nowPlaying: NowPlayingData;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  retry: () => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const defaultConfig: StationConfig = {
  name: "Radio La Colmena",
  motto: "Endulzando tu vida",
  streamUrl: "https://vivo.miradio.in/8178/stream",
  fallbackStreamUrl: "https://vivo.miradio.in:8178/;",
  logoUrl: "/official_poster.jpg",
  description: "Emisora online oficial de Radio La Colmena con transmisión 24 horas continuas desde Amatitlán, Guatemala.",
  location: "Amatitlán, Guatemala",
  phone: "+502 5127-3046",
  whatsapp: "+50251273046",
  website: "https://www.radiolacolmena.com",
  playStoreUrl: "https://play.google.com/store/apps/details?id=radio.la.colmena",
  email: "contacto@radiolacolmena.com",
  audioQuality: "128 kbps MP3 · 44.1 kHz Estéreo",
};

const defaultNowPlaying: NowPlayingData = {
  isOnline: true,
  raw: "Radio La Colmena - Endulzando tu vida",
  title: "Transmisión en Vivo 24 Horas",
  artist: "Radio La Colmena",
  lastUpdated: Date.now(),
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('colmena_volume');
    return saved !== null ? parseFloat(saved) : 0.85;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [stationConfig, setStationConfig] = useState<StationConfig>(defaultConfig);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>(defaultNowPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountRef = useRef<number>(0);
  const prevVolumeRef = useRef<number>(volume);

  // Initialize station config
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setStationConfig(data);
      }
    } catch (e) {
      console.warn('Could not fetch remote config, using defaults', e);
    }
  };

  // Poll now-playing metadata
  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/now-playing');
      if (res.ok) {
        const data = await res.json();
        setNowPlaying(data);
      }
    } catch (e) {
      // quiet fallback
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchNowPlaying();

    const interval = setInterval(fetchNowPlaying, 8000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Audio instance once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';

    audio.onwaiting = () => {
      setStatus('loading');
    };

    audio.onplaying = () => {
      setStatus('playing');
      setIsPlaying(true);
      setErrorMessage(null);
      retryCountRef.current = 0;
    };

    audio.onpause = () => {
      if (status !== 'error') {
        setStatus('paused');
      }
      setIsPlaying(false);
    };

    audio.onerror = (e) => {
      console.warn('Audio playback error', e);
      setStatus('error');
      setIsPlaying(false);
      setErrorMessage('No se pudo conectar con la señal en vivo. Revisa tu conexión a internet o intenta reconectar.');
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('colmena_volume', String(volume));
  }, [volume, isMuted]);

  const play = async () => {
    if (!audioRef.current) return;
    try {
      setStatus('loading');
      setErrorMessage(null);

      // Add cache buster query to ensure fresh live stream buffer
      const streamUrl = stationConfig.streamUrl || defaultConfig.streamUrl;
      const buster = streamUrl.includes('?') ? `&_t=${Date.now()}` : `?_t=${Date.now()}`;
      
      // If src is empty or changed, set it
      if (!audioRef.current.src || !audioRef.current.src.includes('miradio.in')) {
        audioRef.current.src = `${streamUrl}${buster}`;
      } else {
        // Refresh live stream head
        audioRef.current.src = `${streamUrl}${buster}`;
      }

      await audioRef.current.play();
    } catch (err: any) {
      console.error('Play failed:', err);
      // Browser autoplay policy or network error
      setStatus('error');
      setIsPlaying(false);
      if (err.name === 'NotAllowedError') {
        setErrorMessage('Haz clic en el botón de reproducir para escuchar la transmisión en vivo.');
      } else {
        setErrorMessage('La transmisión en vivo no respondió de inmediato. Haz clic en "Reintentar conexión".');
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Drop src to stop buffering in background
      audioRef.current.src = '';
      setStatus('paused');
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) {
        setVolumeState(prevVolumeRef.current || 0.8);
      }
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
    }
  };

  const retry = async () => {
    retryCountRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    // Try fallback stream if first retry fails
    if (retryCountRef.current > 1 && stationConfig.fallbackStreamUrl) {
      try {
        setStatus('loading');
        if (audioRef.current) {
          audioRef.current.src = `${stationConfig.fallbackStreamUrl}?_t=${Date.now()}`;
          await audioRef.current.play();
          return;
        }
      } catch (e) {
        console.warn('Fallback stream failed too');
      }
    }
    await play();
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        status,
        errorMessage,
        volume,
        isMuted,
        stationConfig,
        nowPlaying,
        play,
        pause,
        togglePlay,
        setVolume,
        toggleMute,
        retry,
        refreshConfig: fetchConfig,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
