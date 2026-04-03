import { apiAdmin } from "./apiAdmin";

const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
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

export async function registerAdmin(payload: AdminRegisterPayload) {
  const { data } = await apiAdmin.post<AdminAuthResponse>(
    "/api/admin/auth/register",
    payload,
  );
  return data;
}

export async function loginAdmin(payload: AdminLoginPayload) {
  const { data } = await apiAdmin.post<AdminAuthResponse>(
    "/api/admin/auth/login",
    payload,
  );
  return data;
}

export async function fetchAdminMe(force = false) {
  if (!force && adminMeCache) {
    return adminMeCache;
  }

  const { data } = await apiAdmin.get<AdminMeResponse>("/api/admin/auth/me");
  adminMeCache = data;
  return data;
}

export function setAdminAccessToken(token: string) {
  adminMeCache = null;
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
}

export function getAdminAccessToken() {
  return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function clearAdminAccessToken() {
  adminMeCache = null;
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
}
