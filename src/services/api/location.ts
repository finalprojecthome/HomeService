import { publicApi } from '../client';

const API_BASE_URL = '/api/locations';

export interface Province {
  provinceId: number;
  name: string;
}

export interface District {
  districtId: number;
  provinceId: number;
  name: string;
}

export interface SubDistrict {
  subDistrictId: number;
  districtId: number;
  name: string;
  latitude: number;
  longitude: number;
  postCode: number;
}

export const locationApi = {
  getProvinces: async () => {
    const response = await publicApi.get<Province[]>(`${API_BASE_URL}/provinces`);
    return response.data;
  },

  getDistricts: async (provinceId: number) => {
    const response = await publicApi.get<District[]>(`${API_BASE_URL}/districts`, {
      params: { provinceId }
    });
    return response.data;
  },

  getSubDistricts: async (districtId: number) => {
    const response = await publicApi.get<SubDistrict[]>(`${API_BASE_URL}/sub-districts`, {
      params: { districtId }
    });
    return response.data;
  }
};

export default locationApi;
