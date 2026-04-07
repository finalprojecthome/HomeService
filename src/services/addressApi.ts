import { publicApi } from "./client";

export type AddressItem = {
  id: number;
  name: string;
};


export const fetchProvinces = async (): Promise<AddressItem[]> => {
  const res = await publicApi.get("/address/provinces");
  return res.data;
};

export const fetchDistricts = async (
  provinceId: string
): Promise<AddressItem[]> => {
  const res = await publicApi.get(`/address/districts/${provinceId}`);
  return res.data;
};


export const fetchSubDistricts = async (
  districtId: string
): Promise<AddressItem[]> => {
  const res = await publicApi.get(`/address/sub-districts/${districtId}`);
  return res.data;
};