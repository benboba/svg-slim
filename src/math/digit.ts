/*
 * 获取一个数字的精度
 */
import { isExp } from './is-exp';
import { isFloat } from './is-float';

export const digit = (n: number): number => {
	// 忽略 NaN 和 Infinity
	if (!isFinite(n)) {
		return 0;
	}
	const s = n.toString();
	// 科学计数法的情况
	if (isExp(s)) {
		const eIndex = s.indexOf('e');
		if (s[eIndex + 1] === '-') {
			const exp = +s.slice(eIndex + 2);
			// 1.00001e-7 的精度是 12
			if (isFloat(s)) {
				return eIndex - (s.indexOf('.') + 1) + exp;
			}
			return exp;
		} else {
			return 0;
		}
	}
	// 小数的情况
	if (isFloat(s)) {
		return s.length - (s.indexOf('.') + 1);
	}
	// 整数的情况
	return 0;
};
