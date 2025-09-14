// Use environment variable in production, fallback to localhost for development and tests
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTHORS: '/authors',
  BOOKS: '/books',
} as const;
