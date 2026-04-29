import { defineStore } from "pinia";
import orderApi from "../services/api/order";
import type { OrderSummaryResponse } from "../types/order";

let loadSeqActive = 0;
let loadSeqCompleted = 0;

/** Caches customer order lists per tab to avoid refetch when switching sidebar links. */
const useCustomerOrdersStore = defineStore("customerOrders", {
  state: () => ({
    /** undefined = not loaded or invalidated */
    activeOrders: undefined as OrderSummaryResponse[] | undefined,
    completedOrders: undefined as OrderSummaryResponse[] | undefined,
    loadingActive: false,
    loadingCompleted: false,
    errorActive: null as string | null,
    errorCompleted: null as string | null,
  }),
  actions: {
    async ensureActiveLoaded(force = false) {
      if (!force && this.activeOrders !== undefined) {
        return;
      }
      const seq = ++loadSeqActive;
      this.loadingActive = true;
      this.errorActive = null;
      try {
        const data = await orderApi.listMine({ scope: "ACTIVE" });
        if (seq !== loadSeqActive) return;
        this.activeOrders = data;
      } catch (e) {
        if (seq !== loadSeqActive) return;
        this.errorActive =
          e instanceof Error ? e.message : "โหลดรายการไม่สำเร็จ";
      } finally {
        if (seq === loadSeqActive) {
          this.loadingActive = false;
        }
      }
    },

    async ensureCompletedLoaded(force = false) {
      if (!force && this.completedOrders !== undefined) {
        return;
      }
      const seq = ++loadSeqCompleted;
      this.loadingCompleted = true;
      this.errorCompleted = null;
      try {
        const data = await orderApi.listMine({ scope: "COMPLETED" });
        if (seq !== loadSeqCompleted) return;
        this.completedOrders = data;
      } catch (e) {
        if (seq !== loadSeqCompleted) return;
        this.errorCompleted =
          e instanceof Error ? e.message : "โหลดรายการไม่สำเร็จ";
      } finally {
        if (seq === loadSeqCompleted) {
          this.loadingCompleted = false;
        }
      }
    },

    invalidateAfterNewOrder() {
      this.activeOrders = undefined;
    },

    invalidateAll() {
      loadSeqActive += 1;
      loadSeqCompleted += 1;
      this.activeOrders = undefined;
      this.completedOrders = undefined;
      this.loadingActive = false;
      this.loadingCompleted = false;
      this.errorActive = null;
      this.errorCompleted = null;
    },
  },
});

export default useCustomerOrdersStore;
