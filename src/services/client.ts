import axios from "axios";

/** ใช้ VITE_ เป็นหลัก — Vite จะฝังเฉพาะ env ที่ขึ้นต้น VITE_ ใน client */
const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.SPRING_BOOT_PUBLIC_API_URL ??
  "http://localhost:8080";

export const createApiInstance = (withAuth: boolean) => {
  const instance = axios.create({
    baseURL,
  });

  if (withAuth) {
    instance.interceptors.request.use((config) => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("ไม่พบโทเค็น JWT สำหรับคำขอที่ต้องยืนยันตัวตน");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดขณะดึงโทเค็น JWT:", error);
      }

      return config;
    });
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        error.message = "เกิดข้อผิดพลาดเครือข่าย กรุณาลองอีกครั้ง";
        return Promise.reject(error);
      }

      const { status, data } = error.response;

      if (status === 401 && withAuth) {
        console.warn("ไม่ได้รับอนุญาต — กำลังนำทางไปหน้าเข้าสู่ระบบ");
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
        return Promise.reject(
          new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง"),
        );
      }

      let errorMessage = `คำขอล้มเหลวด้วยรหัสสถานะ ${status}`;

      if (data) {
        if (typeof data === "string") {
          errorMessage = data;
        } else if (typeof data === "object" && data !== null) {
          const body = data as Record<string, unknown>;
          if (typeof body.message === "string") {
            errorMessage = body.message;
          } else if (typeof body.error === "string") {
            errorMessage = body.error;
          } else if (typeof body.detail === "string") {
            errorMessage = body.detail;
          }
        }
      }

      error.message = errorMessage;
      return Promise.reject(error);
    },
  );

  return instance;
};

export const publicApi = createApiInstance(false);
export const privateApi = createApiInstance(true);
