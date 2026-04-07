<<<<<<< HEAD
import { privateApi } from '../client';
=======
import { privateApi } from "../client";
>>>>>>> a6b3a10 (feat: implement technician portal with API service, routing, and navigation updates)

export interface TechnicianProfile {
  name: string;
  phone: string;
  email: string;
  addressDetail: string;
<<<<<<< HEAD
  subDistrictId: number | null;
=======
  subDistrictId: number;
  isAvailable: boolean;
  serviceIds: number[];
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  addressDetail: string;
  subDistrictId: number;
>>>>>>> a6b3a10 (feat: implement technician portal with API service, routing, and navigation updates)
  isAvailable: boolean;
  serviceIds: number[];
}

export interface TechnicianJob {
  orderId: string;
<<<<<<< HEAD
  status: string;
  customerName: string;
  addressDetail: string;
  scheduledAt: string;
  totalPrice: number | null;
  serviceItems: any[];
}

export const technicianApi = {
  getProfile: () => privateApi.get<TechnicianProfile>('/technician/profile'),
  updateProfile: (data: Partial<TechnicianProfile>) => privateApi.put('/technician/profile', data),
  getAvailableJobs: () => privateApi.get<TechnicianJob[]>('/technician/jobs/available'),
  getMyJobs: () => privateApi.get<TechnicianJob[]>('/technician/jobs/my'),
  acceptJob: (orderId: string) => privateApi.post(`/technician/jobs/${orderId}/accept`),
  updateJobStatus: (orderId: string, status: string) => privateApi.patch(`/technician/jobs/${orderId}/status`, { status }),
};
=======
  customerName: string;
  addressDetail: string;
  serviceItems: string[];
  totalPrice: number;
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
>>>>>>> a6b3a10 (feat: implement technician portal with API service, routing, and navigation updates)
