import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../../types/user";
import { privateApi } from "../client";

function appendImage(formData: FormData, image: File | Blob): void {
  if (image instanceof File) {
    formData.append("image", image);
  } else {
    formData.append("image", image, "profile.jpg");
  }
}

const profileApi = {
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
      .put<UpdateProfileResponse>("/user/profile", formData)
      .then((res) => res.data);
  },
};

export default profileApi;
