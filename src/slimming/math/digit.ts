/*
 * 返回两个小数的最大精度
 */
import { curry } from 'ramda';
import { decimal } from './decimal';

export const digit = curry((a: number, b: number): number => Math.max(decimal(a).length, decimal(b).length));