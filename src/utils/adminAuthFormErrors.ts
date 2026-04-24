import { getApiErrorMessage } from "./getApiErrorMessage";

export type AdminLoginField = "email" | "password";
export type AdminRegisterField =
  | "name"
  | "phone"
  | "email"
  | "password"
  | "inviteCode";

const INVALID_MESSAGE = "ข้อมูลไม่ถูกต้อง";

function normalizeErrorMessage(error: unknown) {
  return getApiErrorMessage(error, INVALID_MESSAGE).trim() || INVALID_MESSAGE;
}

function lowercaseErrorMessage(error: unknown) {
  return normalizeErrorMessage(error).toLowerCase();
}

export function getAdminLoginErrorState(error: unknown) {
  const message = normalizeErrorMessage(error);

  return {
    toastMessage: INVALID_MESSAGE,
    fieldErrors: {
      email: message,
      password: message,
    } satisfies Record<AdminLoginField, string | null>,
  };
}

export function getAdminRegisterErrorState(error: unknown) {
  const message = normalizeErrorMessage(error);
  const lowerMessage = lowercaseErrorMessage(error);

  const fieldErrors: Record<AdminRegisterField, string | null> = {
    name: null,
    phone: null,
    email: null,
    password: null,
    inviteCode: null,
  };

  if (lowerMessage.includes("invite")) {
    fieldErrors.inviteCode = message;
  }

  if (
    lowerMessage.includes("email") ||
    lowerMessage.includes("อีเมล") ||
    lowerMessage.includes("credentials")
  ) {
    fieldErrors.email = message;
  }

  if (
    lowerMessage.includes("phone") ||
    lowerMessage.includes("เบอร์") ||
    lowerMessage.includes("โทร")
  ) {
    fieldErrors.phone = message;
  }

  if (
    lowerMessage.includes("password") ||
    lowerMessage.includes("pass") ||
    lowerMessage.includes("รหัส")
  ) {
    fieldErrors.password = message;
  }

  if (lowerMessage.includes("name") || lowerMessage.includes("ชื่อ")) {
    fieldErrors.name = message;
  }

  return {
    toastMessage: INVALID_MESSAGE,
    fieldErrors,
  };
}
