import type {
  LoginFormValues,
  LoginResponse,
  RegisterFormValues,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../../types/auth";
import type { User } from "../../types/user";
import { privateApi, publicApi } from "../client";

const authApi = {
  register: async (data: RegisterFormValues): Promise<RegisterResponse> => {
    return publicApi.post("/auth/register", data).then((res) => res.data);
  },

  login: async (data: LoginFormValues): Promise<LoginResponse> => {
    return publicApi.post("/auth/login", data).then((res) => res.data);
  },

  getUser: async (): Promise<User> => {
    return privateApi.get("/auth/get-user").then((res) => res.data);
  },

  resetPassword: async (
    data: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse> => {
    return privateApi
      .put<ResetPasswordResponse>("/auth/reset-password", data)
      .then((res) => res.data);
  },
};

export default authApi;
