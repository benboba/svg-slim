import { curry } from 'ramda';

export const fillIn = curry((digit: number, s: string): string => s.length >= digit ? s : fillIn(digit, `0${s}`));
