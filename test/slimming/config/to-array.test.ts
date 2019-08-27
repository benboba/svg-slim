import chai = require('chai');
const should = chai.should();
import { toArray } from '../../../src/slimming/config/to-array';

describe('config/to-array', () => {
	it('转换布尔值', () => {
		toArray(true).should.deep.equal([true]);
		toArray(false).should.deep.equal([false]);
	});

	it('数组直接返回原值', () => {
		const config = [true, 1, ['test']];
		toArray(config).should.equal(config);
	});
});
