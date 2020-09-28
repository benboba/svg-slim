import { doCompute } from '../../src/path/do-compute';
import { parsePath } from '../../src/path/parse';
import { stringifyPath } from '../../src/path/stringify';

describe('path/compute-c', () => {
	test('absolute to relative', () => {
		expect(stringifyPath(doCompute(parsePath('M 100 100 C 110 110 110 120 120 120')))).toBe('m1e2,1e2c10,10,10,20,20,20');
	});

	test('relative to absolute', () => {
		expect(stringifyPath(doCompute(parsePath('M100,100c-110,-50,-100,-80,-95,-95z')))).toBe('m1e2,1e2C-10,50,0,20,5,5z');
	});

	test('change to s', () => {
		expect(stringifyPath(doCompute(parsePath('m 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z')))).toBe('m0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2z');
		expect(stringifyPath(doCompute(parsePath('M -50 -50 S 0,0,0,0 C 50 0 50 100 100 100 150 100 150 50 150 0ZM -50 -50 s 0,0,50,50 C 50 0 50 100 100 100 150 100 150 50 150 0zM -50 -50 c 0,0,50,0,50,50 C 50 0 50 100 100 100 150 100 150 50 150 0z')))).toBe('m-50-50S0,0,0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2zm0,0s0,0,50,50c50,0,50,1e2,1e2,1e2s50-50,50-1e2zm0,0S0-50,0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2z');
		expect(stringifyPath(doCompute(parsePath('m 0 0 C50 0 50 100 100 100 150 100 150 50 150 0s10,10,10,10,100,100,100,100Z')))).toBe('m0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2,10,10,10,10,1e2,1e2,1e2,1e2z');
	});

	test('coverage', () => {
		expect(stringifyPath(doCompute(parsePath('m -100 -100 C1 0 2 2 3 0 C4 1 5 2 6 3Z')))).toBe('m-1e2-1e2C1,0,2,2,3,0,4,1,5,2,6,3z');
		expect(stringifyPath(doCompute(parsePath('M-9 -9 c1 0 2 2 9 9 c4 1 5 2 6 3Z')))).toBe('m-9-9c1,0,2,2,9,9,4,1,5,2,6,3z');
		expect(stringifyPath(doCompute(parsePath('m -100 -100 S1 0 2 2S5,5,4,6Z')))).toBe('m-1e2-1e2S1,0,2,2,5,5,4,6z');
	});
});
