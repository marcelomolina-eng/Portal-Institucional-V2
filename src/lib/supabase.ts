import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Authority, OrganigramLevel } from '../types';
import { AUTHORITIES, INITIAL_ORGANIGRAM } from '../data/initialData';

// Lectura y sanitización de variables de entorno de Supabase
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Limpia la URL de Supabase eliminando barras finales y segmentos accidentales como /rest/v1.
 */
export const cleanSupabaseUrl = (url: string): string => {
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
};

/**
 * Verifica si las credenciales de Supabase están activas, válidas y configuradas.
 */
export const isSupabaseConfigured = (): boolean => {
  const url = cleanSupabaseUrl(rawUrl);
  const key = rawAnonKey;
  return (
    typeof url === 'string' &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    !url.includes('your-project-id') &&
    !url.includes('placeholder') &&
    !url.includes('ci-san-juan-de-vera') &&
    typeof key === 'string' &&
    key.length > 20 &&
    !key.includes('your-anon-key') &&
    !key.includes('placeholder') &&
    !key.includes('dummy')
  );
};

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
 * Mapea un objeto Authority a la estructura de columnas de Supabase.
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

// Almacén en memoria para permitir persistencia durante la sesión si Supabase no está configurado o si la tabla aún no existe
let localDirectivos: DirectivoRow[] = AUTHORITIES.map(mapAuthorityToRow);
let localOrganigram: OrganigramLevel[] = INITIAL_ORGANIGRAM;

/**
 * Constructor de consultas mock en caso de no tener Supabase configurado
 */
class MockQueryBuilder {
  private table: string;
  private action: 'select' | 'upsert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private filterField: string | null = null;
  private filterVal: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = '*') {
    this.action = 'select';
    return this;
  }

  order(field: string, opts?: { ascending?: boolean }) {
    return this;
  }

  eq(field: string, val: any) {
    this.filterField = field;
    this.filterVal = val;
    return this;
  }

  maybeSingle() {
    return this.then((res: any) => {
      const item = Array.isArray(res.data) ? res.data[0] || null : res.data;
      return { data: item, error: null };
    });
  }

  single() {
    return this.maybeSingle();
  }

  upsert(rows: any, opts?: any) {
    this.action = 'upsert';
    this.payload = rows;
    return this;
  }

  insert(rows: any) {
    return this.upsert(rows);
  }

  update(row: any) {
    this.action = 'update';
    this.payload = row;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  async then(resolve: (value: any) => any, reject?: (reason: any) => any) {
    try {
      let result: any = { data: null, error: null };

      if (this.table === 'directivos') {
        if (this.action === 'select') {
          result = { data: [...localDirectivos], error: null };
        } else if (this.action === 'upsert') {
          const rowsToUpsert = Array.isArray(this.payload) ? this.payload : [this.payload];
          rowsToUpsert.forEach((row: any) => {
            const idx = localDirectivos.findIndex(d => d.id === row.id);
            if (idx >= 0) {
              localDirectivos[idx] = { ...localDirectivos[idx], ...row };
            } else {
              localDirectivos.push(row);
            }
          });
          result = { data: rowsToUpsert, error: null };
        } else if (this.action === 'update') {
          if (this.filterField === 'id') {
            localDirectivos = localDirectivos.map(d => d.id === this.filterVal ? { ...d, ...this.payload } : d);
          }
          result = { data: [this.payload], error: null };
        } else if (this.action === 'delete') {
          if (this.filterField === 'id') {
            localDirectivos = localDirectivos.filter(d => d.id !== this.filterVal);
          }
          result = { data: null, error: null };
        }
      } else if (this.table === 'portal_config') {
        if (this.action === 'select') {
          result = { data: { key: 'organigrama', value: localOrganigram }, error: null };
        } else if (this.action === 'upsert') {
          if (this.payload && this.payload.key === 'organigrama') {
            localOrganigram = this.payload.value;
          }
          result = { data: this.payload, error: null };
        }
      }

      return resolve(result);
    } catch (e) {
      if (reject) return reject(e);
      return resolve({ data: null, error: e });
    }
  }
}

/**
 * Envuelve una consulta real a Supabase para capturar el error PostgREST PGRST125
 * (que ocurre si la tabla aún no fue creada en la base de datos Supabase)
 * y responder con los datos locales sin romper la aplicación.
 */
function wrapQueryBuilder(builder: any, table: string) {
  const originalThen = builder.then ? builder.then.bind(builder) : null;
  if (!originalThen) return builder;

  builder.then = function(resolve: any, reject: any) {
    return originalThen((res: any) => {
      // PGRST125: "Invalid path specified in request URL" (PostgREST 404 cuando la tabla no existe)
      if (res && res.error && (res.error.code === 'PGRST125' || res.error.message?.includes('Invalid path'))) {
        console.warn(`[Supabase Info] La tabla '${table}' aún no existe en Supabase (PGRST125). Usa el Editor SQL en el panel para crearla. Cargando datos locales.`);
        if (table === 'directivos') {
          return resolve({ data: [...localDirectivos], error: null });
        }
        if (table === 'portal_config') {
          return resolve({ data: { key: 'organigrama', value: localOrganigram }, error: null });
        }
        return resolve({ data: null, error: null });
      }
      return resolve(res);
    }, reject);
  };
  return builder;
}

// Instancia real si está configurada
const realClient: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(cleanSupabaseUrl(rawUrl), rawAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

/**
 * Cliente Supabase unificado y resistente.
 * Exportado como SupabaseClient.
 */
export const supabase: SupabaseClient = {
  from: (table: string) => {
    if (realClient) {
      const builder = realClient.from(table);
      return wrapQueryBuilder(builder, table);
    }
    return new MockQueryBuilder(table) as any;
  },
  storage: {
    from: (bucket: string) => {
      if (realClient) {
        return realClient.storage.from(bucket);
      }
      return {
        upload: async (path: string, fileOrBlob: any) => {
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: '' } };
        }
      } as any;
    }
  } as any,
  channel: (name: string) => {
    if (realClient) {
      return realClient.channel(name);
    }
    return {
      on: () => ({
        subscribe: () => ({ unsubscribe: () => {} })
      }),
      subscribe: () => ({ unsubscribe: () => {} })
    } as any;
  },
  removeChannel: (channel: any) => {
    if (realClient) {
      return realClient.removeChannel(channel);
    }
    return Promise.resolve('ok' as any);
  }
} as unknown as SupabaseClient;

/**
 * Carga de directivos desde Supabase.
 */
export async function fetchDirectivos(): Promise<Authority[]> {
  try {
    const { data, error } = await supabase
      .from('directivos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error("Error Supabase:", error);
      return AUTHORITIES;
    }

    console.log("Cargando desde Supabase:", data);

    if (!data || data.length === 0) {
      return AUTHORITIES;
    }

    return (data as any[]).map(mapRowToAuthority);
  } catch (err) {
    console.error("Error Supabase:", err);
    return AUTHORITIES;
  }
}

/**
 * Inserta o actualiza (upsert) un directivo en Supabase.
 */
export async function upsertDirectivo(auth: Authority): Promise<Authority> {
  const row = mapAuthorityToRow(auth);
  try {
    const { data, error } = await supabase
      .from('directivos')
      .upsert([row])
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return auth;
    }

    console.log("Cargando desde Supabase:", data);
    return data && data.length > 0 ? mapRowToAuthority(data[0]) : auth;
  } catch (err) {
    console.error("Error Supabase:", err);
    return auth;
  }
}

export async function insertDirectivo(auth: Authority): Promise<Authority> {
  return upsertDirectivo(auth);
}

export async function updateDirectivo(auth: Authority): Promise<Authority> {
  const row = mapAuthorityToRow(auth);
  try {
    const { data, error } = await supabase
      .from('directivos')
      .update(row)
      .eq('id', auth.id)
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return auth;
    }

    console.log("Cargando desde Supabase:", data);
    return data && data.length > 0 ? mapRowToAuthority(data[0]) : auth;
  } catch (err) {
    console.error("Error Supabase:", err);
    return auth;
  }
}

export async function deleteDirectivo(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('directivos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error Supabase:", error);
      return false;
    }

    console.log("Eliminado de Supabase:", id);
    return true;
  } catch (err) {
    console.error("Error Supabase:", err);
    return false;
  }
}

/**
 * Sube una imagen optimizada al bucket 'directivos-fotos' de Supabase Storage.
 */
export async function uploadDirectivoPhoto(
  fileOrBlob: File | Blob,
  customName?: string
): Promise<string | null> {
  if (!isSupabaseConfigured() || !realClient) return null;

  try {
    const ext = fileOrBlob.type.includes('webp')
      ? 'webp'
      : fileOrBlob.type.includes('png')
      ? 'png'
      : 'jpg';

    const cleanPrefix = (customName || 'directivo').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanPrefix}-${Date.now()}.${ext}`;
    const filePath = `fotos/${fileName}`;

    const { data, error } = await realClient.storage
      .from('directivos-fotos')
      .upload(filePath, fileOrBlob, {
        contentType: fileOrBlob.type || 'image/webp',
        upsert: true
      });

    if (error) {
      console.error("Error Supabase:", error);
      return null;
    }

    const { data: publicUrlData } = realClient.storage
      .from('directivos-fotos')
      .getPublicUrl(data.path);

    console.log("Cargando desde Supabase (Storage):", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Error Supabase:", err);
    return null;
  }
}

/**
 * Organigrama persistido en Supabase.
 */
export async function fetchOrganigram(): Promise<OrganigramLevel[] | null> {
  try {
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
  } catch (err) {
    console.error("Error Supabase:", err);
    return null;
  }
}

export async function saveOrganigram(levels: OrganigramLevel[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('portal_config')
      .upsert({
        key: 'organigrama',
        value: levels,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.error("Error Supabase:", error);
      return false;
    }

    console.log("Guardado en Supabase (Organigrama): exitoso");
    return true;
  } catch (err) {
    console.error("Error Supabase:", err);
    return false;
  }
}

/**
 * Suscripciones en tiempo real.
 */
export function subscribeToDirectivos(callback: (authorities: Authority[]) => void): () => void {
  if (!isSupabaseConfigured() || !realClient) return () => {};

  try {
    const channel = realClient
      .channel('realtime:directivos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'directivos' },
        async (payload) => {
          console.log('[Supabase Realtime] Evento directivos:', payload.eventType);
          const fresh = await fetchDirectivos();
          callback(fresh);
        }
      )
      .subscribe();

    return () => {
      realClient.removeChannel(channel);
    };
  } catch (e) {
    console.error("Error Supabase realtime:", e);
    return () => {};
  }
}

export function subscribeToOrganigram(callback: (levels: OrganigramLevel[]) => void): () => void {
  if (!isSupabaseConfigured() || !realClient) return () => {};

  try {
    const channel = realClient
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
      realClient.removeChannel(channel);
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
