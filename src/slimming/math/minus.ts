/*
 * 保证精度的减法
 * 用于解决 双精度浮点数 导致精度变化的问题
 */
import { curry } from 'ramda';
import { digit } from './digit';
import { toFixed } from './tofixed';

export const minus = curry((a: number, b: number) => {
	const dgt = Math.max(digit(a), digit(b));
	return toFixed(dgt, a - b);
});
