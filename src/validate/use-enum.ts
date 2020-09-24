import { createFullMatch } from '../const/regs';

export const useEnum = (e: string, val: string): boolean => createFullMatch(e).test(val);
