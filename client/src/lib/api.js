// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function rawRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  let data = null;
  try { data = await res.json(); } catch (error) {
    console.error("Failed to parse response:", error);
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data ?? {};
}

export async function requestWithRefresh(path, opts = {}) {
  const accessToken = localStorage.getItem("pft_access_token");
  const refreshToken = localStorage.getItem("pft_refresh_token");

  try {

    return await rawRequest(path, { ...opts, token: accessToken || undefined });
  } catch (err) {

    if (err.status === 401 && refreshToken) {
      try {
        const refresh = await rawRequest("/api/auth/refresh", {
          method: "POST",
        });
        if (refresh?.accessToken) {
          localStorage.setItem("pft_access_token", refresh.accessToken);

          return await rawRequest(path, { ...opts, token: refresh.accessToken });
        }
      } catch {
        console.warn("Refresh token is invalid, logging out");
      }
    }
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) =>
    rawRequest("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    rawRequest("/api/auth/login", { method: "POST", body: payload }),
  logout: () => rawRequest("/api/auth/logout", { method: "POST" }),
  me: () => requestWithRefresh("/api/auth/profile", { method: "GET" }),

  // Transactions
  listTx: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return requestWithRefresh(`/api/transactions${q ? `?${q}` : ""}`, {
      method: "GET",
    });
  },
  createTx: (payload) =>
    requestWithRefresh("/api/transactions", { method: "POST", body: payload }),
  updateTx: (id, payload) =>
    requestWithRefresh(`/api/transactions/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteTx: (id) =>
    requestWithRefresh(`/api/transactions/${id}`, { method: "DELETE" }),
};
