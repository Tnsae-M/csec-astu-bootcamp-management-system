import { getAuthorizationHeader } from "../lib/auth-storage";

// ✅ MUST point to backend
const API_BASE = "http://localhost:3000/api/users";

async function handleResponse(res) {
  const isJson = res.headers.get("content-type")?.includes("application/json");

  if (res.ok) {
    return isJson ? res.json() : res.text();
  }

  let errorBody;
  try {
    errorBody = isJson ? await res.json() : await res.text();
  } catch {
    errorBody = "Unknown error";
  }

  throw new Error(
    `Request failed (${res.status}): ${JSON.stringify(errorBody)}`
  );
}

// GET USERS
export async function getUsers() {
  const res = await fetch(API_BASE, {
    headers: {
      ...getAuthorizationHeader(),
    },
  });

  return handleResponse(res);
}

// CREATE USER
export async function createUser(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// UPDATE USER
export async function updateUser(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// DELETE USER
export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthorizationHeader(),
    },
  });

  return handleResponse(res);
}