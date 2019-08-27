import chai = require('chai');
const should = chai.should();
import { execMatrix } from '../../../src/slimming/matrix/exec';

describe('matrix/exec', () => {
	it('exec error', () => {
        const m1 = execMatrix('a(35)');
        m1.should.deep.equal([]);
        const m2 = execMatrix('translate(35);');
        m2.should.deep.equal([]);
        const m3 = execMatrix('scale(35,);');
        m3.should.deep.equal([]);
    });

	it('exec translate error', () => {
        const m1 = execMatrix('translate()');
        m1.should.deep.equal([]);
        const m2 = execMatrix('translate(3,3,3)');
        m2.should.deep.equal([]);
    });

	it('exec scale error', () => {
        const m1 = execMatrix('scale()');
        m1.should.deep.equal([]);
        const m2 = execMatrix('scale(3,3,3)');
        m2.should.deep.equal([]);
    });

	it('exec rotate error', () => {
        const m1 = execMatrix('rotate()');
        m1.should.deep.equal([]);
        const m2 = execMatrix('rotate(3,3,3)');
        m2.should.deep.equal([]);
    });

	it('exec skewX error', () => {
        const m1 = execMatrix('skewX()');
        m1.should.deep.equal([]);
        const m2 = execMatrix('skewX(3,3,3)');
        m2.should.deep.equal([]);
    });

	it('exec skewY error', () => {
        const m1 = execMatrix('skewY()');
        m1.should.deep.equal([]);
        const m2 = execMatrix('skewY(3,3,3)');
        m2.should.deep.equal([]);
    });

	it('exec matrix error', () => {
        const m1 = execMatrix('matrix()');
        m1.should.deep.equal([]);
        const m2 = execMatrix('matrix(3,3,3)');
        m2.should.deep.equal([]);
        const m3 = execMatrix('matrix(3,3,3,3,3,3,3)');
        m3.should.deep.equal([]);
    });
});
