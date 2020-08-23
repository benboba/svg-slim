export const useEnum = (e: string, val: string): boolean => new RegExp(`^(?:${e})$`).test(val);
