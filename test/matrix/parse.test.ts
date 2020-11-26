import { parseMatrix } from '../../src/matrix/parse';

describe('matrix/parse', () => {
	test('parse error', () => {
		const m1 = parseMatrix('a(35)');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('translate(35);');
		expect(m2).toEqual([]);
		const m3 = parseMatrix('scale(35,);');
		expect(m3).toEqual([]);
	});

	test('parse translate error', () => {
		const m1 = parseMatrix('translate()');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('translate(3,3,3)');
		expect(m2).toEqual([]);
	});

	test('parse scale error', () => {
		const m1 = parseMatrix('scale()');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('scale(3,3,3)');
		expect(m2).toEqual([]);
	});

	test('parse rotate error', () => {
		const m1 = parseMatrix('rotate()');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('rotate(3,3)');
		expect(m2).toEqual([]);
	});

	test('parse skewX error', () => {
		const m1 = parseMatrix('skewX()');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('skewX(3,3,3)');
		expect(m2).toEqual([]);
	});

	test('parse skewY error', () => {
		const m1 = parseMatrix('skewY()');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('skewY(3,3,3)');
		expect(m2).toEqual([]);
	});

	test('parse matrix error', () => {
		const m1 = parseMatrix('matrix()');
		expect(m1).toEqual([]);
		const m2 = parseMatrix('matrix(3,3,3)');
		expect(m2).toEqual([]);
		const m3 = parseMatrix('matrix(3,3,3,3,3,3,3)');
		expect(m3).toEqual([]);
	});
});
