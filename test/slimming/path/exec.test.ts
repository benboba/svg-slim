import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';
import { checkSubPath } from '../../../src/slimming/path/check-sub-paths';

describe('path/exec', () => {
	it('exec m error', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('m10,10,l1,1m1,1M5,5M3,3')), true, true, 2, 2))).should.equal('m10,10,1,1');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 100 100, 120L0,0')), true, true, 2, 2))).should.equal('');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('Mz')), true, true, 2, 2))).should.equal('');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M3')), true, true, 2, 2))).should.equal('');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 100 100, bL0,0')), true, true, 2, 2))).should.equal('');
	});

	it('exec z error', () => {
		stringifyPath(doCompute(execPath('z'))).should.equal('');
		stringifyPath(doCompute(execPath('M0,0l100,0,50,100z1M3,3'))).should.equal('m0,0h1e2l50,1e2z');
	});

	it('exec line error', () => {
		stringifyPath(doCompute(execPath('m0,0,l100,100,100'))).should.equal('m0,0,1e2,1e2');
		stringifyPath(doCompute(execPath('m0,0,l100'))).should.equal('m0,0');
		stringifyPath(doCompute(execPath('M0,0z1M3,3'))).should.equal('m0,0z');
	});

	it('exec curve error', () => {
		stringifyPath(doCompute(execPath('m0,0,t100,100,100'))).should.equal('m0,0t1e2,1e2');
		stringifyPath(doCompute(execPath('m0,0,q100'))).should.equal('m0,0');
		stringifyPath(doCompute(execPath('m0,0,Q1,2,3,4,5,6,7'))).should.equal('m0,0q1,2,3,4');
		stringifyPath(doCompute(execPath('m0,0,c100'))).should.equal('m0,0');
		stringifyPath(doCompute(execPath('m0,0,C1,2,3,4,5,6,7'))).should.equal('m0,0c1,2,3,4,5,6');
		stringifyPath(doCompute(execPath('M0,0a1'))).should.equal('m0,0');
		stringifyPath(doCompute(execPath('M0,0a1,2,3,4,0,6,7'))).should.equal('m0,0');
		stringifyPath(doCompute(execPath('M0,0a1,2,3,1,5,6,7'))).should.equal('m0,0');
		stringifyPath(doCompute(execPath('M0,0a1,2,3,1,0,6,7,9'))).should.equal('m0,0a1,2,3,106,7');
	});
});
