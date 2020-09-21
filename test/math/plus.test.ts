import { plus } from '../../src/math/plus';

describe('保证精度的加法', () => {
	test('保证精度', () => {
		expect(plus(0.1, 0.2)).toBe(0.3);
	});
});
