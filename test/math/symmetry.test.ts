const chai = require('chai');
const should = chai.should();
import { symmetry } from '../../src/math/symmetry';

describe('获取 a 相对于 b 的对称值', () => {
	it('输入整数', () => {
		symmetry(300, 200).should.equal(100);
		symmetry(150, 50).should.equal(-50);
		symmetry(5, 5).should.equal(5);
	});

	it('输入负数', () => {
		symmetry(-999, -2342).should.equal(-3685);
	});

	it('输入小数', () => {
		symmetry(0.3, 0.1).should.equal(-0.1);
	});
});
