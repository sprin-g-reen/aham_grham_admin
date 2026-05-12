export const DEFAULT_SITE_ORIGIN = 'https://aham-grham-website.vercel.app';
export const DEFAULT_BACKEND_URL = 'https://aham-grham-backend.vercel.app';

// Detect if we are on localhost or a local network IP
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.startsWith('192.168.') || 
  window.location.hostname.startsWith('10.') || 
  window.location.hostname.startsWith('172.') || 
  window.location.hostname.endsWith('.local');

export const SITE_ORIGIN = isLocalhost
  ? `http://${window.location.hostname}:${window.location.port || '3000'}`
  : (import.meta.env.VITE_SITE_ORIGIN || import.meta.env.VITE_API_ORIGIN || DEFAULT_SITE_ORIGIN).replace(/\/$/, '');

// FORCE Port 5000 for API on localhost
export const BACKEND_URL = isLocalhost ? `http://${window.location.hostname}:5000` : (import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL);
export const API_URL = isLocalhost
  ? `${BACKEND_URL}/api`
  : (import.meta.env.VITE_API_URL || `${SITE_ORIGIN}/api`);

export const UPLOADS_URL = isLocalhost
  ? `http://${window.location.hostname}:5000/uploads`
  : (import.meta.env.VITE_UPLOADS_URL || `${SITE_ORIGIN}/uploads`);
