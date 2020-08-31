const chai = require('chai');
const should = chai.should();
import { doCompute } from '../../../src/slimming/path/do-compute';
import { parsePath } from '../../../src/slimming/path/parse';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-q', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(parsePath('M 100 100z Q 110 110 110 120,210,220,210,220'))).should.equal('m1e2,1e2zq10,10,10,20,1e2,1e2,1e2,1e2');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(parsePath('M100,100q-110,-50,-100,-80,-200,-200,-200,-200'))).should.equal('m1e2,1e2Q-10,50,0,20-2e2-180-2e2-180');
	});

	it('change to t', () => {
		stringifyPath(doCompute(parsePath('M0 0 Q0 100 100 100 Q 200 100 200 0 Z'))).should.equal('m0,0q0,1e2,1e2,1e2T2e2,0z');
		stringifyPath(doCompute(parsePath(`M -50 -50 t 0,0Q 50 0 50 100 100 100 150 100 150 50 150 0Z
		M -50 -50 t 0,0,50,50 Q 50 0 50 100 100 100 150 100 150 50 150 0z
		M -50 -50 t 0,0,50,0,50,50 Q 50 0 50 100 100 100 150 100 150 50 150 0z`))).should.equal('m-50-50t0,0Q50,0,50,1e2q50,0,1e2,0,0-50,0-1e2zm0,0t0,0T0,0q50,0,50,1e2,50,0,1e2,0,0-50,0-1e2zm0,0t0,0,50,0T50,0q0,0,0,1e2,50,0,1e2,0,0-50,0-1e2z');
		stringifyPath(doCompute(parsePath('M0,0T90,90T100,100Q100 150 150 150 Q 200 150 150 160 Z'))).should.equal('m0,0t90,90,10,10q0,50,50,50t0,10z');
	});

	it('coverage', () => {
		stringifyPath(doCompute(parsePath('M0 0 Q10,0,20,20T30 0 T40,10Z'))).should.equal('m0,0q10,0,20,20T30,0,40,10z');
		stringifyPath(doCompute(parsePath('M0 0 Q10,0,20,20T30 30 T45,40Z'))).should.equal('m0,0q10,0,20,20t10,10,15,10z');
	});
});
