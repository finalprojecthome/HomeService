import { apiAdmin } from "./apiAdmin";

const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";

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

export function setAdminAccessToken(token: string) {
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
}

export function getAdminAccessToken() {
  return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function clearAdminAccessToken() {
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
}
