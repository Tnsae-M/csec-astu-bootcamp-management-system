const AUTH_STORAGE_KEY = "bms-auth-storage";

type PersistedAuthState = {
  state?: {
    accessToken?: string | null;
    refreshToken?: string | null;
  };
};

const readPersistedAuthState = (): PersistedAuthState | null => {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as PersistedAuthState;
  } catch {
    return null;
  }
};

export const getStoredAccessToken = () => {
  return readPersistedAuthState()?.state?.accessToken ?? null;
};

export const getStoredRefreshToken = () => {
  return readPersistedAuthState()?.state?.refreshToken ?? null;
};

export const getAuthorizationHeader = () => {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
