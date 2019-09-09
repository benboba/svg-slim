export const useEnum = (e: {}, val: string): boolean => isNaN(parseInt(val, 10)) && val.trim() in e;
