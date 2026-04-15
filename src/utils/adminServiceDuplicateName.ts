import type { AdminServiceFormFieldErrors, AdminServiceFormSubServiceDraft } from "../types/adminServiceForm";

export const DUPLICATE_SERVICE_NAME_MESSAGE =
  "Service name already exists in this category";
export const DUPLICATE_SUB_SERVICE_NAME_MESSAGE =
  "Sub-service name already exists in this service";

function normalizeSubServiceName(name: string) {
  return name.trim().replace(/\s+/g, "").toLocaleLowerCase();
}

export function findFirstDuplicateSubServiceName(
  rows: AdminServiceFormSubServiceDraft[],
) {
  const seenNames = new Set<string>();

  for (const row of rows) {
    const trimmedName = row.name.trim();
    if (!trimmedName) {
      continue;
    }

    const normalizedName = normalizeSubServiceName(trimmedName);
    if (seenNames.has(normalizedName)) {
      return trimmedName;
    }

    seenNames.add(normalizedName);
  }

  return null;
}

export function applyDuplicateSubServiceNameErrors(
  rows: AdminServiceFormSubServiceDraft[],
  nextErrors: AdminServiceFormFieldErrors,
  message: string,
) {
  const rowsByName = new Map<string, AdminServiceFormSubServiceDraft[]>();

  for (const row of rows) {
    const trimmedName = row.name.trim();
    if (!trimmedName) {
      continue;
    }

    const normalizedName = normalizeSubServiceName(trimmedName);
    const matchingRows = rowsByName.get(normalizedName) ?? [];
    matchingRows.push(row);
    rowsByName.set(normalizedName, matchingRows);
  }

  for (const duplicateRows of rowsByName.values()) {
    if (duplicateRows.length < 2) {
      continue;
    }

    for (const row of duplicateRows) {
      nextErrors.subServices[row.key] = {
        ...nextErrors.subServices[row.key],
        name: message,
      };
    }
  }
}
