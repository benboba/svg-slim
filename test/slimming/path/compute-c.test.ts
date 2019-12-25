import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-c', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(execPath('M 100 100 C 110 110 110 120 120 120'))).should.equal('m1e2,1e2c10,10,10,20,20,20');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(execPath('M100,100c-110,-50,-100,-80,-95,-95z'))).should.equal('m1e2,1e2C-10,50,0,20,5,5z');
	});

	it('change to s', () => {
		stringifyPath(doCompute(execPath('m 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z'))).should.equal('m0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2z');
		stringifyPath(doCompute(execPath('M -50 -50 S 0,0,0,0 C 50 0 50 100 100 100 150 100 150 50 150 0ZM -50 -50 s 0,0,50,50 C 50 0 50 100 100 100 150 100 150 50 150 0zM -50 -50 c 0,0,50,0,50,50 C 50 0 50 100 100 100 150 100 150 50 150 0z'))).should.equal('m-50-50S0,0,0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2zm0,0s0,0,50,50c50,0,50,1e2,1e2,1e2s50-50,50-1e2zm0,0S0-50,0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2z');
		stringifyPath(doCompute(execPath('m 0 0 C50 0 50 100 100 100 150 100 150 50 150 0s10,10,10,10,100,100,100,100Z'))).should.equal('m0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2,10,10,10,10,1e2,1e2,1e2,1e2z');
	});

	it('coverage', () => {
		stringifyPath(doCompute(execPath('m -100 -100 C1 0 2 2 3 0 C4 1 5 2 6 3Z'))).should.equal('m-1e2-1e2C1,0,2,2,3,0,4,1,5,2,6,3z');
		stringifyPath(doCompute(execPath('M-9 -9 c1 0 2 2 9 9 c4 1 5 2 6 3Z'))).should.equal('m-9-9c1,0,2,2,9,9,4,1,5,2,6,3z');
	});
});
