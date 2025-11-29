/**
 * Environment configuration
 *
 * Vite exposes env vars on the special import.meta.env object.
 * Only variables prefixed with VITE_ are exposed to the client.
 */

export const config = {
  // Auth API base URL (Java backend)
  authApiUrl: import.meta.env.VITE_AUTH_API_URL || '/auth-api',

  // Course API base URL (Python backend)
  courseApiUrl: import.meta.env.VITE_COURSE_API_URL || '/course-api',

  // Environment mode
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;
