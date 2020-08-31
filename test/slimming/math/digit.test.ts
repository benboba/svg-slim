const chai = require('chai');
const should = chai.should();
import { digit } from '../../../src/slimming/math/digit';

describe('返回两个小数的最大精度', () => {
	it('整数应该返回 0', () => {
		digit(100).should.equal(0);
		digit(1e23).should.equal(0);
	});

	it('小数', () => {
		digit(0.000001).should.equal(6);
		digit(0.00000001).should.equal(8);
		digit(1.00001e-7).should.equal(12);
	});

	it('异常输入', () => {
		digit(NaN).should.equal(0);
		digit(Infinity).should.equal(0);
	});
});
