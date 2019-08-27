import chai = require('chai');
const should = chai.should();
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';
import { stringifyPath } from '../../../src/slimming/path/stringify';

describe('path/compute-a', () => {
	it('absolute to relative', () => {
		stringifyPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125A 45 45, 0, 0, 0, 55 55'))).should.equal('M80,80a45,45,0,0,0,45,45,45,45,0,0,0-70-70');
	});

	it('relative to absolute', () => {
		stringifyPath(doCompute(execPath('M80 80 a 45 45, 0, 0, 0, -75 -75,45 45, 0, 0, 0, 10 10'))).should.equal('M80,80A45,45,0,0,0,5,5,45,45,0,0,0,15,15');
	});

	it('combine normal', () => {
		stringifyPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80'))).should.equal('M80,80a45,45,0,1,0,45-45,45,45,0,0,0-45,45');
		stringifyPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125 35 35, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80'))).should.equal('M80,80a45,45,0,0,0,45,45,35,35,0,0,0,45-45,45,45,0,0,0-90,0');
		stringifyPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 1, 0, 155 80 45 45, 0, 1, 0, 125 35 45 45, 0, 1, 0, 80 80'))).should.equal('M80,80a45,45,0,0,0,45,45,45,45,0,1,0,30-45,45,45,0,1,0-30-45,45,45,0,1,0-45,45');
		stringifyPath(doCompute(execPath('M3 4 A 5 5, 0, 1, 1, 3 -4 5 5, 0, 0, 1, 5, 0'))).should.equal('M3,4A5,5,0,1,1,5,0');
		stringifyPath(doCompute(execPath('M3 4 A 5 5, 0, 0, 0, 5, 0 5 5, 0, 1, 0, -3, 4'))).should.equal('M3,4A5,5,0,1,0-3,4');
	});

	it('combine rx ry', () => {
		stringifyPath(doCompute(execPath('M6 4 A 10 5, 0, 1, 1, 6 -4 10 5, 0, 0, 1, 10, 0'))).should.equal('M6,4a10,5,0,1,1,4-4');
	});

	it('combine rotation', () => {
		stringifyPath(doCompute(execPath('M80 80 A 45 45, 90, 0, 0, 125 125 45 45, 90, 0, 0, 170 80 45 45, 90, 0, 0, 125 35 45 45, 90, 0, 0, 80 80'))).should.equal('M80,80a45,45,90,1,0,45-45,45,45,90,0,0-45,45');
	});

	it('combine rx ry rotation', () => {
		stringifyPath(doCompute(execPath('M6 4 A 5 10, 90, 1, 1, 6 -4 5 10, 90, 0, 1, 10, 0'))).should.equal('M6,4a5,10,90,1,1,4-4');
	});
});
