import { privateApi } from "../client";

export interface TechnicianProfile {
  name: string;
  phone: string;
  email: string;
  addressDetail: string;
  subDistrictId: number | null;
  isAvailable: boolean;
  serviceIds: number[];
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  addressDetail: string;
  subDistrictId: number;
  isAvailable: boolean;
  serviceIds: number[];
}

export interface TechnicianJob {
  orderId: string;
  customerName: string;
  addressDetail: string;
  serviceItems: string[];
  totalPrice: number | null;
  scheduledAt: string; // ISO String
  status: string;
}

const technicianApi = {
  getProfile: async (): Promise<TechnicianProfile> => {
    return privateApi.get("/api/technician/profile").then((res) => res.data);
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<any> => {
    return privateApi.put("/api/technician/profile", data).then((res) => res.data);
  },

  getAvailableJobs: async (): Promise<TechnicianJob[]> => {
    return privateApi.get("/api/technician/jobs/available").then((res) => res.data);
  },

  acceptJob: async (orderId: string): Promise<any> => {
    return privateApi.post(`/api/technician/jobs/${orderId}/accept`).then((res) => res.data);
  },

  getMyJobs: async (): Promise<TechnicianJob[]> => {
    return privateApi.get("/api/technician/jobs").then((res) => res.data);
  },

  updateJobStatus: async (orderId: string, status: string): Promise<any> => {
    return privateApi.put(`/api/technician/jobs/${orderId}/status`, { status }).then((res) => res.data);
  },

  getServices: async (): Promise<{id: number; title: string}[]> => {
    return privateApi.get("/api/technician/services").then((res) => res.data);
  }
};

export default technicianApi;
