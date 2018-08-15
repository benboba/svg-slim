import { curry } from 'ramda';

export const toFixed = curry((digit: number, a: number): number => parseFloat(a.toFixed(digit)));