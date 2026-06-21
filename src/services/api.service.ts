import type { BundleCatalog } from '@/types/bundle.types';
import localCatalog from '@data/bundle.json';

/**
 * Fetches the bundle catalog. The bonus Node/Express backend serves it from
 * GET /api/bundle; if the API is unavailable we fall back to the bundled JSON
 * so the app always runs from a clean clone (with or without the server).
 */
class ApiService {
  async getBundle(): Promise<BundleCatalog> {
    try {
      const res = await fetch('/api/bundle');
      if (!res.ok) throw new Error(`API responded ${res.status}`);
      return (await res.json()) as BundleCatalog;
    } catch {
      return localCatalog as unknown as BundleCatalog;
    }
  }
}

export const apiService = new ApiService();
