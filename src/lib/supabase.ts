import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Authority, OrganigramLevel } from '../types';

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

// Si ninguna variable está definida, emitir un console.warn en lugar de hacer llamadas a dominios inexistentes
if (!isSupabaseConfigured()) {
  console.warn(
    '[Supabase] Variables de conexión no definidas (VITE_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL). ' +
    'No se realizarán llamadas a dominios inexistentes. Puedes configurar las credenciales en tu entorno de despliegue o en el Panel Administrador.'
  );
}

/**
 * Cliente de Supabase:
 * - Si las variables están definidas, se conecta a la instancia real en la nube.
 * - Si no están definidas, evita llamadas a la red y emite advertencias legibles.
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
          console.warn(`[Supabase] Guardado (upsert) omitido en tabla '${table}': variables de Supabase no definidas.`);
          const resultData = Array.isArray(data) ? data : [data];
          return {
            select: () => Promise.resolve({ data: resultData, error: null })
          };
        },
        update: (data: any) => {
          console.warn(`[Supabase] Actualización omitida en tabla '${table}': variables de Supabase no definidas.`);
          return {
            eq: () => ({
              select: () => Promise.resolve({ data: [data], error: null })
            })
          };
        },
        delete: () => {
          console.warn(`[Supabase] Eliminación omitida en tabla '${table}': variables de Supabase no definidas.`);
          return {
            eq: () => Promise.resolve({ data: null, error: null })
          };
        }
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async () => {
            console.warn(`[Supabase Storage] Subida omitida en bucket '${bucket}': variables de Supabase no definidas.`);
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

/**
 * Estructura de la tabla 'directivos' en Supabase.
 */
export interface DirectivoRow {
  id: string;
  nombre: string;
  cargo: string;
  area: string;
  email: string;
  telefono?: string | null;
  biografia?: string | null;
  foto_url: string;
  created_at?: string;
}

/**
 * Mapea una fila de Supabase al tipo Authority de la aplicación.
 */
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

/**
 * Mapea un objeto Authority a la estructura de columnas de la tabla Supabase.
 */
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

/**
 * Carga directa de directivos desde la base de datos real de Supabase.
 */
export async function fetchDirectivos(): Promise<Authority[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('directivos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error Supabase:", error);
    throw error;
  }

  console.log("Cargando desde Supabase:", data);
  return (data || []).map(mapRowToAuthority);
}

/**
 * Guarda o actualiza un directivo directamente en Supabase usando .upsert() con onConflict: 'id'.
 */
export async function upsertDirectivo(auth: Authority): Promise<Authority> {
  const directivoData = mapAuthorityToRow(auth);
  const { data, error } = await supabase
    .from('directivos')
    .upsert(directivoData, { onConflict: 'id' })
    .select();

  if (error) {
    console.error("Error Supabase:", error);
    throw error;
  }

  console.log("Cargando desde Supabase:", data);
  return data && data.length > 0 ? mapRowToAuthority(data[0]) : auth;
}

export async function insertDirectivo(auth: Authority): Promise<Authority> {
  return upsertDirectivo(auth);
}

export async function updateDirectivo(auth: Authority): Promise<Authority> {
  return upsertDirectivo(auth);
}

/**
 * Elimina un directivo directamente en Supabase por ID.
 */
export async function deleteDirectivo(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('directivos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error Supabase:", error);
    throw error;
  }

  console.log("Eliminado de Supabase:", id);
  return true;
}

/**
 * Sube una imagen optimizada al bucket 'directivos-fotos' de Supabase Storage.
 */
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
      console.error("Error Supabase:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('directivos-fotos')
      .getPublicUrl(data.path);

    console.log("Cargando desde Supabase (Storage):", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Error Supabase:", err);
    throw err;
  }
}

/**
 * Organigrama persistido en la tabla 'portal_config' de Supabase.
 */
export async function fetchOrganigram(): Promise<OrganigramLevel[] | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase
    .from('portal_config')
    .select('value')
    .eq('key', 'organigrama')
    .maybeSingle();

  if (error) {
    console.error("Error Supabase:", error);
    return null;
  }

  console.log("Cargando desde Supabase (Organigrama):", data);
  if (!data) return null;
  return typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
}

export async function saveOrganigram(levels: OrganigramLevel[]): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Guardado de organigrama omitido: variables de Supabase no definidas.');
    return false;
  }

  const { error } = await supabase
    .from('portal_config')
    .upsert({
      key: 'organigrama',
      value: levels,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

  if (error) {
    console.error("Error Supabase:", error);
    throw error;
  }

  console.log("Guardado en Supabase (Organigrama): exitoso");
  return true;
}

/**
 * Suscripciones en tiempo real a la base de datos real.
 */
export function subscribeToDirectivos(callback: (authorities: Authority[]) => void): () => void {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('realtime:directivos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'directivos' },
        async (payload) => {
          console.log('[Supabase Realtime] Evento directivos:', payload.eventType);
          try {
            const fresh = await fetchDirectivos();
            callback(fresh);
          } catch (e) {
            console.error("Error Supabase realtime refresh:", e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.error("Error Supabase realtime:", e);
    return () => {};
  }
}

export function subscribeToOrganigram(callback: (levels: OrganigramLevel[]) => void): () => void {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('realtime:organigram')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portal_config', filter: 'key=eq.organigrama' },
        async (payload) => {
          if (payload.new && (payload.new as any).value) {
            const val = (payload.new as any).value;
            const levels = typeof val === 'string' ? JSON.parse(val) : val;
            callback(levels);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.error("Error Supabase realtime:", e);
    return () => {};
  }
}

/**
 * Script SQL para inicializar el proyecto en Supabase (Editor SQL).
 */
export const SUPABASE_SETUP_SQL = `
-- 1. Tabla de Directivos y Referentes
CREATE TABLE IF NOT EXISTS public.directivos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    cargo TEXT NOT NULL,
    area TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    biografia TEXT,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS y lectura pública
ALTER TABLE public.directivos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de directivos" ON public.directivos FOR SELECT USING (true);
CREATE POLICY "Escritura de directivos" ON public.directivos FOR ALL USING (true);

-- 2. Tabla de Configuración y Organigrama
CREATE TABLE IF NOT EXISTS public.portal_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portal_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de portal_config" ON public.portal_config FOR SELECT USING (true);
CREATE POLICY "Escritura de portal_config" ON public.portal_config FOR ALL USING (true);

-- 3. Bucket de Storage para fotos de directivos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('directivos-fotos', 'directivos-fotos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Lectura pública directivos-fotos" ON storage.objects
    FOR SELECT USING (bucket_id = 'directivos-fotos');
CREATE POLICY "Subida pública directivos-fotos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'directivos-fotos');
CREATE POLICY "Actualización directivos-fotos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'directivos-fotos');
`;
