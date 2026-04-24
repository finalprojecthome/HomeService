import { markRaw } from "vue";
import { toast } from "vue-sonner";
import Toast from "../components/ui/Toast.vue";

export type ToastVariant = "success" | "error";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export type CustomToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  class?: string;
};

export const variants: Record<ToastVariant, string> = {
  success: "bg-blue-500 text-white",
  error: "bg-red text-white",
};

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export function showCustomToast({
  title,
  description,
  variant = "success",
  position,
  class: userClass,
}: CustomToastProps) {
  toast.custom(markRaw(Toast), {
    componentProps: {
      title,
      description,
      variant,
      class: userClass,
    },
    position: position ?? (isMobile() ? "bottom-center" : "bottom-right"),
  });
}
