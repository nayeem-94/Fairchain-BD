const BASE = import.meta.env.VITE_API_URL || "https://fairchain-backend-with-django.onrender.com";

// Change these if your login stores the token differently.
export const TOKEN_KEY = "access_token";
export const USER_KEY = "user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Pass { auth: false } for login/register so a stale token is never sent.
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 && auth && token) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname.startsWith("/dashboard")) window.location.assign("/login");
    }
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    try { err.data = await res.json(); } catch { /* no body */ }
    throw err;
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

// Turns a DRF error body ({field: ["msg"]} or {detail: "msg"}) into one readable line.
export function errorMessage(err) {
  const d = err?.data;
  if (!d) return err?.status === 403 ? "Your role does not have permission to do that." : "The request failed. Check your connection and try again.";
  if (typeof d === "string") return d;
  if (d.detail) return d.detail;
  return Object.entries(d)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : typeof v === "object" ? JSON.stringify(v) : v}`)
    .join("; ");
}
