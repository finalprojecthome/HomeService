import type {
  AddressPayload,
  AddressResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserAddress,
} from "../../types/user";
import { privateApi } from "../client";

const USER_BASE_URL = "/api/user";

function appendImage(formData: FormData, image: File | Blob): void {
  if (image instanceof File) {
    formData.append("image", image);
  } else {
    formData.append("image", image, "profile.jpg");
  }
}

const userApi = {
  getAddresses: async (): Promise<UserAddress[]> => {
    return privateApi
      .get<UserAddress[]>(`${USER_BASE_URL}/addresses`)
      .then((res) => res.data);
  },

  createAddress: async (data: AddressPayload): Promise<AddressResponse> => {
    return privateApi
      .post<AddressResponse>(`${USER_BASE_URL}/addresses`, data)
      .then((res) => res.data);
  },

  updateProfile: async (
    data: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("phone", data.phone);
    if (data.image != null) {
      appendImage(formData, data.image);
    }

    return privateApi
      .put<UpdateProfileResponse>(`${USER_BASE_URL}/profile`, formData)
      .then((res) => res.data);
  },

  updateAddress: async (
    addressId: number,
    data: AddressPayload,
  ): Promise<AddressResponse> => {
    return privateApi
      .put<AddressResponse>(`${USER_BASE_URL}/addresses/${addressId}`, data)
      .then((res) => res.data);
  },

  deleteAddress: async (addressId: number): Promise<AddressResponse> => {
    return privateApi
      .delete<AddressResponse>(`${USER_BASE_URL}/addresses/${addressId}`)
      .then((res) => res.data);
  },
};

export default userApi;
