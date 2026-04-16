import { API_BASE_URL } from "../config/api.config";

const handleResponse = async (response: Response) => {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || "Authentication request failed.";
    throw new Error(message);
  }
  return body.data;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const refreshAuthToken = async (refreshToken: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return handleResponse(response);
};
