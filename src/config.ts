export const DEFAULT_SITE_ORIGIN = 'https://aham-grham-website.vercel.app';

export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_ORIGIN ||
  import.meta.env.VITE_API_ORIGIN ||
  DEFAULT_SITE_ORIGIN
).replace(/\/$/, '');

export const API_URL = import.meta.env.VITE_API_URL || `${SITE_ORIGIN}/api`;
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || `${SITE_ORIGIN}/uploads`;
