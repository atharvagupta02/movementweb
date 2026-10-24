/**
 * Every request to our backend carries the signed-in person's token.
 *
 * The API now refuses unauthenticated calls, and the screens were written
 * before that - most call `fetch` directly and some forget the `token` header.
 * Installing this once means none of them can forget, and it is the one place
 * that reacts when the server says the login is no longer good.
 */
const BASE = import.meta.env.VITE_BACKEND_URL;
const SESSION_KEYS = ["webapptoken", "employeeData", "loginEmployeeData"];

// Pages that handle their own expired-login messaging, or need no login.
const NO_REDIRECT_PREFIXES = ["/auth", "/daily-attendance"];

const readToken = () => {
  try {
    return localStorage.getItem("webapptoken");
  } catch {
    return null;
  }
};

const endSession = () => {
  try {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* storage unavailable */
  }
  const path = window.location.pathname.toLowerCase();
  if (!NO_REDIRECT_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    window.location.assign("/auth");
  }
};

export const installAuthFetch = () => {
  if (typeof window === "undefined" || !BASE || window.__authFetchInstalled) return;
  window.__authFetchInstalled = true;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input?.url || String(input);
    if (!url.startsWith(BASE)) return nativeFetch(input, init);

    const token = readToken();
    let nextInit = init;
    let attached = false;

    if (token) {
      const headers = new Headers(
        init?.headers || (typeof input !== "string" ? input.headers : undefined),
      );
      if (!headers.has("token")) {
        headers.set("token", token);
        attached = true;
      }
      nextInit = { ...init, headers };
    }

    const response = await nativeFetch(input, nextInit);

    // Only react to a token we attached: the login form, for instance, sends
    // none and a 401 there just means a wrong password.
    if (attached && (response.status === 401 || response.status === 403)) {
      const body = await response
        .clone()
        .json()
        .catch(() => ({}));
      if (["TOKEN_EXPIRED", "INVALID_TOKEN", "ACCOUNT_INACTIVE"].includes(body?.code)) {
        endSession();
      }
    }

    return response;
  };
};
