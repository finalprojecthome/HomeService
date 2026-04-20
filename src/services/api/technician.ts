import { privateApi } from "../client";

export const TechnicianJobStatus = {
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const;

export type TechnicianJobStatus = typeof TechnicianJobStatus[keyof typeof TechnicianJobStatus];

export interface TechnicianProfile {
  name: string;
  phone: string;
  email: string;
  addressDetail: string;
  subDistrictId: number;
  latitude?: number;
  longitude?: number;
  bio?: string;
  isAvailable: boolean;
  serviceIds: number[];
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  addressDetail: string;
  subDistrictId: number;
  latitude?: number;
  longitude?: number;
  bio?: string;
  isAvailable: boolean;
  serviceIds: number[];
}

export interface TechnicianJob {
  orderId: string;
  customerName: string;
  addressDetail: string;
  serviceItems: string[];
  totalPrice: number | string;
  scheduledAt: string; // ISO String
  status: TechnicianJobStatus;
}

const technicianApi = {
  getProfile: async (): Promise<TechnicianProfile> => {
    return privateApi.get("/api/technician/profile").then((res) => res.data);
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<any> => {
    return privateApi.put("/api/technician/profile", data).then((res) => res.data);
  },

  getAvailableJobs: async (): Promise<TechnicianJob[]> => {
    return privateApi.get("/api/technician/available-jobs").then((res) => res.data);
  },

  acceptJob: async (orderId: string): Promise<any> => {
    return privateApi.post(`/api/technician/accept-job/${orderId}`).then((res) => res.data);
  },

  getMyJobs: async (): Promise<TechnicianJob[]> => {
    return privateApi.get("/api/technician/my-jobs").then((res) => res.data);
  },

  updateJobStatus: async (orderId: string, status: TechnicianJobStatus): Promise<any> => {
    return privateApi.patch(`/api/technician/update-job-status/${orderId}`, { status }).then((res) => res.data);
  },

  getServices: async (): Promise<{id: number; title: string}[]> => {
    return privateApi.get("/api/technician/services").then((res) => {
      return res.data.map((s: any) => ({ id: s.id, title: s.name }));
    });
  }
};

export default technicianApi;
