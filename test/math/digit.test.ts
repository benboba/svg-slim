import { digit } from '../../src/math/digit';

describe('返回两个小数的最大精度', () => {
	test('整数应该返回 0', () => {
		expect(digit(100)).toBe(0);
		expect(digit(1e23)).toBe(0);
	});

	test('小数', () => {
		expect(digit(0.000001)).toBe(6);
		expect(digit(0.00000001)).toBe(8);
		expect(digit(1.00001e-7)).toBe(12);
	});

	test('异常输入', () => {
		expect(digit(NaN)).toBe(0);
		expect(digit(Infinity)).toBe(0);
	});
});
