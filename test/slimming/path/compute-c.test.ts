import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-c', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(execPath('M 100 100 C 110 110 110 120 120 120'))).should.equal('M100,100c10,10,10,20,20,20');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(execPath('M100,100c-110,-50,-100,-80,-95,-95z'))).should.equal('M100,100C-10,50,0,20,5,5z');
	});

	it('change to s', () => {
		stringifyPath(doCompute(execPath('m 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z'))).should.equal('M0,0C50,0,50,100,100,100S150,50,150,0z');
		stringifyPath(doCompute(execPath('M -50 -50 S 0,0,0,0 C 50 0 50 100 100 100 150 100 150 50 150 0ZM -50 -50 s 0,0,50,50 C 50 0 50 100 100 100 150 100 150 50 150 0zM -50 -50 c 0,0,50,0,50,50 C 50 0 50 100 100 100 150 100 150 50 150 0z'))).should.equal('M-50-50S0,0,0,0C50,0,50,100,100,100S150,50,150,0zm0,0s0,0,50,50C50,0,50,100,100,100S150,50,150,0zm0,0c0,0,50,0,50,50,50,0,50,100,100,100S150,50,150,0z');
		stringifyPath(doCompute(execPath('m 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0s10,10,10,10,100,100,100,100Z'))).should.equal('M0,0C50,0,50,100,100,100S150,50,150,0s10,10,10,10,100,100,100,100z');
	});
});
