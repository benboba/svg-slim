import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-l', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(execPath('m 0 0,0,0 M100, 100 ,110,200'))).should.equal('M100,100l10,100');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(execPath('M100,100l-50,-50'))).should.equal('M100,100L50,50');
	});

	it('change to h', () => {
		stringifyPath(doCompute(execPath('M 100 100 L200,100L150,100,50,50,55,50,59,50'))).should.equal('M100,100H200,150L50,50h9');
		stringifyPath(doCompute(execPath('M 100 100, h0,H100,L200,150,h100,-50,-50,50,0,-50'))).should.equal('M100,100l100,50H300,200h50-50');
	});

	it('change to v', () => {
		stringifyPath(doCompute(execPath('M 100 100 L100,200L100,150,50,50,50,55,50,59'))).should.equal('M100,100V200,150L50,50v9');
		stringifyPath(doCompute(execPath('M 100 100, v0,V100L150,200,v100,-50,-50,50,0,-50'))).should.equal('M100,100l50,100V300,200v50-50');
	});

	it('combine l', () => {
		stringifyPath(doCompute(execPath('M 0 0 L0,0,50,50,m0,0,l0,0,m10,10'))).should.equal('M0,0L50,50M60,60');
		stringifyPath(doCompute(execPath('M 0 0 L10,20,20,40,30,60,50,80'))).should.equal('M0,0L30,60,50,80');
		stringifyPath(doCompute(execPath('M 100 100 l1,2,1,2,1,2,2,2'))).should.equal('M100,100l3,6,2,2');
		stringifyPath(doCompute(execPath('M 80 80 l10,20,-5,-40'))).should.equal('M80,80l10,20-5-40');
	});
});
