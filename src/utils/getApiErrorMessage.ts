import type { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorPayload>;
  return axiosError.response?.data?.message || fallback;
}
