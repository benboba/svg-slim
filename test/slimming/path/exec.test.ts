import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/exec', () => {
	it('exec m error', () => {
		stringifyPath(doCompute(execPath('M 100 100, 120L0,0'))).should.equal('');
		stringifyPath(doCompute(execPath('Mz'))).should.equal('');
		stringifyPath(doCompute(execPath('M 100 100, bL0,0'))).should.equal('M100,100');
	});

    it('exec z error', () => {
		stringifyPath(doCompute(execPath('z'))).should.equal('');
		stringifyPath(doCompute(execPath('M0,0l100,0,50,100z1M3,3'))).should.equal('M0,0H100l50,100z');
	});

    it('exec line error', () => {
		stringifyPath(doCompute(execPath('m0,0,l100,100,100'))).should.equal('M0,0L100,100');
		stringifyPath(doCompute(execPath('m0,0,l100'))).should.equal('M0,0');
		stringifyPath(doCompute(execPath('M0,0z1M3,3'))).should.equal('M0,0');
	});

    it('exec curve error', () => {
		stringifyPath(doCompute(execPath('m0,0,t100,100,100'))).should.equal('M0,0T100,100');
		stringifyPath(doCompute(execPath('m0,0,q100'))).should.equal('M0,0');
		stringifyPath(doCompute(execPath('m0,0,Q1,2,3,4,5,6,7'))).should.equal('M0,0Q1,2,3,4');
		stringifyPath(doCompute(execPath('m0,0,c100'))).should.equal('M0,0');
		stringifyPath(doCompute(execPath('m0,0,C1,2,3,4,5,6,7'))).should.equal('M0,0C1,2,3,4,5,6');
		stringifyPath(doCompute(execPath('M0,0a1'))).should.equal('M0,0');
		stringifyPath(doCompute(execPath('M0,0a1,2,3,4,0,6,7'))).should.equal('M0,0');
		stringifyPath(doCompute(execPath('M0,0a1,2,3,1,5,6,7'))).should.equal('M0,0');
		stringifyPath(doCompute(execPath('M0,0a1,2,3,1,0,6,7,9'))).should.equal('M0,0A1,2,3,1,0,6,7');
	});
});
