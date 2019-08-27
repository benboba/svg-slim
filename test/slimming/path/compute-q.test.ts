import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-q', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(execPath('M 100 100z Q 110 110 110 120,210,220,210,220'))).should.equal('M100,100q10,10,10,20,100,100,100,100');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(execPath('M100,100q-110,-50,-100,-80,-200,-200,-200,-200'))).should.equal('M100,100Q-10,50,0,20-200-180-200-180');
	});

	it('change to t', () => {
		stringifyPath(doCompute(execPath('M0 0 Q0 100 100 100 Q 200 100 200 0 Z'))).should.equal('M0,0Q0,100,100,100T200,0z');
        stringifyPath(doCompute(execPath(`M -50 -50 t 0,0Q 50 0 50 100 100 100 150 100 150 50 150 0Z
        M -50 -50 t 0,0,50,50 Q 50 0 50 100 100 100 150 100 150 50 150 0z
        M -50 -50 t 0,0,50,0,50,50 Q 50 0 50 100 100 100 150 100 150 50 150 0z`))).should.equal('M-50-50t0,0Q50,0,50,100q50,0,100,0,0-50,0-100zm0,0t0,0T0,0Q50,0,50,100q50,0,100,0,0-50,0-100zm0,0t0,0,50,0T50,0q0,0,0,100,50,0,100,0,0-50,0-100z');
        stringifyPath(doCompute(execPath('M0,0T90,90T100,100Q100 150 150 150 Q 200 150 150 160 Z'))).should.equal('M0,0T90,90t10,10q0,50,50,50t0,10z');
	});
});
