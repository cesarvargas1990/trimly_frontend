export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL_MISSING');
  }
}
