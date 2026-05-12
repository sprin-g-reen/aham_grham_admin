export const DEFAULT_SITE_ORIGIN = 'https://aham-grham-website.vercel.app';
export const DEFAULT_BACKEND_URL = 'https://aham-grham-backend.vercel.app';

// Detect if we are on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const SITE_ORIGIN = isLocalhost
  ? 'http://localhost:3000'
  : (import.meta.env.VITE_SITE_ORIGIN || import.meta.env.VITE_API_ORIGIN || DEFAULT_SITE_ORIGIN).replace(/\/$/, '');

// FORCE Port 5000 for API on localhost
export const BACKEND_URL = isLocalhost ? 'http://localhost:5000' : (import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL);
export const API_URL = isLocalhost
  ? `${BACKEND_URL}/api`
  : (import.meta.env.VITE_API_URL || `${SITE_ORIGIN}/api`);

export const UPLOADS_URL = isLocalhost
  ? 'http://localhost:5000/uploads'
  : (import.meta.env.VITE_UPLOADS_URL || `${SITE_ORIGIN}/uploads`);
