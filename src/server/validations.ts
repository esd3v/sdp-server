export const validatePageNumber = (page: number) =>
  Number.isInteger(page);

export const validatePerPageNumber = (perPage: number, allowed: number[]) =>
  allowed.includes(perPage);

export const validatePageRange = (page: number, pageTotal: number) =>
  (page > 0) && (page <= pageTotal);
