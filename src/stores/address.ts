import { defineStore } from "pinia";
import userApi from "../services/api/user";
import type { UserAddress } from "../types/user";

const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: [] as UserAddress[],
    isLoading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async fetchAddresses(force = false) {
      if (!force && (this.isLoading || this.addresses.length > 0)) {
        return;
      }

      this.error = null;
      this.isLoading = true;
      try {
        this.addresses = await userApi.getAddresses();
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "ไม่สามารถโหลดข้อมูลที่อยู่ได้";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearAddress() {
      this.addresses = [];
      this.error = null;
    },
  },
});

export default useAddressStore;
