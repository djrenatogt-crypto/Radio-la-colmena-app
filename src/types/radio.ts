export interface StationConfig {
  name: string;
  motto: string;
  streamUrl: string;
  fallbackStreamUrl?: string;
  logoUrl: string;
  description: string;
  location: string;
  phone: string;
  whatsapp: string;
  website: string;
  playStoreUrl: string;
  email: string;
  audioQuality: string;
}

export interface RadioSegment {
  id: string;
  title: string;
  host: string;
  description: string;
  days: string[]; // e.g. ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
  timeStart: string; // "07:00"
  timeEnd: string; // "10:00"
  posterUrl: string;
  externalLink?: string;
  status: 'live' | 'upcoming' | 'active' | 'archived';
  order: number;
}

export interface SocialNetwork {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'whatsapp' | 'googleplay' | 'web' | 'other';
  label: string;
  url: string;
  enabled: boolean;
  order: number;
}

export interface NowPlayingData {
  isOnline: boolean;
  raw: string;
  title: string;
  artist: string;
  artUrl?: string;
  listeners?: number;
  lastUpdated: number;
}

export interface ListenerMessage {
  id: string;
  name: string;
  location: string;
  message: string;
  songRequest?: string;
  createdAt: string;
  isRead: boolean;
}
