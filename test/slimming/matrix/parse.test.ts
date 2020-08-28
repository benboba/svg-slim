const chai = require('chai');
const should = chai.should();
import { parseMatrix } from '../../../src/slimming/matrix/parse';

describe('matrix/parse', () => {
	it('parse error', () => {
		const m1 = parseMatrix('a(35)');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('translate(35);');
		m2.should.deep.equal([]);
		const m3 = parseMatrix('scale(35,);');
		m3.should.deep.equal([]);
	});

	it('parse translate error', () => {
		const m1 = parseMatrix('translate()');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('translate(3,3,3)');
		m2.should.deep.equal([]);
	});

	it('parse scale error', () => {
		const m1 = parseMatrix('scale()');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('scale(3,3,3)');
		m2.should.deep.equal([]);
	});

	it('parse rotate error', () => {
		const m1 = parseMatrix('rotate()');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('rotate(3,3)');
		m2.should.deep.equal([]);
	});

	it('parse skewX error', () => {
		const m1 = parseMatrix('skewX()');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('skewX(3,3,3)');
		m2.should.deep.equal([]);
	});

	it('parse skewY error', () => {
		const m1 = parseMatrix('skewY()');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('skewY(3,3,3)');
		m2.should.deep.equal([]);
	});

	it('parse matrix error', () => {
		const m1 = parseMatrix('matrix()');
		m1.should.deep.equal([]);
		const m2 = parseMatrix('matrix(3,3,3)');
		m2.should.deep.equal([]);
		const m3 = parseMatrix('matrix(3,3,3,3,3,3,3)');
		m3.should.deep.equal([]);
	});
});
