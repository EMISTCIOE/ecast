import axios from "axios";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: base });

function isPublicPath(): boolean {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname || "";
  // Pages that should never force-redirect on auth changes
  return (
    p === "/login" ||
    p === "/reset-password" ||
    p.startsWith("/reset-password/") ||
    p.startsWith("/account/") || // first-time password change
    p === "/unsubscribe" ||
    p === "/ambassadors" ||
    p === "/alumni"
  );
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle token invalidation errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = data?.code || data?.detail;

      // Handle token invalidation errors
      if (
        (status === 401 || status === 403) &&
        (errorCode === "role_changed" ||
          errorCode === "token_invalidated" ||
          (typeof errorCode === "string" &&
            (errorCode.includes("permissions have been changed") ||
              errorCode.includes("permissions have been updated"))))
      ) {
        console.warn("Token invalidated due to permission changes");
        // On public paths, just clear tokens; avoid redirect loops
        if (isPublicPath()) {
          try {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
          } catch {}
        } else {
          logout();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Logout utility - clears all auth data and redirects to login
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    // Avoid redirecting away from reset/login related screens
    if (!isPublicPath()) {
      window.location.href = "/login?session_expired=true";
    }
  }
}

// Decode JWT token to extract payload
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Validate if token's role matches the stored user's role
export function validateTokenRole(): boolean {
  if (typeof window === "undefined") return true;

  const token = localStorage.getItem("access");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) return false;

  try {
    const payload = decodeJWT(token);
    const user = JSON.parse(userStr);

    // Check if role in token matches current user role
    if (payload?.role && user?.role && payload.role !== user.role) {
      console.warn("Token role mismatch detected - logging out");
      // On public paths, clear tokens but don't redirect
      if (isPublicPath()) {
        try {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
        } catch {}
      } else {
        logout();
      }
      return false;
    }

    return true;
  } catch (e) {
    return true; // Don't fail if we can't validate
  }
}

// In-browser token refresh
let refreshing: Promise<string | null> | null = null;
async function refreshAccess(): Promise<string | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return null;
      const r = await fetch("/api/app/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!r.ok) {
        // If refresh fails, logout
        logout();
        return null;
      }
      const data = await r.json();
      if (data?.access) {
        localStorage.setItem("access", data.access);
        // Update user data if included
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        return data.access as string;
      }
      return null;
    } catch (e) {
      logout();
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export async function authedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  // Validate token role before making request
  if (!validateTokenRole()) {
    throw new Error("Token validation failed");
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  const headers = new Headers(init.headers as HeadersInit);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });

  // Check for authentication errors
  if (res.status === 401 || res.status === 403) {
    try {
      const errorData = await res.clone().json();
      const errorCode = errorData?.code || errorData?.detail;

      // Handle specific token invalidation errors
      if (
        errorCode === "role_changed" ||
        errorCode === "token_invalidated" ||
        (typeof errorCode === "string" &&
          (errorCode.includes("permissions have been changed") ||
            errorCode.includes("permissions have been updated")))
      ) {
        console.warn("Token invalidated due to permission changes");
        if (isPublicPath()) {
          try {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
          } catch {}
        } else {
          logout();
        }
        throw new Error("Your permissions have changed. Please log in again.");
      }
    } catch (e) {
      // If we can't parse error, continue with normal flow
      if (e instanceof Error && e.message.includes("permissions")) {
        throw e;
      }
    }
  }

  if (res.status !== 401) return res;

  // Try refresh once for generic 401
  const newAccess = await refreshAccess();
  if (!newAccess) {
    if (isPublicPath()) {
      try {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
      } catch {}
    } else {
      logout();
    }
    return res;
  }

  const retryHeaders = new Headers(init.headers as HeadersInit);
  retryHeaders.set("Authorization", `Bearer ${newAccess}`);
  const retryRes = await fetch(input, { ...init, headers: retryHeaders });

  // If retry also fails with 401, logout
  if (retryRes.status === 401) {
    if (isPublicPath()) {
      try {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
      } catch {}
    } else {
      logout();
    }
  }

  return retryRes;
}

export async function proxyFetch(path: string, init?: RequestInit) {
  const res = await authedFetch(`/api/app${path}`, init);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
