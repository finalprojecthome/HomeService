/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SPRING_BOOT_PUBLIC_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  /** default /api/orders */
  readonly VITE_API_ORDER_PATH?: string;
}
