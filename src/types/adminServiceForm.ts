export type AdminServiceFormSubServiceDraft = {
  key: string;
  subServiceId: number | null;
  name: string;
  unit: string;
  pricePerUnit: string;
};

export type AdminServiceFormSubServiceFieldErrors = {
  name?: string;
  unit?: string;
  pricePerUnit?: string;
};

export type AdminServiceFormFieldErrors = {
  serviceName?: string;
  categoryId?: string;
  subServices: Record<string, AdminServiceFormSubServiceFieldErrors>;
};

let draftCounter = 0;

export function createAdminServiceFormSubServiceDraft(
  overrides: Partial<AdminServiceFormSubServiceDraft> = {},
): AdminServiceFormSubServiceDraft {
  draftCounter += 1;

  return {
    key: `sub-service-${Date.now()}-${draftCounter}`,
    subServiceId: null,
    name: "",
    unit: "",
    pricePerUnit: "",
    ...overrides,
  };
}
