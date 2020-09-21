import { symmetry } from '../../src/math/symmetry';

describe('获取 a 相对于 b 的对称值', () => {
	test('输入整数', () => {
		expect(symmetry(300, 200)).toBe(100);
		expect(symmetry(150, 50)).toBe(-50);
		expect(symmetry(5, 5)).toBe(5);
	});

	test('输入负数', () => {
		expect(symmetry(-999, -2342)).toBe(-3685);
	});

	test('输入小数', () => {
		expect(symmetry(0.3, 0.1)).toBe(-0.1);
	});
});
