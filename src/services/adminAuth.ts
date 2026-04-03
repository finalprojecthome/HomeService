import { apiAdmin } from "./apiAdmin";

const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
const ADMIN_REFRESH_TOKEN_KEY = "adminRefreshToken";
const ADMIN_EXPIRES_AT_KEY = "adminAccessTokenExpiresAt";

let adminMeCache: AdminMeResponse | null = null;

export type AdminRole = "admin";

export type AdminRegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
  inviteCode: string;
};

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminAuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
};

export type AdminMeResponse = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
};

type StoredAdminSession = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
};

function getStoredAdminSession(): StoredAdminSession | null {
  const accessToken = localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
  const expiresAt = localStorage.getItem(ADMIN_EXPIRES_AT_KEY);

  if (!accessToken || !expiresAt) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt: Number(expiresAt),
  };
}

function setStoredAdminSession(session: StoredAdminSession) {
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, session.accessToken);
  if (session.refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  }
  localStorage.setItem(ADMIN_EXPIRES_AT_KEY, String(session.expiresAt));
  adminMeCache = null;
}

function normalizeSession(data: AdminAuthResponse) {
  if (data.tokenType?.toLowerCase() !== "bearer") {
    throw new Error("Unsupported token type");
  }

  return {
    accessToken: data.accessToken,
    refreshToken: null,
    expiresAt: Date.now() + data.expiresInMs,
  };
}

export async function initializeAdminAuthSession() {
  return getStoredAdminSession();
}

export async function loginAdmin(payload: AdminLoginPayload) {
  const { data } = await apiAdmin.post<AdminAuthResponse>("/api/admin/auth/login", {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });
  const session = normalizeSession(data);
  setStoredAdminSession(session);
  return session;
}

export async function registerAdmin(payload: AdminRegisterPayload) {
  const { data } = await apiAdmin.post<AdminAuthResponse>("/api/admin/auth/register", {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    inviteCode: payload.inviteCode.trim(),
  });
  const session = normalizeSession(data);
  setStoredAdminSession(session);
  return data;
}

export async function fetchAdminMe(force = false) {
  await initializeAdminAuthSession();

  if (!force && adminMeCache) {
    return adminMeCache;
  }

  const { data } = await apiAdmin.get<AdminMeResponse>("/api/admin/auth/me");
  adminMeCache = data;
  return data;
}

export async function getAdminAccessToken() {
  const session = await initializeAdminAuthSession();
  return session?.accessToken ?? null;
}

export function clearAdminAccessToken() {
  adminMeCache = null;
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EXPIRES_AT_KEY);
}
