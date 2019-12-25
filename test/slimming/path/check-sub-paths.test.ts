import { checkSubPath } from '../../../src/slimming/path/check-sub-paths';
import { stringifyPath } from '../../../src/slimming/path/stringify';
import { execPath } from '../../../src/slimming/path/exec';
import { doCompute } from '../../../src/slimming/path/do-compute';

describe('path/check-sub-paths', () => {
	it('combine normal', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80')), false, false, 2, 2))).should.equal('m80,80a45,45,0,0045,45,45,45,0,10-45-45');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125 35 35, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80')), false, false, 2, 2))).should.equal('m80,80a45,45,0,0045,45,35,35,0,0045-45,45,45,0,00-90,0');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 1, 0, 155 80 45 45, 0, 1, 0, 125 35 45 45, 0, 1, 0, 80 80')), false, false, 2, 2))).should.equal('m80,80a45,45,0,0045,45,45,45,0,1030-45,45,45,0,10-30-45,45,45,0,10-45,45');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M3 4 A 5 5, 0, 1, 1, 3 -4 5 5, 0, 0, 1, 5, 0')), false, false, 2, 2))).should.equal('m3,4a5,5,0,112-4');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M3 4 A 5 5, 0, 0, 0, 5, 0 5 5, 0, 1, 0, -3, 4')), false, false, 2, 2))).should.equal('m3,4a5,5,0,10-6,0');
	});

	it('combine rx ry', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M6 4 A 10 5, 0, 1, 1, 6 -4 10 5, 0, 0, 1, 10, 0')), false, false, 2, 2))).should.equal('m6,4a10,5,0,114-4');
	});

	it('combine rotation', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M80 80 A 45 45, 90, 0, 0, 125 125 45 45, 90, 0, 0, 170 80 45 45, 90, 0, 0, 125 35 45 45, 90, 0, 0, 80 80')), false, false, 2, 2))).should.equal('m80,80a45,45,90,0045,45,45,45,90,10-45-45');
	});

	it('combine rx ry rotation', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M6 4 A 5 10, 90, 1, 1, 6 -4 5 10, 90, 0, 1, 10, 0')), false, false, 2, 2))).should.equal('m6,4a5,10,90,114-4');
	});

	it('combine l', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 L0,0,50,50,m0,0,l0,0,m10,10')), true, true, 2, 2))).should.equal('m0,0l50,50m0,0h0');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 L10,20,20,40,30,60,50,80')), false, false, 2, 2))).should.equal('m0,0,30,60,20,20');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 100 100 l1,2,1,2,1,2,2,2')), false, false, 2, 2))).should.equal('m1e2,1e2,3,6,2,2');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 80 80 l10,20,-5,-40')), false, false, 2, 2))).should.equal('m80,80,10,20-5-40');
	});
});
