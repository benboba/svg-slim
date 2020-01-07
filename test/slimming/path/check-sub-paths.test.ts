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
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M6 4 A 10 5, 0, 1, 1, 6 -4 10 5, 0, 0, 1, 10, 0M0,0a5,5,0,0,0,100,0a5,5,0,0,0,100,100z')), false, false, 2, 2))).should.equal('m6,4a10,5,0,114-4M0,0a5,5,0,001e2,0,5,5,0,001e2,1e2z');
	});

	it('combine rotation', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M80 80 A 45 45, 90, 0, 0, 125 125 45 45, 90, 0, 0, 170 80 45 45, 90, 0, 0, 125 35 45 45, 90, 0, 0, 80 80')), false, false, 2, 2))).should.equal('m80,80a45,45,90,0045,45,45,45,90,10-45-45');
	});

	it('combine rx ry rotation', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M6 4 A 5 10, 90, 1, 1, 6 -4 5 10, 90, 0, 1, 10, 0')), false, false, 2, 2))).should.equal('m6,4a5,10,90,114-4');
	});

	it('combine h v', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 h10h10h10h10,10-10')), true, false, 2, 2))).should.equal('m0,0h50H40');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 200 0 H9H8H-5H5')), true, false, 2, 2))).should.equal('m2e2,0H-5,5');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 v10v10v10v10,10-10')), true, false, 2, 2))).should.equal('m0,0v50V40');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 200 V9V8V-5V5')), true, false, 2, 2))).should.equal('m0,2e2V-5,5');
	});

	it('combine l', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 L0,0,50,50,m0,0,l0,0,m10,10')), true, true, 2, 2))).should.equal('m0,0,50,50m0,0z');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 L0,0,50,50,m0,0,l0,0,m10,10')), false, false, 2, 2))).should.equal('');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0 L10,20,20,40,30,60,50,80')), false, false, 2, 2))).should.equal('m0,0,30,60,20,20');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 100 100 l1,2,1,2,1,2,2,2')), false, false, 2, 2))).should.equal('m1e2,1e2,3,6,2,2');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 80 80 l10,20,-5,-40')), false, false, 2, 2))).should.equal('m80,80,10,20-5-40');
	});

	it('check z', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0z')), false, false, 2, 2))).should.equal('');
	});

	it('check q t', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0q0 0 0 0')), false, false, 2, 2))).should.equal('');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0t 0 0zm15,0t0,0')), true, true, 2, 2))).should.equal('m0,0zm15,0z');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0t50,50z')), true, false, 2, 2))).should.equal('m0,0,50,50z');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M100 100Q15,0,0,15T30,30')), true, true, 2, 2))).should.equal('m1e2,1e2Q15,0,0,15t30,15');
	});

	it('check c s', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0s0 0 0 0')), false, false, 2, 2))).should.equal('');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0s0 0 0 0')), true, true, 2, 2))).should.equal('m0,0z');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M 0 0s15,15,30,30h10v10S2,2,1,1')), true, true, 2, 2))).should.equal('m0,0,30,30h10v10L1,1');
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M100 100C30,30,15,0,0,15S6,6,30,1')), true, true, 2, 2))).should.equal('m1e2,1e2C30,30,15,0,0,15S6,6,30,1');
	});

	it('badcase', () => {
		stringifyPath(doCompute(checkSubPath(doCompute(execPath('M10.4375937,8.12800489 C10.2596461,8.12800489 10.08519,8.06231785 9.94798427,7.92713447 C9.8179502,7.80010391 9.74486501,7.62717604 9.74486501,7.44688509 C9.74486501,7.26650122 9.8179502,7.09366626 9.94798427,6.9666357 L16.8062438,0.217733496 C16.9353578,0.0897041565 17.1108991,0.0177457213 17.2941075,0.0177457213 C17.4772215,0.0177457213 17.6528571,0.0897041565 17.7818768,0.217733496 C17.9118165,0.344740831 17.9849725,0.517691932 17.9849725,0.697959658 C17.9849725,0.878343521 17.9118165,1.05117848 17.7818768,1.17820905 L10.9234993,7.93075795 C10.7944797,8.05723105 10.6196697,8.12819071 10.4375937,8.12800489 Z')), false, false, 0, 0))).should.equal('m10.44,8.13c-.18,0-.35-.07-.49-.2-.13-.13-.2-.3-.2-.48,0-.18.07-.35.2-.48L16.81.22c.13-.13.3-.2.49-.2.18,0,.36.07.49.2.13.13.2.3.2.48,0,.18-.07.35-.2.48l-6.86,6.75c-.13.13-.3.2-.49.2z');
	});
});
