const chai = require('chai');
const should = chai.should();
import { toFixed } from '../../../src/slimming/math/to-fixed';

describe('数值按精度截取', () => {
	it('异常输入', () => {
		toFixed(10, NaN).should.be.NaN;
		toFixed(10, -Infinity).should.eq(-Infinity);
	});

	it('小数', () => {
		toFixed(6, 0.00000001).should.equal(0);
		toFixed(6, 1e-8).should.equal(0);
		toFixed(10, 1e-8).should.equal(1e-8);
		toFixed(7, 1.99901e-7).should.equal(2e-7);
		toFixed(6, 1.99901e-7).should.equal(0);
		toFixed(6, 9.99901e-7).should.equal(1e-6);
	});

	it('整数', () => {
		toFixed(6, 1e23).should.equal(1e23);
	});
});
