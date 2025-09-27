import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("pft_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("pft_access_token");
    const refresh = localStorage.getItem("pft_refresh_token");
    if (access && refresh && !user) {
      (async () => {
        try {
          setLoading(true);
          const data = await api.me();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("pft_user", JSON.stringify(data.user));
          }
        } catch {
          localStorage.removeItem("pft_access_token");
          localStorage.removeItem("pft_refresh_token");
          localStorage.removeItem("pft_user");
          setUser(null);
        } finally {
          setLoading(false);
          setBootstrapped(true);
        }
      })();
    } else {
      setBootstrapped(true);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      if (data?.accessToken) localStorage.setItem("pft_access_token", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("pft_refresh_token", data.refreshToken);
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("pft_user", JSON.stringify(data.user));
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await api.register(payload);

      if (data?.accessToken) localStorage.setItem("pft_access_token", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("pft_refresh_token", data.refreshToken);
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("pft_user", JSON.stringify(data.user));
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem("pft_refresh_token");
    try { if (refresh) await api.logout(refresh); } catch (error){ 
      console.error("Logout error:", error);
    }
    localStorage.removeItem("pft_access_token");
    localStorage.removeItem("pft_refresh_token");
    localStorage.removeItem("pft_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, bootstrapped, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
