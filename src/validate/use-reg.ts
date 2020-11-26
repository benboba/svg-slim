export const useReg = (reg: RegExp, val: string): boolean => reg.test(val.trim());
