import cn from "../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type ButtonSize = "sm" | "lg";

export const baseStyle =
  "inline-flex items-center justify-center gap-2 w-fit rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed";

export const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-blue-600 text-white",
    "hover:bg-blue-500",
    "active:bg-blue-800",
    "disabled:text-gray-100 disabled:bg-gray-300",
  ),
  secondary: cn(
    "text-blue-600 ring-1 ring-inset ring-blue-600",
    "hover:text-blue-400 hover:ring-blue-400",
    "active:text-blue-800 active:ring-blue-800",
    "disabled:text-gray-400 disabled:bg-gray-100 disabled:ring-gray-400",
  ),
  ghost: cn(
    "style-button text-blue-600",
    "hover:text-blue-400",
    "active:text-blue-800",
    "disabled:text-gray-400",
  ),
  icon: "",
};

export const sizes: Record<ButtonSize, string> = {
  sm: "px-6 py-2.5 style-headline-5",
  lg: "px-8 py-3 style-headline-2",
};
