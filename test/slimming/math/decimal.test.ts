const chai = require('chai');
const should = chai.should();
import { decimal } from '../../../src/slimming/math/decimal';


describe('以字符串的形式返回小数部分', () => {
	it('输入整数', () => {
		decimal(100).should.equal('');
	});

	it('输入小数', () => {
		decimal(0.52).should.equal('52');
	});

	it('输入字符串整数', () => {
		decimal('100').should.equal('');
	});

	it('输入字符串小数', () => {
		decimal('0.52').should.equal('52');
	});
});
