export const pageSizeStore = {};

export function resetPageKey(key: string) {
  pageSizeStore[key] = 1;
}
