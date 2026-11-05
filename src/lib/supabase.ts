import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Authority, OrganigramLevel, AppConfig } from '../types';
import { AUTHORITIES, INITIAL_ORGANIGRAM, INITIAL_CONFIG } from '../data/initialData';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether Supabase environment variables are properly defined.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

/**
 * Singleton Supabase client instance (or null when unconfigured).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

/**
 * Structure of the 'directivos' table in Supabase.
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
 * Map a Supabase row to the internal Authority type.
 */
export function mapRowToAuthority(row: DirectivoRow): Authority {
  return {
    id: row.id,
    name: row.nombre || '',
    role: row.cargo || '',
    area: row.area || '',
    email: row.email || '',
    phoneExt: row.telefono || '',
    bio: row.biografia || '',
    photoUrl: row.foto_url || ''
  };
}

/**
 * Map an Authority object to the Supabase 'directivos' table structure.
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
 * Fetch all directivos from Supabase with graceful fallback to initial authorities.
 */
export async function fetchDirectivos(): Promise<Authority[]> {
  if (!supabase) {
    return AUTHORITIES;
  }

  try {
    const { data, error } = await supabase
      .from('directivos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('[Supabase] Warning fetching directivos, using default data:', error.message);
      return AUTHORITIES;
    }

    if (!data || data.length === 0) {
      // Seed default authorities to the database in background so it's populated
      seedInitialDirectivos().catch(() => {});
      return AUTHORITIES;
    }

    return (data as DirectivoRow[]).map(mapRowToAuthority);
  } catch (err) {
    console.warn('[Supabase] Connection error fetching directivos, using fallback:', err);
    return AUTHORITIES;
  }
}

/**
 * Insert a new directivo in Supabase.
 */
export async function insertDirectivo(auth: Authority): Promise<Authority> {
  if (!supabase) return auth;

  try {
    const row = mapAuthorityToRow(auth);
    const { data, error } = await supabase
      .from('directivos')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.warn('[Supabase] Error inserting directivo:', error.message);
      return auth;
    }

    return mapRowToAuthority(data as DirectivoRow);
  } catch (err) {
    console.warn('[Supabase] Exception inserting directivo:', err);
    return auth;
  }
}

/**
 * Update an existing directivo in Supabase.
 */
export async function updateDirectivo(auth: Authority): Promise<Authority> {
  if (!supabase) return auth;

  try {
    const row = mapAuthorityToRow(auth);
    const { data, error } = await supabase
      .from('directivos')
      .update(row)
      .eq('id', auth.id)
      .select()
      .single();

    if (error) {
      console.warn('[Supabase] Error updating directivo:', error.message);
      return auth;
    }

    return mapRowToAuthority(data as DirectivoRow);
  } catch (err) {
    console.warn('[Supabase] Exception updating directivo:', err);
    return auth;
  }
}

/**
 * Delete a directivo from Supabase by ID.
 */
export async function deleteDirectivo(id: string): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('directivos')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Error deleting directivo:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase] Exception deleting directivo:', err);
    return false;
  }
}

/**
 * Uploads a profile image to the 'directivos-fotos' bucket in Supabase Storage
 * and returns the generated public URL.
 */
export async function uploadDirectivoPhoto(
  fileOrBlob: File | Blob,
  customName?: string
): Promise<string | null> {
  if (!supabase) return null;

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
      console.warn('[Supabase Storage] Error uploading image to bucket "directivos-fotos":', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('directivos-fotos')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('[Supabase Storage] Exception during photo upload:', err);
    return null;
  }
}

/**
 * Organigram & Site configuration persistence in Supabase
 */
export async function fetchOrganigram(): Promise<OrganigramLevel[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('portal_config')
      .select('value')
      .eq('key', 'organigrama')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
  } catch (err) {
    console.warn('[Supabase] Exception fetching organigram:', err);
    return null;
  }
}

export async function saveOrganigram(levels: OrganigramLevel[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('portal_config')
      .upsert({
        key: 'organigrama',
        value: levels,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn('[Supabase] Error saving organigram:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving organigram:', err);
    return false;
  }
}

/**
 * Realtime subscription to the 'directivos' table.
 */
export function subscribeToDirectivos(callback: (authorities: Authority[]) => void): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:directivos')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'directivos' },
      async () => {
        const fresh = await fetchDirectivos();
        callback(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

/**
 * Realtime subscription to the 'portal_config' table.
 */
export function subscribeToOrganigram(callback: (levels: OrganigramLevel[]) => void): () => void {
  if (!supabase) return () => {};

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
    supabase?.removeChannel(channel);
  };
}

/**
 * Helper to seed initial default authorities into Supabase table if empty.
 */
async function seedInitialDirectivos(): Promise<void> {
  if (!supabase) return;
  try {
    const rows = AUTHORITIES.map(mapAuthorityToRow);
    await supabase.from('directivos').upsert(rows, { onConflict: 'id' });
  } catch (e) {
    console.warn('[Supabase] Error seeding directivos:', e);
  }
}

/**
 * SQL script for Supabase SQL Editor to initialize tables and storage bucket.
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
