/*
 * 保证精度的乘法
 * 用于解决 双精度浮点数 导致精度变化的问题
 */
import { curry } from 'ramda';
import { digit } from './digit';
import { toFixed } from './to-fixed';

export const multiply = curry((a: number, b: number) => {
	const dgt = digit(a) + digit(b);
	return toFixed(dgt, a * b);
});
