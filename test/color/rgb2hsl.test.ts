import { rgb2hsl } from '../../src/color/rgb2hsl';

describe('rgb 转 hsl', () => {
	test('覆盖率补齐', () => {
		expect(rgb2hsl({
			r: 255,
			g: 15,
			b: 25,
			a: 1,
			origin: '',
			valid: true,
		})).toEqual({
			h: 357,
			s: 100,
			l: 53,
		});
	});
});
