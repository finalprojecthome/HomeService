import type {
  LoginFormValues,
  LoginResponse,
  RegisterFormValues,
  RegisterResponse,
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
};

export default authApi;
