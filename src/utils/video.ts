import { resolveMision2VideoUrl } from '../lib/supabase';

export type ParsedVideoSource =
  | { type: 'none' }
  | { type: 'youtube'; embedUrl: string; videoId: string }
  | { type: 'vimeo'; embedUrl: string; videoId: string }
  | { type: 'direct'; src: string };

/**
 * Analiza una URL o nombre de archivo de video y determina si es:
 * - YouTube (devuelve embed con enablejsapi=1 para control de pausa)
 * - Vimeo (devuelve embed player.vimeo.com)
 * - Video directo / archivo del bucket 'mision2-videos' en Supabase Storage
 */
export function parseVideoSource(rawUrl?: string | null): ParsedVideoSource {
  if (!rawUrl || !rawUrl.trim()) {
    return { type: 'none' };
  }

  const trimmed = rawUrl.trim();

  // YouTube (youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`
    };
  }

  // Vimeo (vimeo.com/123456 o player.vimeo.com/video/123456)
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`
    };
  }

  // Archivo directo o ruta en el bucket 'mision2-videos'
  const resolvedSrc = resolveMision2VideoUrl(trimmed);
  if (!resolvedSrc) {
    return { type: 'none' };
  }

  return {
    type: 'direct',
    src: resolvedSrc
  };
}
