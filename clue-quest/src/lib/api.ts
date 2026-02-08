// API configuration and service functions
// Backend is only used for team registration

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://127.0.0.1:8000';

// Helper to get cookie by name
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// API client with credentials support for session-based auth
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const csrfToken = getCookie('csrftoken');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || error.detail || 'Request failed');
  }

  return response.json();
};

// Get CSRF token
export const getCsrfToken = async () => {
  return apiClient('/api/csrf/');
};

// Login/Register
export const login = async (teamId: string, password: string) => {
  return apiClient('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      team_id: teamId,
      password: password,
    }),
  });
};

// Logout
export const logout = async () => {
  return apiClient('/api/auth/logout/', {
    method: 'POST',
  });
};

// Complete game - save team completion time
export const completeGame = async (teamId: string, completionTimeSeconds: number) => {
  return apiClient('/api/complete/', {
    method: 'POST',
    body: JSON.stringify({
      team_id: teamId,
      completion_time_seconds: completionTimeSeconds,
    }),
  });
};

// Game-related API functions removed - game logic is now client-side only
