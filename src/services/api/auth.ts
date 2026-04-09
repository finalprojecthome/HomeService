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

type UserResponseDto = Omit<User, "updatedAt"> & {
  updatedAt: string;
};

const AUTH_BASE_URL = "/api/auth";

function mapUserResponse(data: UserResponseDto): User {
  return {
    ...data,
    updatedAt: new Date(data.updatedAt),
  };
}

const authApi = {
  register: async (data: RegisterFormValues): Promise<RegisterResponse> => {
    return publicApi
      .post(`${AUTH_BASE_URL}/register`, data)
      .then((res) => res.data);
  },

  login: async (data: LoginFormValues): Promise<LoginResponse> => {
    return publicApi
      .post(`${AUTH_BASE_URL}/login`, data)
      .then((res) => res.data);
  },

  getUser: async (): Promise<User> => {
    return privateApi
      .get<UserResponseDto>(`${AUTH_BASE_URL}/get-user`)
      .then((res) => mapUserResponse(res.data));
  },

  resetPassword: async (
    data: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse> => {
    return privateApi
      .put<ResetPasswordResponse>(`${AUTH_BASE_URL}/reset-password`, data)
      .then((res) => res.data);
  },
};

export default authApi;
