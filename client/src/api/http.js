// If VITE_API_URL is not set (e.g., on Vercel), default to /api since frontend and backend share the same domain.
// In local dev without .env, it defaults to /api but proxy in vite.config.js forwards it to localhost:5000.
const API_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("galleryToken");
  // This helper centralizes API calls so components do not repeat fetch,
  // JSON parsing, auth headers, and error handling.
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || "Request failed", response.status);
  }

  return data;
}
