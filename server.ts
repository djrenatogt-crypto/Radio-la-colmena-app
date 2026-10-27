import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'station_data.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Secret for signing admin session tokens
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'colmena_secret_salt_' + Date.now();

// Password hashing helper
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash: h, salt: s };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(hash, 'hex'));
}

function generateToken(username: string): string {
  const payload = JSON.stringify({
    user: username,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });
  const b64 = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(b64).digest('base64url');
  return `${b64}.${signature}`;
}

function verifyToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [b64, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(b64).digest('base64url');
  if (signature !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

// Initial state data
const initialData = {
  config: {
    name: "Radio La Colmena",
    motto: "Endulzando tu vida",
    streamUrl: "https://vivo.miradio.in/8178/stream",
    fallbackStreamUrl: "https://vivo.miradio.in:8178/;",
    logoUrl: "/official_poster.jpg",
    description: "Emisora online oficial de Radio La Colmena con transmisión 24 horas continuas desde Amatitlán, Guatemala. Música variada, alegría, segmentos especiales y la mejor compañía para endulzar tus días.",
    location: "Amatitlán, Guatemala",
    phone: "+502 5127-3046",
    whatsapp: "+50251273046",
    website: "https://www.radiolacolmena.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=radio.la.colmena",
    email: "contacto@radiolacolmena.com",
    audioQuality: "128 kbps MP3 · 44.1 kHz Estéreo",
  },
  auth: {
    // Default initial admin login: admin / colmena2026 (changeable in the admin panel)
    salt: "e6f8a2c19b0d3e5f7a1c8e2b",
    hash: hashPassword("colmena2026", "e6f8a2c19b0d3e5f7a1c8e2b").hash,
  },
  segments: [
    {
      id: "seg_1",
      title: "El Café de las Mañanas",
      host: "Ana García & Luis Morales",
      description: "Tu despertar musical, notas positivas, clima y la mejor selección para arrancar el día con dulzura y energía positiva.",
      days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      timeStart: "07:00",
      timeEnd: "10:00",
      posterUrl: "/src/assets/images/poster_cafe_mananas_1793069769104.jpg",
      externalLink: "https://api.whatsapp.com/send?phone=+50251273046",
      status: "active",
      order: 1,
    },
    {
      id: "seg_2",
      title: "Ritmo Juvenil & Tendencias",
      host: "DJ Colmena",
      description: "Los mayores éxitos del pop latino, reggaetón, dance y música urbana que suena en todas las plataformas globales.",
      days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      timeStart: "16:00",
      timeEnd: "18:00",
      posterUrl: "/src/assets/images/poster_ritmo_urbano_1793069770951.jpg",
      externalLink: "https://play.google.com/store/apps/details?id=radio.la.colmena",
      status: "active",
      order: 2,
    },
    {
      id: "seg_3",
      title: "La Colmena Tropical & Cumbia",
      host: "DJ Renato Morales",
      description: "El mejor sabor de la cumbia, salsa y merengue bailable para alegrar las tardes y poner a bailar a toda la audiencia.",
      days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      timeStart: "18:00",
      timeEnd: "21:00",
      posterUrl: "/src/assets/images/poster_colmena_tropical_1793069770644.jpg",
      externalLink: "https://api.whatsapp.com/send?phone=+50251273046",
      status: "upcoming",
      order: 3,
    },
    {
      id: "seg_4",
      title: "Noches de Miel & Recuerdos",
      host: "Cadena Nocturna",
      description: "Baladas románticas en español, boleros, recuerdos dorados y las canciones que enamoran bajo la tranquilidad de la noche.",
      days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      timeStart: "22:00",
      timeEnd: "01:00",
      posterUrl: "/src/assets/images/poster_noches_miel_1793069770410.jpg",
      externalLink: "https://www.facebook.com/colegioforintel",
      status: "active",
      order: 4,
    },
  ],
  socials: [
    {
      id: "soc_wa",
      platform: "whatsapp",
      label: "WhatsApp Oficial",
      url: "https://wa.me/50251273046",
      enabled: true,
      order: 1,
    },
    {
      id: "soc_fb",
      platform: "facebook",
      label: "Facebook Oficial",
      url: "https://www.facebook.com/share/1F559sTg3X/",
      enabled: true,
      order: 2,
    },
    {
      id: "soc_gp",
      platform: "googleplay",
      label: "App en Google Play",
      url: "https://play.google.com/store/apps/details?id=radio.la.colmena",
      enabled: true,
      order: 3,
    },
    {
      id: "soc_web",
      platform: "web",
      label: "Sitio Web Oficial",
      url: "https://www.radiolacolmena.com",
      enabled: true,
      order: 4,
    },
    {
      id: "soc_ig",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/radiolacolmena",
      enabled: true,
      order: 5,
    },
    {
      id: "soc_yt",
      platform: "youtube",
      label: "YouTube",
      url: "https://youtube.com/@radiolacolmena",
      enabled: true,
      order: 6,
    },
    {
      id: "soc_tk",
      platform: "tiktok",
      label: "TikTok",
      url: "https://tiktok.com/@radiolacolmena",
      enabled: true,
      order: 7,
    },
  ],
  messages: [] as Array<{
    id: string;
    name: string;
    location: string;
    message: string;
    songRequest?: string;
    createdAt: string;
    isRead: boolean;
  }>,
};

// Load or initialize data file
function getData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading station_data.json, falling back to initial data', err);
    return initialData;
  }
}

function saveData(data: typeof initialData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Auth guard middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Se requiere token de administrador.' });
  }
  const token = authHeader.split(' ')[1];
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Token inválido o expirado. Inicia sesión nuevamente.' });
  }
  next();
}

// --- API ROUTES ---

// 1. Get Station Configuration
app.get('/api/config', (_req, res) => {
  const data = getData();
  res.json(data.config);
});

// Update Station Configuration (Admin only)
app.post('/api/config', requireAdmin, (req, res) => {
  const data = getData();
  const {
    name,
    motto,
    streamUrl,
    fallbackStreamUrl,
    logoUrl,
    description,
    location,
    phone,
    whatsapp,
    website,
    playStoreUrl,
    email,
    audioQuality,
  } = req.body;

  if (name) data.config.name = name.trim();
  if (motto) data.config.motto = motto.trim();
  if (streamUrl) data.config.streamUrl = streamUrl.trim();
  if (fallbackStreamUrl !== undefined) data.config.fallbackStreamUrl = fallbackStreamUrl.trim();
  if (logoUrl) data.config.logoUrl = logoUrl.trim();
  if (description) data.config.description = description.trim();
  if (location) data.config.location = location.trim();
  if (phone) data.config.phone = phone.trim();
  if (whatsapp) data.config.whatsapp = whatsapp.trim();
  if (website) data.config.website = website.trim();
  if (playStoreUrl !== undefined) data.config.playStoreUrl = playStoreUrl.trim();
  if (email) data.config.email = email.trim();
  if (audioQuality) data.config.audioQuality = audioQuality.trim();

  saveData(data);
  res.json({ success: true, config: data.config });
});

// 2. Real Now-Playing Proxy
let nowPlayingCache: { data: any; timestamp: number } | null = null;
app.get('/api/now-playing', async (_req, res) => {
  const now = Date.now();
  if (nowPlayingCache && now - nowPlayingCache.timestamp < 6000) {
    return res.json(nowPlayingCache.data);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const formData = new URLSearchParams();
    formData.append('rsys', 'scv26');
    formData.append('port', '8178');
    formData.append('NoCache', String(now));

    const response = await fetch('https://vivo.miradio.in/cp/widgets/player/single/nowplay.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 RadioLaColmena/1.0',
      },
      body: formData.toString(),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`NowPlaying returned status ${response.status}`);
    }

    const text = await response.text();
    const cleanText = text.replace(/<[^>]*>/g, '').trim();

    // Separate artist and song
    let artist = "Radio La Colmena";
    let title = cleanText || "Endulzando tu vida - En Vivo";

    if (cleanText.includes(' - ')) {
      const parts = cleanText.split(' - ');
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    } else if (cleanText.includes(' _')) {
      const parts = cleanText.split(' _');
      artist = parts[0].trim();
      title = parts.slice(1).join(' ').replace(/_/g, '').trim();
    }

    const payload = {
      isOnline: true,
      raw: cleanText,
      title: title || "Transmisión en Vivo",
      artist: artist || "Radio La Colmena",
      lastUpdated: now,
    };

    nowPlayingCache = { data: payload, timestamp: now };
    return res.json(payload);
  } catch (err: any) {
    // If the remote endpoint is momentarily slow or unreachable, return a graceful active live state
    const fallback = {
      isOnline: true,
      raw: "Radio La Colmena - Endulzando tu vida",
      title: "Transmisión en Vivo 24 Horas",
      artist: "Radio La Colmena",
      lastUpdated: now,
    };
    return res.json(fallback);
  }
});

// 3. Segments and Posters
app.get('/api/segments', (_req, res) => {
  const data = getData();
  const sorted = [...data.segments].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

app.post('/api/segments', requireAdmin, (req, res) => {
  const data = getData();
  const { title, host, description, days, timeStart, timeEnd, posterUrl, externalLink, status } = req.body;

  if (!title || !host) {
    return res.status(400).json({ error: 'Título y locutor son obligatorios.' });
  }

  const newSegment = {
    id: 'seg_' + Date.now(),
    title: String(title).trim(),
    host: String(host).trim(),
    description: String(description || '').trim(),
    days: Array.isArray(days) ? days : ['Lunes a Viernes'],
    timeStart: String(timeStart || '12:00').trim(),
    timeEnd: String(timeEnd || '14:00').trim(),
    posterUrl: String(posterUrl || '/official_poster.jpg').trim(),
    externalLink: externalLink ? String(externalLink).trim() : undefined,
    status: (['live', 'upcoming', 'active', 'archived'].includes(status) ? status : 'active') as any,
    order: data.segments.length + 1,
  };

  data.segments.push(newSegment);
  saveData(data);
  res.status(201).json(newSegment);
});

app.put('/api/segments/:id', requireAdmin, (req, res) => {
  const data = getData();
  const idx = data.segments.findIndex((s: any) => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Segmento no encontrado.' });
  }

  const current = data.segments[idx];
  const { title, host, description, days, timeStart, timeEnd, posterUrl, externalLink, status, order } = req.body;

  data.segments[idx] = {
    ...current,
    title: title !== undefined ? String(title).trim() : current.title,
    host: host !== undefined ? String(host).trim() : current.host,
    description: description !== undefined ? String(description).trim() : current.description,
    days: Array.isArray(days) ? days : current.days,
    timeStart: timeStart !== undefined ? String(timeStart).trim() : current.timeStart,
    timeEnd: timeEnd !== undefined ? String(timeEnd).trim() : current.timeEnd,
    posterUrl: posterUrl !== undefined ? String(posterUrl).trim() : current.posterUrl,
    externalLink: externalLink !== undefined ? String(externalLink).trim() : current.externalLink,
    status: status !== undefined ? status : current.status,
    order: order !== undefined ? Number(order) : current.order,
  };

  saveData(data);
  res.json(data.segments[idx]);
});

app.delete('/api/segments/:id', requireAdmin, (req, res) => {
  const data = getData();
  const beforeLen = data.segments.length;
  data.segments = data.segments.filter((s: any) => s.id !== req.params.id);
  if (data.segments.length === beforeLen) {
    return res.status(404).json({ error: 'Segmento no encontrado.' });
  }
  saveData(data);
  res.json({ success: true, deletedId: req.params.id });
});

app.post('/api/segments/reorder', requireAdmin, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'IDs array requerido.' });
  }
  const data = getData();
  const segmentMap = new Map<string, any>(data.segments.map((s: any) => [s.id, s]));
  const reordered: any[] = [];

  ids.forEach((id: string, index: number) => {
    const s = segmentMap.get(id);
    if (s) {
      s.order = index + 1;
      reordered.push(s);
      segmentMap.delete(id);
    }
  });

  // Append any segments not in the ids array
  segmentMap.forEach((s: any) => {
    s.order = reordered.length + 1;
    reordered.push(s);
  });

  data.segments = reordered;
  saveData(data);
  res.json({ success: true, segments: data.segments });
});

// 4. Social Networks
app.get('/api/socials', (_req, res) => {
  const data = getData();
  const sorted = [...data.socials].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

app.post('/api/socials', requireAdmin, (req, res) => {
  const { socials } = req.body;
  if (!Array.isArray(socials)) {
    return res.status(400).json({ error: 'Lista de redes requerida.' });
  }
  const data = getData();
  data.socials = socials.map((item, idx) => ({
    id: item.id || `soc_${idx}_${Date.now()}`,
    platform: item.platform || 'other',
    label: String(item.label || '').trim(),
    url: String(item.url || '').trim(),
    enabled: Boolean(item.enabled),
    order: idx + 1,
  }));
  saveData(data);
  res.json({ success: true, socials: data.socials });
});

// 5. Listener Contact & Song Requests
app.get('/api/messages', requireAdmin, (_req, res) => {
  const data = getData();
  res.json(data.messages || []);
});

app.post('/api/messages', (req, res) => {
  const { name, location, message, songRequest } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos.' });
  }
  const data = getData();
  if (!data.messages) data.messages = [];

  const newMessage = {
    id: 'msg_' + Date.now(),
    name: String(name).trim().slice(0, 80),
    location: String(location || 'Audiencia').trim().slice(0, 80),
    message: String(message).trim().slice(0, 600),
    songRequest: songRequest ? String(songRequest).trim().slice(0, 120) : undefined,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  data.messages.unshift(newMessage);
  // Keep max 200 messages
  if (data.messages.length > 200) data.messages = data.messages.slice(0, 200);
  saveData(data);

  res.status(201).json({ success: true, message: '¡Mensaje enviado a cabina con éxito!' });
});

app.put('/api/messages/:id/read', requireAdmin, (req, res) => {
  const data = getData();
  const msg = (data.messages || []).find((m: any) => m.id === req.params.id);
  if (msg) {
    msg.isRead = true;
    saveData(data);
  }
  res.json({ success: true });
});

app.delete('/api/messages/:id', requireAdmin, (req, res) => {
  const data = getData();
  data.messages = (data.messages || []).filter((m: any) => m.id !== req.params.id);
  saveData(data);
  res.json({ success: true });
});

// 6. Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Ingresa la contraseña de administrador.' });
  }

  const data = getData();
  const isValid = verifyPassword(password, data.auth.hash, data.auth.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  const token = generateToken('admin');
  res.json({
    success: true,
    token,
    user: { role: 'admin', name: 'Administrador Radio La Colmena' },
  });
});

app.post('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  const ok = verifyToken(token);
  res.json({ authenticated: ok });
});

app.post('/api/auth/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Contraseña actual y nueva requeridas.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  const data = getData();
  const isValid = verifyPassword(currentPassword, data.auth.hash, data.auth.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'La contraseña actual no es correcta.' });
  }

  const updatedAuth = hashPassword(newPassword);
  data.auth = updatedAuth;
  saveData(data);

  res.json({ success: true, message: 'Contraseña cambiada exitosamente.' });
});

// 7. Image Upload (Posters / Logos)
app.post('/api/upload', requireAdmin, (req, res) => {
  const { base64Data, filename } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: 'No se envió información de imagen.' });
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Formato de imagen inválido.' });
    }

    const ext = matches[1].includes('png') ? 'png' : matches[1].includes('webp') ? 'webp' : 'jpg';
    const cleanFilename = (filename || 'poster')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 30);
    const safeName = `${cleanFilename}_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

    res.json({
      success: true,
      url: `/uploads/${safeName}`,
    });
  } catch (err: any) {
    console.error('Error saving image:', err);
    res.status(500).json({ error: 'Error al guardar la imagen.' });
  }
});

// --- SERVER SETUP & VITE MOUNTING ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use('/uploads', express.static(UPLOADS_DIR));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use('/uploads', express.static(UPLOADS_DIR));
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Radio La Colmena server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
