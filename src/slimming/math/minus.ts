/*
 * 保证精度的减法
 * 用于解决 双精度浮点数 导致精度变化的问题
 */
import { curry } from 'ramda';
import { digit } from './digit';
import { toFixed } from './tofixed';

export const minus = curry((a: number, b: number): number => toFixed(digit(a, b), a - b));