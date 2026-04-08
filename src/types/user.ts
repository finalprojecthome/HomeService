export type Role = "user" | "technician" | "admin";

export interface User {
  readonly id: string;
  name: string;
  phone: string;
  email: string;
  imgUrl: string | null;
  role: Role;
}

export interface UpdateProfileResponse {
  message: string;
}

export interface UpdateProfilePayload {
  fullname: string;
  phone: string;
  image?: File | Blob | null;
}

export interface UserAddress {
  id: number;
  addressName: string;
  addressDetail: string;
  province: { id: number; name: string };
  district: { id: number; name: string };
  subDistrict: { id: number; name: string };
  postCode: number;
  latitude: number;
  longitude: number;
}

export interface AddressPayload {
  addressName: string;
  addressDetail: string;
  subDistrictId: number;
  latitude: number;
  longitude: number;
}

export interface AddressResponse {
  message: string;
}
