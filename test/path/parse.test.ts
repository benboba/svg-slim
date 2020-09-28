import { checkSubPath } from '../../src/path/check-sub-paths';
import { doCompute } from '../../src/path/do-compute';
import { parsePath } from '../../src/path/parse';
import { stringifyPath } from '../../src/path/stringify';

describe('path/parse', () => {
	test('parse m error', () => {
		expect(stringifyPath(doCompute(checkSubPath(doCompute(parsePath('m10,10,l1,1m1,1M5,5M3,3')), true, true, 2, 2)))).toBe('m10,10,1,1');
		expect(stringifyPath(doCompute(checkSubPath(doCompute(parsePath('M 100 100, 120L0,0')), true, true, 2, 2)))).toBe('');
		expect(stringifyPath(doCompute(checkSubPath(doCompute(parsePath('Mz')), true, true, 2, 2)))).toBe('');
		expect(stringifyPath(doCompute(checkSubPath(doCompute(parsePath('M3')), true, true, 2, 2)))).toBe('');
		expect(stringifyPath(doCompute(checkSubPath(doCompute(parsePath('M 100 100, bL0,0')), true, true, 2, 2)))).toBe('');
	});

	test('parse z error', () => {
		expect(stringifyPath(doCompute(parsePath('z')))).toBe('');
		expect(stringifyPath(doCompute(parsePath('M0,0l100,0,50,100z1M3,3')))).toBe('m0,0h1e2l50,1e2z');
	});

	test('parse line error', () => {
		expect(stringifyPath(doCompute(parsePath('m0,0,l100,100,100')))).toBe('m0,0,1e2,1e2');
		expect(stringifyPath(doCompute(parsePath('m0,0,l100')))).toBe('m0,0');
		expect(stringifyPath(doCompute(parsePath('M0,0z1M3,3')))).toBe('m0,0z');
	});

	test('parse curve error', () => {
		expect(stringifyPath(doCompute(parsePath('m0,0,t100,100,100')))).toBe('m0,0t1e2,1e2');
		expect(stringifyPath(doCompute(parsePath('m0,0,q100')))).toBe('m0,0');
		expect(stringifyPath(doCompute(parsePath('m0,0,Q1,2,3,4,5,6,7')))).toBe('m0,0q1,2,3,4');
		expect(stringifyPath(doCompute(parsePath('m0,0,c100')))).toBe('m0,0');
		expect(stringifyPath(doCompute(parsePath('m0,0,C1,2,3,4,5,6,7')))).toBe('m0,0c1,2,3,4,5,6');
		expect(stringifyPath(doCompute(parsePath('M0,0a1')))).toBe('m0,0');
		expect(stringifyPath(doCompute(parsePath('M0,0a1,2,3,4,0,6,7')))).toBe('m0,0');
		expect(stringifyPath(doCompute(parsePath('M0,0a1,2,3,1,5,6,7')))).toBe('m0,0');
		expect(stringifyPath(doCompute(parsePath('M0,0a1,2,3,1,0,6,7,9')))).toBe('m0,0a1,2,3,106,7');
	});
});
