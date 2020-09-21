import { doCompute } from '../../src/path/do-compute';
import { parsePath } from '../../src/path/parse';
import { stringifyPath } from '../../src/path/stringify';

describe('path/compute-a', () => {
	test('absolute to relative', () => {
		expect(stringifyPath(doCompute(parsePath('M80 80 A 45 45, 0, 00125 125A 45 45, 0, 00125.5 125.5')))).toBe('m80,80a45,45,0,0045,45,45,45,0,00.5.5');
	});

	test('relative to absolute', () => {
		expect(stringifyPath(doCompute(parsePath('M80 80 a 45 45, 0, 0, 0, -75 -75,45 45, 0, 0, 0, 10 10')))).toBe('m80,80A45,45,0,005,5,45,45,0,0015,15');
	});

	test('arc to line', () => {
		expect(stringifyPath(doCompute(parsePath('M80 80 a 45 0, 0, 0, 0, 10 10')))).toBe('m80,80,10,10');
		expect(stringifyPath(doCompute(parsePath('M80 80 a 0 45, 0, 0, 0, 10 10')))).toBe('m80,80,10,10');
		expect(stringifyPath(doCompute(parsePath('M80 80 A 45 45, 0, 0, 0, 80 80')))).toBe('m80,80h0');
	});

	test('negative r', () => {
		expect(stringifyPath(doCompute(parsePath('M80 80 A -45 -45, 0, 0, 0, 0 0')))).toBe('m80,80A45,45,0,000,0');
	});
});
