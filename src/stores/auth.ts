import { defineStore } from "pinia";
import useCustomerOrdersStore from "./customerOrders";
import authApi from "../services/api/auth";
import type { LoginFormValues, RegisterFormValues } from "../types/auth";
import type { User } from "../types/user";
import { showCustomToast } from "../utils/toast";

let pendingAuthInit: Promise<void> | null = null;

const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    message: null as string | null,
    error: null as string | null,
    isLoading: false as boolean,
    isGetUserLoading: null as boolean | null,
    authReady: false,
  }),
  actions: {
    async register(data: RegisterFormValues) {
      this.message = null;
      this.error = null;
      this.isLoading = true;
      try {
        const { message } = await authApi.register(data);
        this.message = message;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "ลงทะเบียนไม่สำเร็จ";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getUser() {
      this.error = null;
      this.isGetUserLoading = true;
      try {
        const user = await authApi.getUser();
        this.user = user;
        localStorage.setItem("userRole", user.role.toLowerCase());
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "ไม่สามารถโหลดข้อมูลผู้ใช้ได้";
        throw error;
      } finally {
        this.isGetUserLoading = false;
      }
    },

    async login(credentials: LoginFormValues) {
      this.message = null;
      this.error = null;
      this.isLoading = true;
      try {
        const { accessToken, message } = await authApi.login(credentials);
        this.message = message;
        localStorage.setItem("accessToken", accessToken);
        await this.getUser();
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Call once on app load before route guards that need `user`.
     */
    async initializeAuth() {
      if (this.authReady) return;
      if (!pendingAuthInit) {
        pendingAuthInit = (async () => {
          try {
            const token = localStorage.getItem("accessToken");
            if (token) {
              try {
                await this.getUser();
                if (window.location.pathname === "/") {
                  showCustomToast({
                    title: "ยินดีต้อนรับกลับ",
                    description: `ดีใจที่ได้เจอคุณอีกครั้ง${
                      this.user?.name ? `คุณ ${this.user.name}` : ""
                    }`,
                  });
                }
              } catch {
                this.logout();
                showCustomToast({
                  variant: "error",
                  title: "เกิดข้อผิดพลาด",
                  description: this.error || "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
                });
              }
            }
          } finally {
            this.authReady = true;
            pendingAuthInit = null;
          }
        })();
      }
      await pendingAuthInit;
    },

    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      this.user = null;
      this.message = null;
      this.error = null;
      this.isGetUserLoading = null;
      useCustomerOrdersStore().invalidateAll();
    },
  },
});

export default useAuthStore;
