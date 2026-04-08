import type { District, Province, SubDistrict } from "../../types/address";
import { publicApi } from "../client";

const addressApi = {
  getProvinces: async (): Promise<Province[]> => {
    return publicApi
      .get<Province[]>("/address/provinces")
      .then((res) => res.data);
  },

  getDistricts: async (provinceId: number): Promise<District[]> => {
    return publicApi
      .get<District[]>(`/address/districts/${provinceId}`)
      .then((res) => res.data);
  },
  
  getSubDistricts: async (districtId: number): Promise<SubDistrict[]> => {
    return publicApi
      .get<SubDistrict[]>(`/address/sub-districts/${districtId}`)
      .then((res) => res.data);
  },
};

export default addressApi;
