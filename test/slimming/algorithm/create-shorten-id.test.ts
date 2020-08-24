const chai = require('chai');
const should = chai.should();
import { createShortenID } from '../../../src/slimming/algorithm/create-shorten-id';

describe('短 ID 生成函数', () => {
	it('simple', () => {
		createShortenID(0).should.be.equal('a');
		createShortenID(1).should.be.equal('b');
		createShortenID(52).should.be.equal('_');
		createShortenID(0).should.be.equal('a');
	});

	it('long', () => {
		createShortenID(100).should.be.equal('aV');
		createShortenID(1000).should.be.equal('oZ');
		createShortenID(220000).should.be.equal('_2R');
	});
});
