import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Authority, 
  OrganigramLevel, 
  CalendarEvent, 
  NoticeItem, 
  DiplomaRecord, 
  FeedbackRecord, 
  InitiativeItem, 
  CommitmentRule, 
  AppConfig,
  Coordinador
} from '../types';
import { 
  AUTHORITIES, 
  INITIAL_ORGANIGRAM, 
  INITIAL_CALENDAR, 
  INITIAL_NOTICES, 
  INITIAL_DIPLOMAS, 
  INITIAL_FEEDBACK, 
  INITIATIVES, 
  COMMITMENT_RULES, 
  INITIAL_CONFIG,
  INITIAL_COORDINADORES
} from '../data/initialData';

/**
 * Lectura de variables de entorno de Supabase compatibles con:
 * - Vite: import.meta.env.VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * - Vercel Integration / Next.js: import.meta.env.NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - Backend / Shell: import.meta.env.SUPABASE_URL / SUPABASE_ANON_KEY
 * - Panel Administrador (Local Storage): ci_supabase_url / ci_supabase_anon_key
 */
const rawUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL ||
  (typeof window !== 'undefined' ? localStorage.getItem('ci_supabase_url') || '' : '');

const rawAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' ? localStorage.getItem('ci_supabase_anon_key') || '' : '');

/**
 * Limpia la URL de Supabase eliminando barras finales y segmentos accidentales como /rest/v1.
 */
export const cleanSupabaseUrl = (url?: string): string => {
  if (!url) return '';
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
};

const cleanUrl = cleanSupabaseUrl(rawUrl);
const cleanKey = (rawAnonKey || '').trim();

/**
 * Verifica si las credenciales de Supabase están definidas y son válidas.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof cleanUrl === 'string' &&
    cleanUrl.startsWith('https://') &&
    cleanUrl.includes('.supabase.co') &&
    !cleanUrl.includes('placeholder') &&
    typeof cleanKey === 'string' &&
    cleanKey.length > 20 &&
    !cleanKey.includes('dummy')
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    '[Supabase] Variables de conexión no definidas (VITE_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL). ' +
    'No se realizarán llamadas a dominios inexistentes. Puedes configurar las credenciales en el Panel Administrador.'
  );
}

/**
 * Cliente de Supabase:
 * - Si las variables están definidas, se conecta a la instancia real en la nube.
 * - Si no están definidas, provee un cliente seguro que previene colapsos.
 */
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : ({
      from: (table: string) => ({
        select: (columns = '*') => {
          console.warn(`[Supabase] Consulta omitida en tabla '${table}': variables de Supabase no definidas.`);
          return Promise.resolve({ data: [], error: null });
        },
        upsert: (data: any, opts?: any) => {
          console.warn(`[Supabase] Guardado (upsert) omitido en tabla '${table}': variables no definidas.`);
          const resultData = Array.isArray(data) ? data : [data];
          return {
            select: () => Promise.resolve({ data: resultData, error: null })
          };
        },
        update: (data: any) => {
          console.warn(`[Supabase] Actualización omitida en tabla '${table}': variables no definidas.`);
          return {
            eq: () => ({
              select: () => Promise.resolve({ data: [data], error: null })
            })
          };
        },
        delete: () => {
          console.warn(`[Supabase] Eliminación omitida en tabla '${table}': variables no definidas.`);
          return {
            eq: () => Promise.resolve({ data: null, error: null })
          };
        }
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async () => {
            console.warn(`[Supabase Storage] Subida omitida en bucket '${bucket}': variables no definidas.`);
            return { data: null, error: { message: 'Variables de Supabase no definidas' } };
          },
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      },
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
        subscribe: () => ({ unsubscribe: () => {} })
      }),
      removeChannel: () => Promise.resolve('ok')
    } as unknown as SupabaseClient);

// ============================================================================
// 1. DIRECTIVOS (public.directivos)
// ============================================================================

export interface DirectivoRow {
  id: string;
  nombre: string;
  cargo: string;
  area: string;
  email: string;
  telefono?: string | null;
  biografia?: string | null;
  foto_url: string;
  drive_id?: string | null;
  created_at?: string;
}

export function mapRowToAuthority(row: DirectivoRow | any): Authority {
  return {
    id: String(row.id || `auth-${Date.now()}`),
    name: row.nombre || row.name || '',
    role: row.cargo || row.role || '',
    area: row.area || '',
    email: row.email || '',
    phoneExt: row.telefono || row.phoneExt || '',
    bio: row.biografia || row.bio || '',
    photoUrl: row.foto_url || row.photoUrl || ''
  };
}

export function mapAuthorityToRow(auth: Authority): DirectivoRow {
  return {
    id: auth.id,
    nombre: auth.name,
    cargo: auth.role,
    area: auth.area,
    email: auth.email,
    telefono: auth.phoneExt || '',
    biografia: auth.bio || '',
    foto_url: auth.photoUrl || ''
  };
}

export async function fetchDirectivos(): Promise<Authority[]> {
  if (!isSupabaseConfigured()) return AUTHORITIES;

  try {
    const { data, error } = await supabase
      .from('directivos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error("Error Supabase al cargar directivos:", error);
      return AUTHORITIES;
    }

    if (!data || data.length === 0) {
      console.log("Tabla 'directivos' vacía en Supabase. Usando fallback institucional.");
      return AUTHORITIES;
    }

    console.log("Cargando directivos desde Supabase:", data);
    return data.map(mapRowToAuthority);
  } catch (err) {
    console.error("Excepción al cargar directivos desde Supabase:", err);
    return AUTHORITIES;
  }
}

export async function upsertDirectivo(auth: Authority): Promise<Authority> {
  const directivoData = mapAuthorityToRow(auth);
  const { data, error } = await supabase
    .from('directivos')
    .upsert(directivoData, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase al guardar directivo:", error);
    throw error;
  }

  console.log("Guardado en Supabase (directivo):", data);
  return data && data.length > 0 ? mapRowToAuthority(data[0]) : auth;
}

export async function insertDirectivo(auth: Authority): Promise<Authority> {
  return upsertDirectivo(auth);
}

export async function updateDirectivo(auth: Authority): Promise<Authority> {
  return upsertDirectivo(auth);
}

export async function deleteDirectivo(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('directivos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error Supabase al eliminar directivo:", error);
    throw error;
  }

  console.log("Eliminado de Supabase (directivo):", id);
  return true;
}

// ============================================================================
// 1.1 COORDINADORES DE ÁREA (public.coordinadores)
// ============================================================================

export async function fetchCoordinadores(): Promise<Coordinador[]> {
  if (!isSupabaseConfigured()) return INITIAL_COORDINADORES;

  try {
    const { data, error } = await supabase
      .from('coordinadores')
      .select('*')
      .order('orden', { ascending: true });

    if (error) {
      console.warn("[Supabase] Error al cargar coordinadores:", error.message);
      return INITIAL_COORDINADORES;
    }

    if (!data || data.length === 0) {
      console.log("Tabla 'coordinadores' vacía en Supabase. Usando fallback institucional.");
      return INITIAL_COORDINADORES;
    }

    console.log("Cargando coordinadores desde Supabase:", data);
    return data.map((row: any) => ({
      id: Number(row.id),
      nombre: row.nombre || '',
      cargo: row.cargo || '',
      foto_url: row.foto_url ?? null,
      orden: row.orden !== undefined && row.orden !== null ? Number(row.orden) : 1
    }));
  } catch (err) {
    console.error("Excepción al cargar coordinadores desde Supabase:", err);
    return INITIAL_COORDINADORES;
  }
}

export async function upsertCoordinador(coordinador: Coordinador): Promise<Coordinador> {
  const payload: any = {
    nombre: coordinador.nombre.trim(),
    cargo: coordinador.cargo.trim(),
    foto_url: coordinador.foto_url || null,
    orden: Number(coordinador.orden || 1)
  };

  if (coordinador.id && coordinador.id > 0) {
    payload.id = coordinador.id;
  }

  const { data, error } = await supabase
    .from('coordinadores')
    .upsert(payload, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase al guardar coordinador:", error);
    throw error;
  }

  console.log("Guardado en Supabase (coordinador):", data);
  if (data && data.length > 0) {
    const r = data[0];
    return {
      id: Number(r.id),
      nombre: r.nombre || '',
      cargo: r.cargo || '',
      foto_url: r.foto_url ?? null,
      orden: Number(r.orden || 1)
    };
  }
  return coordinador;
}

export async function deleteCoordinador(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('coordinadores')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error Supabase al eliminar coordinador:", error);
    throw error;
  }

  console.log("Eliminado de Supabase (coordinador):", id);
  return true;
}

export function subscribeToCoordinadores(callback: (coordinadores: Coordinador[]) => void): () => void {
  return subscribeToTable('coordinadores', async () => {
    const fresh = await fetchCoordinadores();
    callback(fresh);
  });
}

// ============================================================================
// 2. CALENDARIO Y EVENTOS (public.calendario_eventos)
// ============================================================================

export interface CalendarEventRow {
  id: string;
  mes: number;
  nombre_mes: string;
  fecha_str: string;
  titulo: string;
  categoria: string;
  responsable: string;
  descripcion?: string | null;
  audiencia: string;
  created_at?: string;
}

export function mapRowToCalendarEvent(row: CalendarEventRow | any): CalendarEvent {
  return {
    id: String(row.id),
    month: Number(row.mes),
    monthName: row.nombre_mes || '',
    dateStr: row.fecha_str || '',
    title: row.titulo || '',
    category: row.categoria || 'Institucional',
    responsible: row.responsable || '',
    description: row.descripcion || '',
    targetAudience: row.audiencia || 'Comunidad'
  };
}

export function mapCalendarEventToRow(evt: CalendarEvent): CalendarEventRow {
  return {
    id: evt.id,
    mes: evt.month,
    nombre_mes: evt.monthName,
    fecha_str: evt.dateStr,
    titulo: evt.title,
    categoria: evt.category,
    responsable: evt.responsible,
    descripcion: evt.description || '',
    audiencia: evt.targetAudience || 'Comunidad'
  };
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) return INITIAL_CALENDAR;

  try {
    const { data, error } = await supabase
      .from('calendario_eventos')
      .select('*')
      .order('mes', { ascending: true });

    if (error) {
      console.error("Error Supabase al cargar calendario:", error);
      return INITIAL_CALENDAR;
    }

    if (!data || data.length === 0) {
      console.log("Tabla 'calendario_eventos' vacía en Supabase. Usando fallback.");
      return INITIAL_CALENDAR;
    }

    console.log("Cargando calendario desde Supabase:", data);
    return data.map(mapRowToCalendarEvent);
  } catch (err) {
    console.error("Excepción al cargar calendario desde Supabase:", err);
    return INITIAL_CALENDAR;
  }
}

export async function upsertCalendarEvent(evt: CalendarEvent): Promise<CalendarEvent> {
  const row = mapCalendarEventToRow(evt);
  const { data, error } = await supabase
    .from('calendario_eventos')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase al guardar evento de calendario:", error);
    throw error;
  }

  console.log("Guardado en Supabase (calendario):", data);
  return data && data.length > 0 ? mapRowToCalendarEvent(data[0]) : evt;
}

export async function deleteCalendarEvent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('calendario_eventos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error Supabase al eliminar evento de calendario:", error);
    throw error;
  }

  console.log("Eliminado de Supabase (calendario):", id);
  return true;
}

// ============================================================================
// 3. NOVEDADES Y AVISOS (public.novedades_avisos)
// ============================================================================

export interface NoticeRow {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  prioridad: 'alta' | 'media' | 'normal';
  fijado: boolean;
  fecha: string;
  created_at?: string;
}

export function mapRowToNotice(row: NoticeRow | any): NoticeItem {
  return {
    id: String(row.id),
    title: row.titulo || '',
    content: row.contenido || '',
    author: row.autor || '',
    priority: row.prioridad || 'normal',
    pinned: Boolean(row.fijado),
    date: row.fecha || ''
  };
}

export function mapNoticeToRow(notice: NoticeItem): NoticeRow {
  return {
    id: notice.id,
    titulo: notice.title,
    contenido: notice.content,
    autor: notice.author,
    prioridad: notice.priority,
    fijado: Boolean(notice.pinned),
    fecha: notice.date
  };
}

export async function fetchNotices(): Promise<NoticeItem[]> {
  if (!isSupabaseConfigured()) return INITIAL_NOTICES;

  try {
    const { data, error } = await supabase
      .from('novedades_avisos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error Supabase al cargar novedades:", error);
      return INITIAL_NOTICES;
    }

    if (!data || data.length === 0) {
      console.log("Tabla 'novedades_avisos' vacía en Supabase. Usando fallback.");
      return INITIAL_NOTICES;
    }

    console.log("Cargando novedades desde Supabase:", data);
    return data.map(mapRowToNotice);
  } catch (err) {
    console.error("Excepción al cargar novedades desde Supabase:", err);
    return INITIAL_NOTICES;
  }
}

export async function upsertNotice(notice: NoticeItem): Promise<NoticeItem> {
  const row = mapNoticeToRow(notice);
  const { data, error } = await supabase
    .from('novedades_avisos')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase al guardar aviso:", error);
    throw error;
  }

  console.log("Guardado en Supabase (aviso):", data);
  return data && data.length > 0 ? mapRowToNotice(data[0]) : notice;
}

export async function deleteNotice(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('novedades_avisos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error Supabase al eliminar aviso:", error);
    throw error;
  }

  console.log("Eliminado de Supabase (aviso):", id);
  return true;
}

// ============================================================================
// 4. ORGANIGRAMA (public.organigrama_niveles y public.portal_config)
// ============================================================================

export async function fetchOrganigram(): Promise<OrganigramLevel[]> {
  if (!isSupabaseConfigured()) return INITIAL_ORGANIGRAM;

  try {
    // 1. Intentar desde la tabla especializada organigrama_niveles
    const { data: nivelesData, error: nivelesErr } = await supabase
      .from('organigrama_niveles')
      .select('*')
      .order('numero_nivel', { ascending: true });

    if (!nivelesErr && nivelesData && nivelesData.length > 0) {
      console.log("Cargando organigrama desde tabla 'organigrama_niveles':", nivelesData);
      return nivelesData.map((row: any) => ({
        id: String(row.id),
        levelNumber: Number(row.numero_nivel),
        levelName: row.nombre_nivel || '',
        badge: row.badge || '',
        color: row.color || '',
        description: row.descripcion || '',
        nodes: Array.isArray(row.nodos) ? row.nodos : []
      }));
    }

    // 2. Fallback a portal_config key 'organigrama'
    const { data: configData } = await supabase
      .from('portal_config')
      .select('value')
      .eq('key', 'organigrama')
      .maybeSingle();

    if (configData && configData.value) {
      const val = typeof configData.value === 'string' ? JSON.parse(configData.value) : configData.value;
      if (Array.isArray(val) && val.length > 0) {
        return val;
      }
    }

    return INITIAL_ORGANIGRAM;
  } catch (err) {
    console.error("Excepción al cargar organigrama desde Supabase:", err);
    return INITIAL_ORGANIGRAM;
  }
}

export async function saveOrganigram(levels: OrganigramLevel[]): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    // 1. Persistir en organigrama_niveles
    const rows = levels.map(l => ({
      id: l.id,
      numero_nivel: l.levelNumber,
      nombre_nivel: l.levelName,
      badge: l.badge,
      color: l.color,
      descripcion: l.description,
      nodos: l.nodes
    }));

    await supabase
      .from('organigrama_niveles')
      .upsert(rows, { onConflict: 'id' });

    // 2. Persistir respaldo en portal_config
    await supabase
      .from('portal_config')
      .upsert({
        key: 'organigrama',
        value: levels,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    console.log("Guardado en Supabase (Organigrama): exitoso");
    return true;
  } catch (err) {
    console.error("Error al guardar organigrama en Supabase:", err);
    throw err;
  }
}

// ============================================================================
// 5. INICIATIVAS (public.iniciativas)
// ============================================================================

export function mapRowToInitiative(row: any): InitiativeItem {
  return {
    id: String(row.id),
    title: row.titulo || '',
    referent: row.referente || '',
    referentRole: row.cargo_referente || '',
    category: row.categoria || '',
    iconName: row.icono || 'Sparkles',
    accentColor: row.color_acento || '#DE4034',
    queHacemos: row.que_hacemos || '',
    porqueLoHacemos: row.porque_lo_hacemos || '',
    queValorAporta: row.que_valor_aporta || '',
    videoDriveId: row.video_drive_id || '',
    tags: Array.isArray(row.etiquetas) ? row.etiquetas : []
  };
}

export async function fetchInitiatives(): Promise<InitiativeItem[]> {
  if (!isSupabaseConfigured()) return INITIATIVES;

  try {
    const { data, error } = await supabase
      .from('iniciativas')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIATIVES;
    }

    console.log("Cargando iniciativas desde Supabase:", data);
    return data.map(mapRowToInitiative);
  } catch (err) {
    console.error("Error al cargar iniciativas desde Supabase:", err);
    return INITIATIVES;
  }
}

// ============================================================================
// 6. COMPROMISOS / MISIÓN 04 (public.mision4_compromisos)
// ============================================================================

export function mapRowToCommitment(row: any): CommitmentRule {
  const numero = Number(row.numero || 1);
  const defaultCommitment = COMMITMENT_RULES.find(c => c.number === numero) || COMMITMENT_RULES[0];

  const rawImage = row.imagen_url || row.image_url || row.image || defaultCommitment.image || `mision4-${numero}.jpg`;
  const resolvedImage = resolveMision4ImageUrl(rawImage);

  let tips: string[] = [];
  if (Array.isArray(row.consejos)) {
    tips = row.consejos;
  } else if (Array.isArray(row.tips)) {
    tips = row.tips;
  } else if (typeof row.consejos === 'string') {
    try {
      const parsed = JSON.parse(row.consejos);
      if (Array.isArray(parsed)) tips = parsed;
      else tips = row.consejos.split('\n').filter(Boolean);
    } catch {
      tips = row.consejos.split('\n').filter(Boolean);
    }
  } else {
    tips = defaultCommitment.tips;
  }

  return {
    number: numero,
    title: row.titulo || row.title || defaultCommitment.title,
    highlight: row.mensaje_destacado || row.destaque || row.highlight || defaultCommitment.highlight,
    description: row.descripcion || row.description || defaultCommitment.description,
    tips: tips.length > 0 ? tips : defaultCommitment.tips,
    iconName: row.icono || row.iconName || defaultCommitment.iconName,
    badge: row.badge || defaultCommitment.badge,
    image: resolvedImage,
    closingQuote: row.frase_cierre || row.closingQuote || defaultCommitment.closingQuote
  };
}

export async function fetchCommitmentRules(): Promise<CommitmentRule[]> {
  if (!isSupabaseConfigured()) {
    return COMMITMENT_RULES.map(c => ({
      ...c,
      image: resolveMision4ImageUrl(c.image || `mision4-${c.number}.jpg`)
    }));
  }

  try {
    // 1. Cargar desde la tabla 'mision4_compromisos' ordenada por 'numero' (1 al 6)
    const { data, error } = await supabase
      .from('mision4_compromisos')
      .select('*')
      .order('numero', { ascending: true });

    if (error) {
      console.warn("[Supabase] Tabla 'mision4_compromisos' no accesible:", error.message);
      // Fallback a 'compromisos_cultura' si existe
      const { data: cultData } = await supabase
        .from('compromisos_cultura')
        .select('*')
        .order('numero', { ascending: true });
      if (cultData && cultData.length > 0) {
        return cultData.map(mapRowToCommitment);
      }
      return COMMITMENT_RULES.map(c => ({
        ...c,
        image: resolveMision4ImageUrl(c.image || `mision4-${c.number}.jpg`)
      }));
    }

    if (!data || data.length === 0) {
      console.log("Tabla 'mision4_compromisos' vacía. Retornando compromisos iniciales.");
      return COMMITMENT_RULES.map(c => ({
        ...c,
        image: resolveMision4ImageUrl(c.image || `mision4-${c.number}.jpg`)
      }));
    }

    console.log("Cargando compromisos desde Supabase ('mision4_compromisos'):", data);
    return data.map(mapRowToCommitment);
  } catch (err) {
    console.error("Error al cargar compromisos desde Supabase:", err);
    return COMMITMENT_RULES.map(c => ({
      ...c,
      image: resolveMision4ImageUrl(c.image || `mision4-${c.number}.jpg`)
    }));
  }
}

export async function upsertMision4Compromiso(commitment: CommitmentRule): Promise<CommitmentRule> {
  const rowData: Record<string, any> = {
    id: `mision4-${commitment.number}`,
    numero: commitment.number,
    titulo: commitment.title,
    mensaje_destacado: commitment.highlight,
    destaque: commitment.highlight,
    descripcion: commitment.description,
    consejos: commitment.tips,
    icono: commitment.iconName,
    badge: commitment.badge,
    imagen_url: commitment.image || `mision4-${commitment.number}.jpg`,
    frase_cierre: commitment.closingQuote || '',
    updated_at: new Date().toISOString()
  };

  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Variables no configuradas. Guardado en memoria.');
    return {
      ...commitment,
      image: resolveMision4ImageUrl(commitment.image)
    };
  }

  // Intentar upsert con onConflict numero
  let { data, error } = await supabase
    .from('mision4_compromisos')
    .upsert(rowData, { onConflict: 'numero' })
    .select();

  if (error) {
    console.warn('[Supabase] Reintentando upsert en mision4_compromisos con onConflict id:', error.message);
    const retry = await supabase
      .from('mision4_compromisos')
      .upsert(rowData, { onConflict: 'id' })
      .select();
    if (retry.error) {
      console.error('[Supabase] Error al guardar en mision4_compromisos:', retry.error);
      throw retry.error;
    }
    data = retry.data;
  }

  console.log('Compromiso Misión 04 guardado exitosamente en Supabase:', data);
  return data && data.length > 0 ? mapRowToCommitment(data[0]) : commitment;
}

// ============================================================================
// 7. DIPLOMAS EMITIDOS (public.diplomas_emitidos)
// ============================================================================

export interface DiplomaRow {
  id: string;
  folio: string;
  nombre_completo: string;
  puesto_sector: string;
  email: string;
  fecha_ingreso: string;
  fecha_emision?: string;
  hash_verificacion: string;
  estado: string;
  created_at?: string;
}

export function mapRowToDiploma(row: any): DiplomaRecord {
  return {
    id: String(row.id),
    certificateFolio: row.folio || '',
    fullName: row.nombre_completo || '',
    role: row.puesto_sector || '',
    email: row.email || '',
    entryDate: row.fecha_ingreso || '',
    timestamp: row.fecha_emision || '',
    verificationHash: row.hash_verificacion || '',
    status: (row.estado as any) || 'Emitido'
  };
}

export function mapDiplomaToRow(diploma: DiplomaRecord): DiplomaRow {
  return {
    id: diploma.id,
    folio: diploma.certificateFolio,
    nombre_completo: diploma.fullName,
    puesto_sector: diploma.role,
    email: diploma.email,
    fecha_ingreso: diploma.entryDate,
    fecha_emision: diploma.timestamp || new Date().toISOString(),
    hash_verificacion: diploma.verificationHash,
    estado: diploma.status
  };
}

export async function fetchDiplomas(): Promise<DiplomaRecord[]> {
  if (!isSupabaseConfigured()) return INITIAL_DIPLOMAS;

  try {
    const { data, error } = await supabase
      .from('diplomas_emitidos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error Supabase al cargar diplomas:", error);
      return INITIAL_DIPLOMAS;
    }

    if (!data || data.length === 0) {
      return INITIAL_DIPLOMAS;
    }

    console.log("Cargando diplomas desde Supabase:", data);
    return data.map(mapRowToDiploma);
  } catch (err) {
    console.error("Excepción al cargar diplomas desde Supabase:", err);
    return INITIAL_DIPLOMAS;
  }
}

export async function insertDiploma(diploma: DiplomaRecord): Promise<DiplomaRecord> {
  const row = mapDiplomaToRow(diploma);
  const { data, error } = await supabase
    .from('diplomas_emitidos')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase al registrar diploma:", error);
    throw error;
  }

  console.log("Guardado en Supabase (diploma):", data);
  return data && data.length > 0 ? mapRowToDiploma(data[0]) : diploma;
}

export async function deleteDiploma(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('diplomas_emitidos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error Supabase al eliminar diploma:", error);
    throw error;
  }

  console.log("Eliminado de Supabase (diploma):", id);
  return true;
}

// ============================================================================
// 8. FEEDBACK Y SATISFACCIÓN (public.feedback_satisfaccion)
// ============================================================================

export interface FeedbackRow {
  id: string;
  nombre_completo: string;
  puesto_sector: string;
  calificacion_general: number;
  calificacion_claridad: number;
  seccion_mas_util?: string | null;
  sugerencias?: string | null;
  recomendaria: boolean;
  fecha?: string;
  created_at?: string;
}

export function mapRowToFeedback(row: any): FeedbackRecord {
  return {
    id: String(row.id),
    fullName: row.nombre_completo || '',
    role: row.puesto_sector || '',
    overallRating: Number(row.calificacion_general || 5),
    clarityRating: Number(row.calificacion_claridad || 5),
    mostUsefulSection: row.seccion_mas_util || '',
    suggestions: row.sugerencias || '',
    wouldRecommend: Boolean(row.recomendaria),
    timestamp: row.fecha || ''
  };
}

export function mapFeedbackToRow(f: FeedbackRecord): FeedbackRow {
  return {
    id: f.id,
    nombre_completo: f.fullName,
    puesto_sector: f.role,
    calificacion_general: f.overallRating,
    calificacion_claridad: f.clarityRating,
    seccion_mas_util: f.mostUsefulSection,
    sugerencias: f.suggestions,
    recomendaria: f.wouldRecommend,
    fecha: f.timestamp || new Date().toISOString()
  };
}

export async function fetchFeedbacks(): Promise<FeedbackRecord[]> {
  if (!isSupabaseConfigured()) return INITIAL_FEEDBACK;

  try {
    const { data, error } = await supabase
      .from('feedback_satisfaccion')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error Supabase al cargar feedbacks:", error);
      return INITIAL_FEEDBACK;
    }

    if (!data || data.length === 0) {
      return INITIAL_FEEDBACK;
    }

    console.log("Cargando feedbacks desde Supabase:", data);
    return data.map(mapRowToFeedback);
  } catch (err) {
    console.error("Excepción al cargar feedbacks desde Supabase:", err);
    return INITIAL_FEEDBACK;
  }
}

export async function insertFeedback(feedback: FeedbackRecord): Promise<FeedbackRecord> {
  const row = mapFeedbackToRow(feedback);
  const { data, error } = await supabase
    .from('feedback_satisfaccion')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase al registrar feedback:", error);
    throw error;
  }

  console.log("Guardado en Supabase (feedback):", data);
  return data && data.length > 0 ? mapRowToFeedback(data[0]) : feedback;
}

// ============================================================================
// 9. CONFIGURACIÓN DEL PORTAL (public.portal_config)
// ============================================================================

export async function fetchPortalConfig(): Promise<AppConfig> {
  if (!isSupabaseConfigured()) return INITIAL_CONFIG;

  try {
    const { data, error } = await supabase
      .from('portal_config')
      .select('value')
      .eq('key', 'identidad_general')
      .maybeSingle();

    if (error || !data || !data.value) {
      return INITIAL_CONFIG;
    }

    const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    console.log("Cargando configuración institucional desde Supabase:", val);
    return {
      ...INITIAL_CONFIG,
      ...val
    };
  } catch (err) {
    console.error("Error al cargar configuración desde Supabase:", err);
    return INITIAL_CONFIG;
  }
}

export async function savePortalConfig(config: AppConfig): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('portal_config')
      .upsert({
        key: 'identidad_general',
        value: config,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.error("Error al guardar configuración en Supabase:", error);
      throw error;
    }

    console.log("Guardado en Supabase (configuración): exitoso");
    return true;
  } catch (err) {
    console.error("Excepción al guardar configuración:", err);
    throw err;
  }
}

// ============================================================================
// 10. STORAGE: SUBIDA DE FOTOS Y ASSETS
// ============================================================================

export async function uploadDirectivoPhoto(
  fileOrBlob: File | Blob,
  customName?: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase Storage] Subida omitida: variables de Supabase no definidas.');
    return null;
  }

  try {
    const ext = fileOrBlob.type.includes('webp')
      ? 'webp'
      : fileOrBlob.type.includes('png')
      ? 'png'
      : 'jpg';

    const cleanPrefix = (customName || 'directivo').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanPrefix}-${Date.now()}.${ext}`;
    const filePath = `fotos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('directivos-fotos')
      .upload(filePath, fileOrBlob, {
        contentType: fileOrBlob.type || 'image/webp',
        upsert: true
      });

    if (error) {
      console.error("Error Supabase Storage:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('directivos-fotos')
      .getPublicUrl(data.path);

    console.log("Foto subida exitosamente a Supabase Storage:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Error Supabase Storage:", err);
    throw err;
  }
}

export const DIRECTIVOS_BUCKET_PUBLIC_URL = "https://hpxjlfscxvivadeutjdq.supabase.co/storage/v1/object/public/directivos-fotos/";

/**
 * Resuelve la URL pública para una foto desde el bucket 'directivos-fotos':
 * Si la foto no empieza con 'http', la concatena con:
 * "https://hpxjlfscxvivadeutjdq.supabase.co/storage/v1/object/public/directivos-fotos/" + foto_url
 */
export function resolveDirectivoFotoUrl(fotoUrl?: string | null): string {
  if (!fotoUrl) return '';
  const trimmed = fotoUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  if (trimmed.startsWith('/storage/v1/object/public/directivos-fotos/')) {
    return `https://hpxjlfscxvivadeutjdq.supabase.co${trimmed}`;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  return `${DIRECTIVOS_BUCKET_PUBLIC_URL}${cleanPath}`;
}

/**
 * Obtiene la URL pública directa desde Supabase Storage para el bucket 'organigrama-imagenes'.
 */
export function getOrganigramaImageUrl(fileName: string): string {
  if (isSupabaseConfigured()) {
    const { data } = supabase.storage.from('organigrama-imagenes').getPublicUrl(fileName);
    if (data?.publicUrl) return data.publicUrl;
  }
  
  const baseUrl = cleanUrl || (typeof window !== 'undefined' ? localStorage.getItem('ci_supabase_url') || '' : '');
  if (baseUrl) {
    const cleanBase = cleanSupabaseUrl(baseUrl);
    return `${cleanBase}/storage/v1/object/public/organigrama-imagenes/${encodeURIComponent(fileName)}`;
  }

  return `/assets/aistudio/${encodeURIComponent(fileName)}`;
}

export const MISION4_BUCKET_PUBLIC_URL = "https://hpxjlfscxvivadeutjdq.supabase.co/storage/v1/object/public/mision4-imagenes/";

/**
 * Resuelve la URL pública para una imagen de la Misión 04:
 * Si el campo 'imagen_url' no empieza con 'http', lo concatena con:
 * "https://hpxjlfscxvivadeutjdq.supabase.co/storage/v1/object/public/mision4-imagenes/" + imagen_url
 */
export function resolveMision4ImageUrl(imagenUrl?: string): string {
  if (!imagenUrl) return '';
  const trimmed = imagenUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/storage/v1/object/public/mision4-imagenes/')) {
    return `https://hpxjlfscxvivadeutjdq.supabase.co${trimmed}`;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  return `${MISION4_BUCKET_PUBLIC_URL}${cleanPath}`;
}

/**
 * Obtiene la URL pública directa desde Supabase Storage para el bucket 'mision4-imagenes'.
 */
export function getMision4ImageUrl(fileName: string): string {
  return resolveMision4ImageUrl(fileName);
}

/**
 * Sube una imagen al bucket público 'mision4-imagenes' de Supabase Storage.
 * Retorna el nombre de archivo y la URL pública directa.
 */
export async function uploadMision4Image(
  file: File,
  numero: number
): Promise<{ fileName: string; publicUrl: string }> {
  const ext = file.type.includes('png')
    ? 'png'
    : file.type.includes('webp')
    ? 'webp'
    : 'jpg';

  const fileName = `mision4-${numero}-${Date.now()}.${ext}`;

  if (!isSupabaseConfigured()) {
    console.warn('[Supabase Storage] Supabase no configurado. Utilizando preview temporal.');
    return {
      fileName,
      publicUrl: URL.createObjectURL(file)
    };
  }

  try {
    const { data, error } = await supabase.storage
      .from('mision4-imagenes')
      .upload(fileName, file, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('[Supabase Storage] Error subiendo imagen a mision4-imagenes:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('mision4-imagenes')
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData?.publicUrl || `${MISION4_BUCKET_PUBLIC_URL}${fileName}`;
    return { fileName, publicUrl };
  } catch (err) {
    console.error('[Supabase Storage] Excepción al subir imagen:', err);
    throw err;
  }
}

// ============================================================================
// 11. SUSCRIPCIONES EN TIEMPO REAL (Postgres CDC)
// ============================================================================

export function subscribeToTable(table: string, onChange: () => void): () => void {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log(`[Supabase Realtime] Evento detectado en '${table}':`, payload.eventType);
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.error(`Error en suscripción realtime a '${table}':`, e);
    return () => {};
  }
}

export function subscribeToDirectivos(callback: (authorities: Authority[]) => void): () => void {
  return subscribeToTable('directivos', async () => {
    const fresh = await fetchDirectivos();
    callback(fresh);
  });
}

export function subscribeToOrganigram(callback: (levels: OrganigramLevel[]) => void): () => void {
  return subscribeToTable('organigrama_niveles', async () => {
    const fresh = await fetchOrganigram();
    callback(fresh);
  });
}

// ============================================================================
// SCRIPT DDL COMPLETO PARA EL PANEL ADMINISTRADOR
// ============================================================================

export const SUPABASE_SETUP_SQL = `
-- ====================================================================
-- PORTAL DIGITAL DE ONBOARDING 2026 - COLEGIO INFORMÁTICO (EDUCAR SRL)
-- SCRIPT DDL MAESTRO PARA SUPABASE (POSTGRESQL + STORAGE)
-- ====================================================================

-- 1. TABLA: portal_config (Configuración e Identidad Institucional)
CREATE TABLE IF NOT EXISTS public.portal_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.portal_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de portal_config" ON public.portal_config FOR SELECT USING (true);
CREATE POLICY "Escritura de portal_config" ON public.portal_config FOR ALL USING (true);

-- 2. TABLA: directivos (Autoridades y Equipo de Conducción)
CREATE TABLE IF NOT EXISTS public.directivos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    cargo TEXT NOT NULL,
    area TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    biografia TEXT,
    foto_url TEXT NOT NULL,
    drive_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.directivos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de directivos" ON public.directivos FOR SELECT USING (true);
CREATE POLICY "Escritura de directivos" ON public.directivos FOR ALL USING (true);

-- 3. TABLA: organigrama_niveles (Estructura Jerárquica y Nodos)
CREATE TABLE IF NOT EXISTS public.organigrama_niveles (
    id TEXT PRIMARY KEY,
    numero_nivel INT4 NOT NULL,
    nombre_nivel TEXT NOT NULL,
    badge TEXT,
    color TEXT,
    descripcion TEXT,
    nodos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.organigrama_niveles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de organigrama" ON public.organigrama_niveles FOR SELECT USING (true);
CREATE POLICY "Escritura de organigrama" ON public.organigrama_niveles FOR ALL USING (true);

-- 4. TABLA: calendario_eventos (Agenda y Cronograma Operación 2026)
CREATE TABLE IF NOT EXISTS public.calendario_eventos (
    id TEXT PRIMARY KEY,
    mes INT2 NOT NULL,
    nombre_mes TEXT NOT NULL,
    fecha_str TEXT NOT NULL,
    titulo TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'Institucional',
    responsable TEXT NOT NULL,
    descripcion TEXT,
    audiencia TEXT NOT NULL DEFAULT 'Comunidad',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.calendario_eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de eventos" ON public.calendario_eventos FOR SELECT USING (true);
CREATE POLICY "Escritura de eventos" ON public.calendario_eventos FOR ALL USING (true);

-- 5. TABLA: novedades_avisos (Comunicados y Avisos Prioritarios)
CREATE TABLE IF NOT EXISTS public.novedades_avisos (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    autor TEXT NOT NULL,
    prioridad TEXT NOT NULL DEFAULT 'normal',
    fijado BOOLEAN NOT NULL DEFAULT false,
    fecha TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.novedades_avisos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de avisos" ON public.novedades_avisos FOR SELECT USING (true);
CREATE POLICY "Escritura de avisos" ON public.novedades_avisos FOR ALL USING (true);

-- 6. TABLA: iniciativas (Programas Institucionales: Wellness, STEAM, etc.)
CREATE TABLE IF NOT EXISTS public.iniciativas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    referente TEXT NOT NULL,
    cargo_referente TEXT,
    categoria TEXT NOT NULL,
    icono TEXT NOT NULL DEFAULT 'Sparkles',
    color_acento TEXT NOT NULL DEFAULT '#DE4034',
    que_hacemos TEXT NOT NULL,
    porque_lo_hacemos TEXT NOT NULL,
    que_valor_aporta TEXT NOT NULL,
    video_drive_id TEXT,
    etiquetas TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.iniciativas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de iniciativas" ON public.iniciativas FOR SELECT USING (true);
CREATE POLICY "Escritura de iniciativas" ON public.iniciativas FOR ALL USING (true);

-- 7. TABLA: compromisos_cultura (Normas y Cultura Educar SRL)
CREATE TABLE IF NOT EXISTS public.compromisos_cultura (
    id TEXT PRIMARY KEY,
    numero INT2 NOT NULL,
    titulo TEXT NOT NULL,
    destaque TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    consejos TEXT[] DEFAULT '{}',
    icono TEXT NOT NULL,
    badge TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.compromisos_cultura ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de compromisos" ON public.compromisos_cultura FOR SELECT USING (true);
CREATE POLICY "Escritura de compromisos" ON public.compromisos_cultura FOR ALL USING (true);

-- 8. TABLA: diplomas_emitidos (Registro de Certificaciones de Ingreso)
CREATE TABLE IF NOT EXISTS public.diplomas_emitidos (
    id TEXT PRIMARY KEY,
    folio TEXT NOT NULL UNIQUE,
    nombre_completo TEXT NOT NULL,
    puesto_sector TEXT NOT NULL,
    email TEXT NOT NULL,
    fecha_ingreso TEXT NOT NULL,
    fecha_emision TIMESTAMPTZ DEFAULT NOW(),
    hash_verificacion TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Emitido',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.diplomas_emitidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura de diplomas" ON public.diplomas_emitidos FOR SELECT USING (true);
CREATE POLICY "Inserción de diplomas" ON public.diplomas_emitidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Gestión de diplomas" ON public.diplomas_emitidos FOR ALL USING (true);

-- 9. TABLA: feedback_satisfaccion (Encuestas de Satisfacción de Onboarding)
CREATE TABLE IF NOT EXISTS public.feedback_satisfaccion (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    puesto_sector TEXT NOT NULL,
    calificacion_general INT2 NOT NULL CHECK (calificacion_general BETWEEN 1 AND 5),
    calificacion_claridad INT2 NOT NULL CHECK (calificacion_claridad BETWEEN 1 AND 5),
    seccion_mas_util TEXT,
    sugerencias TEXT,
    recomendaria BOOLEAN NOT NULL DEFAULT true,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.feedback_satisfaccion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura de feedback" ON public.feedback_satisfaccion FOR SELECT USING (true);
CREATE POLICY "Inserción de feedback" ON public.feedback_satisfaccion FOR INSERT WITH CHECK (true);

-- 10. TABLA: usuarios_admin (Control de Accesos Hash SHA-256)
CREATE TABLE IF NOT EXISTS public.usuarios_admin (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'admin',
    password_hash TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    ultimo_acceso TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.usuarios_admin ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura segura de admin" ON public.usuarios_admin FOR SELECT USING (true);

-- BUCKETS STORAGE
INSERT INTO storage.buckets (id, name, public) 
VALUES ('directivos-fotos', 'directivos-fotos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura pública directivos-fotos" ON storage.objects
    FOR SELECT USING (bucket_id = 'directivos-fotos');
CREATE POLICY "Subida pública directivos-fotos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'directivos-fotos');
CREATE POLICY "Actualización directivos-fotos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'directivos-fotos');
CREATE POLICY "Eliminación directivos-fotos" ON storage.objects
    FOR DELETE USING (bucket_id = 'directivos-fotos');

INSERT INTO storage.buckets (id, name, public) 
VALUES ('portal-assets', 'portal-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura pública portal-assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'portal-assets');
CREATE POLICY "Subida pública portal-assets" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'portal-assets');

INSERT INTO storage.buckets (id, name, public) 
VALUES ('diplomas-pdf', 'diplomas-pdf', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura pública diplomas-pdf" ON storage.objects
    FOR SELECT USING (bucket_id = 'diplomas-pdf');
CREATE POLICY "Subida pública diplomas-pdf" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'diplomas-pdf');

INSERT INTO storage.buckets (id, name, public) 
VALUES ('organigrama-imagenes', 'organigrama-imagenes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura pública organigrama-imagenes" ON storage.objects
    FOR SELECT USING (bucket_id = 'organigrama-imagenes');
CREATE POLICY "Subida pública organigrama-imagenes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'organigrama-imagenes');

-- 11. TABLA: mision4_compromisos (Misión 04: Mi Rol en Educar - 6 Compromisos)
CREATE TABLE IF NOT EXISTS public.mision4_compromisos (
    id TEXT PRIMARY KEY,
    numero INT2 NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    mensaje_destacado TEXT,
    destaque TEXT,
    descripcion TEXT NOT NULL,
    consejos JSONB DEFAULT '[]'::jsonb,
    icono TEXT DEFAULT 'Sparkles',
    badge TEXT DEFAULT '',
    imagen_url TEXT NOT NULL,
    frase_cierre TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.mision4_compromisos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de mision4_compromisos" ON public.mision4_compromisos FOR SELECT USING (true);
CREATE POLICY "Escritura de mision4_compromisos" ON public.mision4_compromisos FOR ALL USING (true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('mision4-imagenes', 'mision4-imagenes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura pública mision4-imagenes" ON storage.objects
    FOR SELECT USING (bucket_id = 'mision4-imagenes');
CREATE POLICY "Subida pública mision4-imagenes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'mision4-imagenes');
CREATE POLICY "Actualización mision4-imagenes" ON storage.objects
    FOR UPDATE USING (bucket_id = 'mision4-imagenes');

-- 12. TABLA: coordinadores (Coordinadores de Área Institucionales)
CREATE TABLE IF NOT EXISTS public.coordinadores (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    cargo TEXT NOT NULL,
    foto_url TEXT,
    orden INT4 DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.coordinadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de coordinadores" ON public.coordinadores FOR SELECT USING (true);
CREATE POLICY "Escritura de coordinadores" ON public.coordinadores FOR ALL USING (true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('directivos-fotos', 'directivos-fotos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Lectura pública directivos-fotos" ON storage.objects
    FOR SELECT USING (bucket_id = 'directivos-fotos');
CREATE POLICY "Subida pública directivos-fotos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'directivos-fotos');
CREATE POLICY "Actualización directivos-fotos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'directivos-fotos');
`;
