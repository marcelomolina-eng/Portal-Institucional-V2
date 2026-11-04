/**
 * Safe localStorage wrapper with try/catch and QuotaExceededError handling.
 * Prevents unhandled exceptions in React hooks from triggering White Screen of Death.
 */

export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err: unknown) {
    console.error(`[SafeStorage] Failed to save key "${key}":`, err);

    // If quota exceeded, attempt safe fallback
    if (
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' ||
        err.code === 22 ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.warn('[SafeStorage] Storage quota exceeded. Skipping non-critical persistence.');
    }
    return false;
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[SafeStorage] Failed to read key "${key}", returning fallback:`, err);
    return fallback;
  }
}
