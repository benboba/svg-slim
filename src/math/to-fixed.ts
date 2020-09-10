import { curry } from 'ramda';
import { isExp } from './is-exp';
import { isFloat } from './is-float';

// 对纯小数进行按位四舍五入
const floatFixed = (_dgt: number, sourceNum: number, sourceStr: string) => {
	// dgt 为负数的当作 0 来处理
	const dgt = Math.max(_dgt, 0);
	// dgt 为 0 表示四舍五入取整
	if (dgt === 0) {
		return Math.round(sourceNum);
	}
	const dotIndex = sourceStr.indexOf('.');
	const digitN = sourceStr.length - (dotIndex + 1);
	if (digitN <= dgt) {
		return sourceNum;
	}
	// 最后一位四舍五入
	const fixedSub = sourceStr.slice(0, dotIndex + dgt + 1);
	if (+sourceStr[dotIndex + dgt + 1] > 4) {
		if (/\.9+$/.test(fixedSub)) {
			// 需要进位整数的情况
			return sourceNum < 0 ? Math.floor(sourceNum) : Math.ceil(sourceNum);
		} else {
			return +fixedSub.replace(/([0-8])9*$/, (_mantissa, lastN) => `${+lastN + 1}`);
		}
	} else {
		return +fixedSub;
	}
};

export const toFixed = curry((digit: number, n: number): number => {
	// NaN 和 Infinity 直接返回
	if (!isFinite(n)) {
		return n;
	}
	const s = n.toString();
	// 科学计数法
	if (isExp(s)) {
		const eIndex = s.indexOf('e');
		if (s[eIndex + 1] === '-') {
			const exp = +s.slice(eIndex + 2);
			// 精度要求低于 (科学计数法精度 - 1)，直接返回 0
			if (digit < exp - 1) {
				return 0;
			}

			// 如果精度等于 (科学计数法精度 - 1)，对整数位进行四舍五入
			if (digit === exp - 1) {
				return +`${+s[0] > 4 ? 1 : 0}e-${exp - 1}`;
			}

			// 1.00001e-7 的精度是 12
			if (isFloat(s)) {
				// 精度大于等于数值精度，返回原数值
				if (digit >= eIndex - (s.indexOf('.') + 1) + exp) {
					return n;
				}
				const dotS = s.slice(0, eIndex);
				const dotFix = floatFixed(digit - exp, +dotS, dotS);
				return +`${dotFix}e-${exp}`;
			}
			// 精度大于等于数值精度，返回原数值
			return n;
		} else {
			return n;
		}
	}
	// 小数的情况
	if (isFloat(s)) {
		return floatFixed(digit, n, s);
	}
	// 整数的情况
	return n;
});
