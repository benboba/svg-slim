import { toFixed } from '../../src/math/to-fixed';

describe('数值按精度截取', () => {
	test('异常输入', () => {
		expect(toFixed(10, NaN)).toBeNaN;
		expect(toFixed(10, -Infinity)).toBe(-Infinity);
	});

	test('小数', () => {
		expect(toFixed(6, 0.00000001)).toBe(0);
		expect(toFixed(6, 1e-8)).toBe(0);
		expect(toFixed(10, 1e-8)).toBe(1e-8);
		expect(toFixed(7, 1.99901e-7)).toBe(2e-7);
		expect(toFixed(6, 1.99901e-7)).toBe(0);
		expect(toFixed(6, 9.99901e-7)).toBe(1e-6);
	});

	test('整数', () => {
		expect(toFixed(6, 1e23)).toBe(1e23);
	});
});
