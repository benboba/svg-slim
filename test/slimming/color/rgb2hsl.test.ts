import chai = require('chai');
const should = chai.should();
import { rgb2hsl } from '../../../src/slimming/color/rgb2hsl';

describe('rgb 转 hsl', () => {
	it('覆盖率补齐', () => {
		rgb2hsl({
			r: 255,
			g: 15,
			b: 25,
			a: 1,
			origin: '',
			valid: true,
		}).should.deep.equal({
			h: 357,
			s: 100,
			l: 53,
		});
	});
});
