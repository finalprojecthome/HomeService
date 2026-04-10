import { publicApi } from "./client";

/** ต้องตรงกับ `services/api/address.ts` — Spring ใช้ prefix `/api/address` */
const ADDRESS_BASE = "/api/address";

export type AddressItem = {
  id: number;
  name: string;
};

export const fetchProvinces = async (): Promise<AddressItem[]> => {
  const res = await publicApi.get<AddressItem[]>(`${ADDRESS_BASE}/provinces`);
  return res.data;
};

export const fetchDistricts = async (
  provinceId: string
): Promise<AddressItem[]> => {
  const res = await publicApi.get<AddressItem[]>(
    `${ADDRESS_BASE}/districts/${provinceId}`
  );
  return res.data;
};

export const fetchSubDistricts = async (
  districtId: string
): Promise<AddressItem[]> => {
  const res = await publicApi.get<AddressItem[]>(
    `${ADDRESS_BASE}/sub-districts/${districtId}`
  );
  return res.data;
};