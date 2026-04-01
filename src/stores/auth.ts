import { defineStore } from "pinia";
import authApi from "../services/api/auth";
import type { LoginFormValues, RegisterFormValues } from "../types/auth";
import type { User } from "../types/user";

const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    error: null as string | null,
    isLoading: false as boolean,
    isGetUserLoading: null as boolean | null,
  }),
  actions: {
    async register(data: RegisterFormValues) {
      this.error = null;
      this.isLoading = true;
      try {
        await authApi.register(data);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "ลงทะเบียนไม่สำเร็จ";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async login(credentials: LoginFormValues) {
      this.error = null;
      this.isLoading = true;
      try {
        const { accessToken } = await authApi.login(credentials);
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

    async getUser() {
      this.error = null;
      this.isGetUserLoading = true;
      try {
        const user = await authApi.getUser();
        this.user = user;
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
  },
});

export default useAuthStore;
