import { doCompute } from '../../src/path/do-compute';
import { parsePath } from '../../src/path/parse';
import { stringifyPath } from '../../src/path/stringify';

describe('path/compute-l', () => {
	test('absolute to relative', () => {
		expect(stringifyPath(doCompute(parsePath('m 0 0,0,0 M100, 100 ,110,200')))).toBe('m0,0h0m1e2,1e2,10,1e2');
	});

	test('relative to absolute', () => {
		expect(stringifyPath(doCompute(parsePath('M-1,-1M99,99l-50,-50')))).toBe('m-1-1M99,99,49,49');
	});

	test('change to h', () => {
		expect(stringifyPath(doCompute(parsePath('M 100 100 L200,100L150,100,50,50,55,50,59,50')))).toBe('m1e2,1e2h1e2-50L50,50h5,4');
		expect(stringifyPath(doCompute(parsePath('M 100 100, h0,H100,L200,150,h100,-50,-50,50,0,-50')))).toBe('m1e2,1e2h0,0l1e2,50h1e2-50-50,50,0-50');
	});

	test('change to v', () => {
		expect(stringifyPath(doCompute(parsePath('M 100 100 L100,200L100,150,50,50,50,55,50,59')))).toBe('m1e2,1e2v1e2-50L50,50v5,4');
		expect(stringifyPath(doCompute(parsePath('M 100 100, v0,V100L150,200,v100,-50,-50,50,0,-50')))).toBe('m1e2,1e2v0,0l50,1e2v1e2-50-50,50,0-50');
	});
});
