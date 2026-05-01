/**
 * Vitalink API Client
 * -------------------
 * Centralised fetch wrapper that talks to the Express backend.
 * JWT is stored in localStorage under "vitalink_token".
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "vitalink_token";

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

const text = await res.text();

let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error("Server returned invalid response (not JSON)");
}

if (!res.ok) {
  throw new Error(data.error || `Request failed with status ${res.status}`);
}

return data as T;
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContacts: {
    _id: string;
    name: string;
    phone: string;
    relation: string;
    priority: number;
  }[];
  vehicleConnected: boolean;
  createdAt: string;
  authProvider?: "local" | "google";
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    emergencyContacts: ApiUser["emergencyContacts"];
  }) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }, false),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false),

  me: () => apiFetch<{ user: ApiUser }>("/auth/me"),

  updateProfile: (updates: Partial<ApiUser>) =>
    apiFetch<{ user: ApiUser }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  updatePassword: (oldPassword: string, newPassword: string) =>
    apiFetch<{ message: string }>("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// ── SOS API ───────────────────────────────────────────────────────────────────
export interface SosResult {
  success: boolean;
  type: "health" | "danger";
  totalContacts: number;
  sent: number;
  failed: number;
  details: {
    sent: { contact: string; to: string; sid?: string; status: string }[];
    failed: { contact: string; error: string }[];
  };
  twilioConfigured: boolean;
}

export const sosApi = {
  trigger: (type: "health" | "danger", location?: { lat: number; lng: number }) =>
    apiFetch<SosResult>("/sos/trigger", {
      method: "POST",
      body: JSON.stringify({ type, location }),
    }),

     updateContact: (id: string, data: { phone: string }) =>
    apiFetch<{ success: boolean }>(`/sos/contact/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
