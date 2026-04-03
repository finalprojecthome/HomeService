import axios from "axios";

export const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
