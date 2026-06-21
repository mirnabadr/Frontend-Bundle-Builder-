import type { PersistedBundle } from '@store/slices/bundleSlice';

/**
 * Client-side persistence for "Save my system for later".
 * Stores the shopper's configuration under a versioned localStorage key so a
 * reload or return visit restores their system exactly as they left it.
 */
const STORAGE_KEY = 'wyze-bundle-builder:v1';

class PersistenceService {
  save(state: PersistedBundle): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota). Fail silently.
    }
  }

  load(): PersistedBundle | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedBundle;
      if (!parsed || typeof parsed !== 'object' || !parsed.quantities) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }
}

export const persistenceService = new PersistenceService();
