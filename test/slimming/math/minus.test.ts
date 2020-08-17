const chai = require('chai');
const should = chai.should();
import { minus } from '../../../src/slimming/math/minus';

describe('保证精度的减法', () => {
	it('保证精度', () => {
		minus(0.3, 0.1).should.equal(0.2);
	});
});
