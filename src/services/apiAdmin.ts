import axios from "axios";

export const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

apiAdmin.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("adminAccessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminAccessTokenExpiresAt");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/auth/admin/login";
      }
    }

    return Promise.reject(error);
  },
);
