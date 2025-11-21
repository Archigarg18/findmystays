export const API_BASE = import.meta.env.VITE_API_URL || "";

export async function apiFetch(path, options = {}) {
  const base = API_BASE || "";
  const url = base + path;
  const headers = { ...(options.headers || {}) };

  // set JSON content-type when body is present and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url, { ...options, headers });
    return res;
  } catch (err) {
    console.error(`Network request failed: ${url}`, err);
    throw new Error(`Network request failed to ${url}: ${err.message || err}`);
  }
}

// Lightweight health check that returns true when server responds OK
export async function checkServer() {
  try {
    const res = await apiFetch('/health', { method: 'GET' });
    return res.ok;
  } catch (e) {
    return false;
  }
}
