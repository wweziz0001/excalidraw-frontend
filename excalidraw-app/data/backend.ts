import {
  AUTH_BACKEND_URL,
  BACKEND_JWT_STORAGE_KEY,
  BACKEND_V2_URL,
  AI_BACKEND_URL,
} from "../app_constants";

export type BackendCanvas = {
  id: string;
  name: string;
  thumbnail?: string;
  data?: {
    elements?: any[];
    appState?: Record<string, any>;
    files?: Record<string, any>;
  };
  createdAt?: string;
  updatedAt?: string;
};

export const getBackendJwt = () => {
  return localStorage.getItem(BACKEND_JWT_STORAGE_KEY);
};

export const setBackendJwt = (token: string) => {
  localStorage.setItem(BACKEND_JWT_STORAGE_KEY, token);
};

export type BackendUser = {
  sub?: string;
  login?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

const decodeJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder("utf-8").decode(bytes);

    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode backend JWT", error);
    return null;
  }
};
export const getBackendUser = (): BackendUser | null => {
  const token = getBackendJwt();
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  return {
    sub: payload.sub,
    login: payload.login,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.avatarUrl,
  };
};

export const getBackendDisplayName = () => {
  const user = getBackendUser();
  if (!user) {
    return "";
  }

  return user.name || user.login || user.email || user.sub || "";
};

export const clearBackendJwt = () => {
  localStorage.removeItem(BACKEND_JWT_STORAGE_KEY);
};

export const isBackendLoggedIn = () => {
  return !!getBackendJwt();
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getBackendJwt();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const redirectToBackendLogin = () => {
  if (!AUTH_BACKEND_URL) {
    throw new Error("VITE_APP_AUTH_BACKEND is not configured");
  }
  window.location.href = `${AUTH_BACKEND_URL}/login`;
};

export const listCanvases = async (): Promise<BackendCanvas[]> => {
  const res = await fetch(`${BACKEND_V2_URL}/kv/`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to list canvases: ${res.status}`);
  }

  return res.json();
};

export const getCanvas = async (key: string): Promise<BackendCanvas> => {
  const res = await fetch(`${BACKEND_V2_URL}/kv/${encodeURIComponent(key)}/`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to get canvas: ${res.status}`);
  }

  return res.json();
};

export const saveCanvas = async (
  key: string,
  payload: Record<string, any>,
): Promise<void> => {
  const res = await fetch(`${BACKEND_V2_URL}/kv/${encodeURIComponent(key)}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to save canvas: ${res.status}`);
  }
};

export const deleteCanvas = async (key: string): Promise<void> => {
  const res = await fetch(`${BACKEND_V2_URL}/kv/${encodeURIComponent(key)}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete canvas: ${res.status}`);
  }
};

export const createSharedDocument = async (
  payload: Blob | string | Uint8Array,
) => {
  let body: BodyInit;

  if (payload instanceof Blob) {
    body = payload;
  } else if (payload instanceof Uint8Array) {
    body = new TextDecoder().decode(payload);
  } else {
    body = new Blob([payload], { type: "application/json" });
  }

  const res = await fetch(`${BACKEND_V2_URL}/post/`, {
    method: "POST",
    body,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to create shared document: ${res.status}`);
  }

  return res.json() as Promise<{ id: string }>;
};

export const fetchSharedDocument = async (id: string) => {
  const res = await fetch(`${BACKEND_V2_URL}/${encodeURIComponent(id)}/`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch shared document: ${res.status}`);
  }

  return res.text();
};

export const chatCompletion = async (payload: Record<string, any>) => {
  const res = await fetch(`${AI_BACKEND_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed AI request: ${res.status}`);
  }

  return res.json();
};
