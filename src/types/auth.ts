export interface RegisterFormValues {
  fullname: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
}

export interface ResetPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
