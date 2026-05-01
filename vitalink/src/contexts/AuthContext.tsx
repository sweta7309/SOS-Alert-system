import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, ApiUser, getToken, setToken, clearToken } from "@/lib/api";
import { EmergencyContact } from "@/lib/types";

// ── Types ─────────────────────────────────────────────────────────────────────
type AuthUser = ApiUser;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    emergencyContacts: EmergencyContact[];
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore session from stored JWT on mount
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const { user: me } = await authApi.me();
        setUser(me);
      } catch {
        // Token invalid / expired — clear it
        clearToken();
      }
    };
    restore();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      const { token, user: loggedIn } = await authApi.login(email, password);
      setToken(token);
      setUser(loggedIn);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" };
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    emergencyContacts: EmergencyContact[];
  }) => {
    try {
      const { token, user: created } = await authApi.register(data);
      setToken(token);
      setUser(created);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    clearToken();
    setUser(null);
  };

  // ── Update Profile ────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const { user: updated } = await authApi.updateProfile(data);
      setUser(updated);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // ── Update Password ───────────────────────────────────────────────────────
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await authApi.updatePassword(oldPassword, newPassword);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Password update failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
