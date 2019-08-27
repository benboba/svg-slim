import { curry } from 'ramda';

export const toFixed = curry((digit: number, a: number): number => (a < 0 ? -1 : 1) * Math.round(Math.abs(a) * Math.pow(10, digit)) / Math.pow(10, digit));
