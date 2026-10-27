import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { RadioSegment, SocialNetwork, StationConfig, ListenerMessage } from '../../types/radio';
import {
  Shield,
  Lock,
  LogOut,
  Radio,
  Image,
  Share2,
  Settings,
  MessageSquare,
  Key,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink,
  Play
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  segments: RadioSegment[];
  socials: SocialNetwork[];
  onRefreshData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  segments,
  socials,
  onRefreshData,
}) => {
  const { stationConfig, refreshConfig } = useAudio();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('colmena_admin_token'));
  const [activeTab, setActiveTab] = useState<'config' | 'segments' | 'socials' | 'messages' | 'security'>('config');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Config tab form state
  const [configForm, setConfigForm] = useState<StationConfig>(stationConfig);
  const [configSaving, setConfigSaving] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Segment edit/create modal state
  const [editingSegment, setEditingSegment] = useState<RadioSegment | null>(null);
  const [isNewSegment, setIsNewSegment] = useState(false);
  const [segmentSaving, setSegmentSaving] = useState(false);
  const [segmentError, setSegmentError] = useState<string | null>(null);

  // Socials edit state
  const [editableSocials, setEditableSocials] = useState<SocialNetwork[]>(socials);
  const [socialsSaving, setSocialsSaving] = useState(false);
  const [socialsSuccess, setSocialsSuccess] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<ListenerMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setConfigForm(stationConfig);
  }, [stationConfig]);

  useEffect(() => {
    setEditableSocials(socials);
  }, [socials]);

  // Load listener messages when messages tab is selected
  useEffect(() => {
    if (token && activeTab === 'messages') {
      fetchMessages();
    }
  }, [token, activeTab]);

  const fetchMessages = async () => {
    if (!token) return;
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Contraseña incorrecta');
      }

      setToken(data.token);
      localStorage.setItem('colmena_admin_token', data.token);
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('colmena_admin_token');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setConfigSaving(true);
    setConfigSuccess(false);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(configForm),
      });

      if (!res.ok) throw new Error('Error al guardar configuración');
      await refreshConfig();
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setConfigSaving(false);
    }
  };

  // Upload image handler
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    if (!token) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            base64Data,
            filename: file.name.replace(/\.[^/.]+$/, ''),
          }),
        });
        const data = await res.json();
        if (data.url) {
          callback(data.url);
        } else {
          alert('Error al subir la imagen');
        }
      } catch (e) {
        alert('Error al procesar el archivo');
      }
    };
    reader.readAsDataURL(file);
  };

  // Segment operations
  const handleSaveSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingSegment) return;
    setSegmentSaving(true);
    setSegmentError(null);

    try {
      const url = isNewSegment ? '/api/segments' : `/api/segments/${editingSegment.id}`;
      const method = isNewSegment ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingSegment),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Error al guardar segmento');
      }

      await onRefreshData();
      setEditingSegment(null);
    } catch (err: any) {
      setSegmentError(err.message);
    } finally {
      setSegmentSaving(false);
    }
  };

  const handleDeleteSegment = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar este segmento y su cartel?')) return;
    try {
      const res = await fetch(`/api/segments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (e) {
      alert('Error al eliminar');
    }
  };

  const handleReorderSegment = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const newSegments = [...segments];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSegments.length) return;

    const temp = newSegments[index];
    newSegments[index] = newSegments[targetIdx];
    newSegments[targetIdx] = temp;

    const ids = newSegments.map(s => s.id);
    try {
      await fetch('/api/segments/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
      });
      await onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Socials operations
  const handleSaveSocials = async () => {
    if (!token) return;
    setSocialsSaving(true);
    try {
      const res = await fetch('/api/socials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ socials: editableSocials }),
      });
      if (res.ok) {
        await onRefreshData();
        setSocialsSuccess(true);
        setTimeout(() => setSocialsSuccess(false), 2500);
      }
    } catch (e) {
      alert('Error al guardar redes');
    } finally {
      setSocialsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo actualizar la contraseña');
      }

      setPasswordSuccess('Contraseña actualizada exitosamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Panel de Control · Radio La Colmena
              </h2>
              <p className="text-[11px] text-neutral-400">
                Administración de streaming, carteles, segmentos y redes sociales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 transition-colors px-2 py-1"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
              aria-label="Cerrar panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!token ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-2xl font-bold text-white">Acceso Administrativo</h3>
              <p className="text-xs text-neutral-400">
                Ingresa la clave de administrador para gestionar la emisora.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {loginError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-neutral-300">Contraseña de Administrador</label>
                <input
                  type="password"
                  required
                  placeholder="Introduce la contraseña"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-amber-500/60 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-extrabold text-neutral-950 shadow-lg shadow-amber-500/15 hover:brightness-105 transition-all disabled:opacity-60"
              >
                {loginLoading ? 'Verificando...' : 'Entrar al Panel'}
              </button>

              <p className="text-[11px] text-neutral-500 pt-2">
                Clave inicial por defecto: <code className="bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">colmena2026</code> (Cámbiala en la pestaña Seguridad al entrar)
              </p>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-950/40 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'config'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Emisora & Streaming</span>
              </button>

              <button
                onClick={() => setActiveTab('segments')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'segments'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Image className="h-4 w-4" />
                <span>Programas y Segmentos ({segments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('socials')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'socials'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>Redes Sociales</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'messages'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Saludos de Cabina</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'security'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Key className="h-4 w-4" />
                <span>Seguridad</span>
              </button>
            </div>

            {/* TAB CONTENT (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: EMISORA & STREAMING */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-6 max-w-3xl">
                  {configSuccess && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Configuración guardada y actualizada con éxito.</span>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Nombre de la Emisora</label>
                      <input
                        type="text"
                        value={configForm.name}
                        onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Eslogan Oficial</label>
                      <input
                        type="text"
                        value={configForm.motto}
                        onChange={(e) => setConfigForm({ ...configForm, motto: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Streaming URL field with test link */}
                  <div className="space-y-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Radio className="h-4 w-4" />
                        URL Directa de Streaming en Vivo (Audio)
                      </label>
                      <a
                        href={configForm.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Probar en nueva pestaña</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <input
                      type="url"
                      required
                      value={configForm.streamUrl}
                      onChange={(e) => setConfigForm({ ...configForm, streamUrl: e.target.value })}
                      placeholder="https://vivo.miradio.in/8178/stream"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs font-mono text-white focus:border-amber-500/60 focus:outline-none"
                    />
                    <p className="text-[11px] text-neutral-400">
                      URL del servidor SonicPanel o Icecast/Shoutcast de Radio La Colmena (por defecto: https://vivo.miradio.in/8178/stream).
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Ubicación</label>
                      <input
                        type="text"
                        value={configForm.location}
                        onChange={(e) => setConfigForm({ ...configForm, location: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Teléfono / Cabina</label>
                      <input
                        type="text"
                        value={configForm.phone}
                        onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">WhatsApp (Número con código)</label>
                      <input
                        type="text"
                        value={configForm.whatsapp}
                        onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                        placeholder="+50251273046"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">Sitio Web Oficial</label>
                      <input
                        type="url"
                        value={configForm.website}
                        onChange={(e) => setConfigForm({ ...configForm, website: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Descripción de la Emisora</label>
                    <textarea
                      rows={3}
                      value={configForm.description}
                      onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Logotipo Oficial (URL o Subir)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={configForm.logoUrl}
                        onChange={(e) => setConfigForm({ ...configForm, logoUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                      />
                      <label className="cursor-pointer flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Subir</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], (url) => {
                                setConfigForm({ ...configForm, logoUrl: url });
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={configSaving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:brightness-105 transition-all disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    <span>{configSaving ? 'Guardando...' : 'Guardar Cambios de Emisora'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: PROGRAMAS & SEGMENTOS */}
              {activeTab === 'segments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">Programas y Segmentos</h3>
                      <p className="text-xs text-neutral-400">
                        Gestiona los programas, locutores, horarios e imágenes promocionales de emisión.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsNewSegment(true);
                        setEditingSegment({
                          id: '',
                          title: '',
                          host: '',
                          description: '',
                          days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
                          timeStart: '10:00',
                          timeEnd: '12:00',
                          posterUrl: '/official_poster.jpg',
                          status: 'active',
                          order: segments.length + 1,
                        });
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nuevo Programa</span>
                    </button>
                  </div>

                  {/* List of segments */}
                  <div className="space-y-3">
                    {segments.map((seg, idx) => (
                      <div
                        key={seg.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 transition-colors hover:border-neutral-700"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Poster thumbnail */}
                          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                            <img
                              src={seg.posterUrl}
                              alt={seg.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/official_poster.jpg';
                              }}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-sm font-bold text-white truncate">
                                {seg.title}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                seg.status === 'live'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : seg.status === 'upcoming'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {seg.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 truncate">
                              Locutor: <span className="text-neutral-200">{seg.host}</span> · {seg.timeStart} a {seg.timeEnd}
                            </p>
                            <p className="text-[11px] text-amber-400/90 font-mono-num truncate">
                              {seg.days.join(', ')}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => handleReorderSegment(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30"
                            title="Subir orden"
                          >
                            <MoveUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorderSegment(idx, 'down')}
                            disabled={idx === segments.length - 1}
                            className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30"
                            title="Bajar orden"
                          >
                            <MoveDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsNewSegment(false);
                              setEditingSegment({ ...seg });
                            }}
                            className="flex items-center gap-1 rounded-lg border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSegment(seg.id)}
                            className="p-1.5 rounded-lg border border-rose-900/50 text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* MODAL: Edit or Create Segment */}
                  {editingSegment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
                      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                          <h3 className="font-display text-lg font-bold text-white">
                            {isNewSegment ? 'Agregar Nuevo Programa' : 'Editar Programa'}
                          </h3>
                          <button
                            onClick={() => setEditingSegment(null)}
                            className="text-neutral-400 hover:text-white"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {segmentError && (
                          <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300">
                            {segmentError}
                          </div>
                        )}

                        <form onSubmit={handleSaveSegment} className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-neutral-300">Nombre del Programa *</label>
                              <input
                                type="text"
                                required
                                value={editingSegment.title}
                                onChange={(e) => setEditingSegment({ ...editingSegment, title: e.target.value })}
                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-neutral-300">Locutor / Conductor *</label>
                              <input
                                type="text"
                                required
                                value={editingSegment.host}
                                onChange={(e) => setEditingSegment({ ...editingSegment, host: e.target.value })}
                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-neutral-300">Hora Inicio</label>
                              <input
                                type="text"
                                placeholder="08:00"
                                value={editingSegment.timeStart}
                                onChange={(e) => setEditingSegment({ ...editingSegment, timeStart: e.target.value })}
                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-neutral-300">Hora Fin</label>
                              <input
                                type="text"
                                placeholder="10:00"
                                value={editingSegment.timeEnd}
                                onChange={(e) => setEditingSegment({ ...editingSegment, timeEnd: e.target.value })}
                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-neutral-300">Estado</label>
                              <select
                                value={editingSegment.status}
                                onChange={(e) => setEditingSegment({ ...editingSegment, status: e.target.value as any })}
                                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                              >
                                <option value="active">Activo</option>
                                <option value="live">En Vivo Ahora</option>
                                <option value="upcoming">Próximo</option>
                                <option value="archived">Archivado</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-300">Días de Transmisión (separados por coma)</label>
                            <input
                              type="text"
                              value={editingSegment.days.join(', ')}
                              onChange={(e) => setEditingSegment({
                                ...editingSegment,
                                days: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                              })}
                              placeholder="Lunes, Martes, Miércoles, Jueves, Viernes"
                              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-300">Descripción Breve</label>
                            <textarea
                              rows={3}
                              value={editingSegment.description}
                              onChange={(e) => setEditingSegment({ ...editingSegment, description: e.target.value })}
                              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-300">Imagen / Cartel Promocional</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={editingSegment.posterUrl}
                                onChange={(e) => setEditingSegment({ ...editingSegment, posterUrl: e.target.value })}
                                className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                              />
                              <label className="cursor-pointer flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700">
                                <Upload className="h-3.5 w-3.5" />
                                <span>Subir Archivo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleImageUpload(e.target.files[0], (url) => {
                                        setEditingSegment({ ...editingSegment, posterUrl: url });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            {editingSegment.posterUrl && (
                              <div className="h-28 w-20 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 mt-2">
                                <img
                                  src={editingSegment.posterUrl}
                                  alt="Vista previa cartel"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-300">Enlace Opcional (Redes o Sitio)</label>
                            <input
                              type="url"
                              value={editingSegment.externalLink || ''}
                              onChange={(e) => setEditingSegment({ ...editingSegment, externalLink: e.target.value })}
                              placeholder="https://..."
                              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                            />
                          </div>

                          <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
                            <button
                              type="button"
                              onClick={() => setEditingSegment(null)}
                              className="rounded-xl border border-neutral-700 px-4 py-2 text-xs text-neutral-300 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              disabled={segmentSaving}
                              className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-60"
                            >
                              {segmentSaving ? 'Guardando...' : 'Guardar Segmento'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: REDES SOCIALES */}
              {activeTab === 'socials' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">Redes Sociales y Enlaces</h3>
                      <p className="text-xs text-neutral-400">
                        Configura los enlaces directos a Facebook, WhatsApp, Instagram, YouTube, TikTok o Play Store.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditableSocials([
                          ...editableSocials,
                          {
                            id: `soc_${Date.now()}`,
                            platform: 'other',
                            label: 'Nueva Red Social',
                            url: 'https://',
                            enabled: true,
                            order: editableSocials.length + 1,
                          },
                        ]);
                      }}
                      className="flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-white hover:bg-neutral-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Agregar Red</span>
                    </button>
                  </div>

                  {socialsSuccess && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Redes sociales actualizadas correctamente.</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {editableSocials.map((soc, idx) => (
                      <div
                        key={soc.id}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4"
                      >
                        <select
                          value={soc.platform}
                          onChange={(e) => {
                            const updated = [...editableSocials];
                            updated[idx].platform = e.target.value as any;
                            setEditableSocials(updated);
                          }}
                          className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="whatsapp">WhatsApp</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="youtube">YouTube</option>
                          <option value="googleplay">Google Play</option>
                          <option value="web">Sitio Web</option>
                          <option value="other">Otro</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Etiqueta (ej. Facebook Oficial)"
                          value={soc.label}
                          onChange={(e) => {
                            const updated = [...editableSocials];
                            updated[idx].label = e.target.value;
                            setEditableSocials(updated);
                          }}
                          className="w-full sm:w-44 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none"
                        />

                        <input
                          type="url"
                          placeholder="https://..."
                          value={soc.url}
                          onChange={(e) => {
                            const updated = [...editableSocials];
                            updated[idx].url = e.target.value;
                            setEditableSocials(updated);
                          }}
                          className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none"
                        />

                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...editableSocials];
                              updated[idx].enabled = !updated[idx].enabled;
                              setEditableSocials(updated);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                              soc.enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {soc.enabled ? 'Activa' : 'Oculta'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditableSocials(editableSocials.filter((_, i) => i !== idx));
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveSocials}
                    disabled={socialsSaving}
                    className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    <span>{socialsSaving ? 'Guardando...' : 'Guardar Cambios de Redes'}</span>
                  </button>
                </div>
              )}

              {/* TAB 4: MENSAJES Y SALUDOS DE OYENTES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">Saludos y Mensajes de Oyentes</h3>
                      <p className="text-xs text-neutral-400">
                        Mensajes recibidos en tiempo real a través del formulario de la aplicación.
                      </p>
                    </div>
                    <button
                      onClick={fetchMessages}
                      className="rounded-xl border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
                    >
                      Actualizar
                    </button>
                  </div>

                  {loadingMessages ? (
                    <p className="text-xs text-neutral-400 py-6">Cargando mensajes...</p>
                  ) : messages.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center text-xs text-neutral-400">
                      Aún no se han recibido saludos o pedidos de canciones.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center gap-2">
                              {msg.name}
                              <span className="text-neutral-500 font-normal">· {msg.location}</span>
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {new Date(msg.createdAt).toLocaleString('es-GT')}
                            </span>
                          </div>

                          {msg.songRequest && (
                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300">
                              <strong>Canción pedida:</strong> {msg.songRequest}
                            </div>
                          )}

                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SEGURIDAD / CAMBIAR CONTRASEÑA */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Cambiar Contraseña de Administrador</h3>
                    <p className="text-xs text-neutral-400">
                      Actualiza las credenciales de acceso para proteger el panel.
                    </p>
                  </div>

                  {passwordSuccess && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300">
                      {passwordSuccess}
                    </div>
                  )}

                  {passwordError && (
                    <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">Contraseña Actual *</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">Nueva Contraseña (mín. 6 caracteres) *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">Confirmar Nueva Contraseña *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-60"
                  >
                    <Key className="h-4 w-4" />
                    <span>{passwordSaving ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
