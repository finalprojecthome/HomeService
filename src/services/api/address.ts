import type { District, Province, SubDistrict } from "../../types/address";
import { publicApi } from "../client";

const ADDRESS_BASE_URL = "/api/address";

const addressApi = {
  getProvinces: async (): Promise<Province[]> => {
    return publicApi
      .get<Province[]>(`${ADDRESS_BASE_URL}/provinces`)
      .then((res) => res.data);
  },

  getDistricts: async (provinceId: number): Promise<District[]> => {
    return publicApi
      .get<District[]>(`${ADDRESS_BASE_URL}/districts/${provinceId}`)
      .then((res) => res.data);
  },

  getSubDistricts: async (districtId: number): Promise<SubDistrict[]> => {
    return publicApi
      .get<SubDistrict[]>(`${ADDRESS_BASE_URL}/sub-districts/${districtId}`)
      .then((res) => res.data);
  },
};

export default addressApi;
