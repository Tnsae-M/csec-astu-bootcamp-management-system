import { useAuthStore } from "../stores/auth.store";

const API_BASE = "/api/users";

function getAuthHeader() {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (res.ok) {
    if (isJson) return res.json();
    // If backend returns text (rare for success) return text
    return res.text();
  }

  // error paths: try to parse useful body
  let bodyText: string;
  try {
    bodyText = isJson ? JSON.stringify(await res.json()) : await res.text();
  } catch (e) {
    bodyText = `<unable to read body: ${String(e)}>`;
  }

  const message = `Request failed (${res.status} ${res.statusText}): ${bodyText}`;
  throw new Error(message);
}

export async function getUsers() {
  console.debug("user.service.getUsers -> fetching", API_BASE);
  const res = await fetch(API_BASE, { headers: { ...getAuthHeader() } });
  console.debug("user.service.getUsers -> response status", res.status);
  return handleResponse(res);
}

export async function createUser(payload: { name: string; email: string; role: string; password?: string }) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateUser(id: string, payload: { name?: string; email?: string; role?: string }) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}
