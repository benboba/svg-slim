import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-a', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(execPath('M80 80 A 45 45, 0, 00125 125A 45 45, 0, 00125.5 125.5'))).should.equal('m80,80a45,45,0,0045,45,45,45,0,00.5.5');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(execPath('M80 80 a 45 45, 0, 0, 0, -75 -75,45 45, 0, 0, 0, 10 10'))).should.equal('m80,80A45,45,0,005,5,45,45,0,0015,15');
	});
});
