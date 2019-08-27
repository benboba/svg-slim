import chai = require('chai');
const should = chai.should();
import { plus } from '../../../src/slimming/math/plus';

describe('保证精度的加法', () => {
	it('保证精度', () => {
		plus(0.1, 0.2).should.equal(0.3);
	});
});
