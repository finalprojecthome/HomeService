import { privateApi } from '../client';

export interface TechnicianProfile {
  name: string;
  phone: string;
  email: string;
  addressDetail: string;
  subDistrictId: number | null;
  isAvailable: boolean;
  serviceIds: number[];
}

export interface TechnicianJob {
  orderId: string;
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
