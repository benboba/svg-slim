const chai = require('chai');
const should = chai.should();
import { doCompute } from '../../src/path/do-compute';
import { parsePath } from '../../src/path/parse';
import { stringifyPath } from '../../src/path/stringify';

describe('path/compute-l', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(parsePath('m 0 0,0,0 M100, 100 ,110,200'))).should.equal('m0,0h0m1e2,1e2,10,1e2');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(parsePath('M-1,-1M99,99l-50,-50'))).should.equal('m-1-1M99,99,49,49');
	});

	it('change to h', () => {
		stringifyPath(doCompute(parsePath('M 100 100 L200,100L150,100,50,50,55,50,59,50'))).should.equal('m1e2,1e2h1e2-50L50,50h5,4');
		stringifyPath(doCompute(parsePath('M 100 100, h0,H100,L200,150,h100,-50,-50,50,0,-50'))).should.equal('m1e2,1e2h0,0l1e2,50h1e2-50-50,50,0-50');
	});

	it('change to v', () => {
		stringifyPath(doCompute(parsePath('M 100 100 L100,200L100,150,50,50,50,55,50,59'))).should.equal('m1e2,1e2v1e2-50L50,50v5,4');
		stringifyPath(doCompute(parsePath('M 100 100, v0,V100L150,200,v100,-50,-50,50,0,-50'))).should.equal('m1e2,1e2v0,0l50,1e2v1e2-50-50,50,0-50');
	});
});
