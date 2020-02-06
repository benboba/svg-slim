/*
 * 保证精度的乘法
 * 用于解决 双精度浮点数 导致精度变化的问题
 */
import { curry } from 'ramda';
import { decimal } from './decimal';
import { toFixed } from './tofixed';

export const multiply = curry((a: number, b: number): number => toFixed(decimal(a).length + decimal(b).length, a * b));
