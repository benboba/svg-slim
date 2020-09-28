import { minus } from '../../src/math/minus';

describe('保证精度的减法', () => {
	test('保证精度', () => {
		expect(minus(0.3, 0.1)).toBe(0.2);
	});
});
