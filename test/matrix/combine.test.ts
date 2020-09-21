import { combineMatrix } from '../../src/matrix/combine';
import { parseMatrix } from '../../src/matrix/parse';
import { stringify } from '../../src/matrix/stringify';

describe('matrix/combine', () => {
	test('combine translate', () => {
		const mList = parseMatrix('translate(0, 100)translate(25,-1)    translate(3, 33) translate(10)');
		expect(stringify([combineMatrix(mList)])).toBe('translate(38,132)');
	});

	test('combine scale', () => {
		const mList = parseMatrix('scale(1, 2)scale(3e1)    scale(.1, .2)');
		expect(combineMatrix(mList)).toEqual({
			type: 'scale',
			val: [3, 12],
		});
	});

	test('combine rotate', () => {
		const mList = parseMatrix('rotate(0)rotate(50)    rotate(-20)');
		expect(combineMatrix(mList)).toEqual({
			type: 'rotate',
			val: [30],
		});
	});

	test('combine 3-value rotate', () => {
		const mList = parseMatrix('rotate(30, 20, 20)    rotate(-20, 20, 20)');
		expect(combineMatrix(mList)).toEqual({
			type: 'rotate',
			val: [10, 20, 20],
		});
	});

	test('combine skewX', () => {
		const mList = parseMatrix('skewX(   0)skewX(50   )    skewX(-20)');
		expect(combineMatrix(mList)).toEqual({
			type: 'skewX',
			val: [39.62],
		});
	});

	test('combine skewY', () => {
		const mList = parseMatrix(`
			 skewY(   0)skewY(50   )    skewY(-20)
			 `);
		expect(combineMatrix(mList)).toEqual({
			type: 'skewY',
			val: [39.62],
		});
	});

	test('combine matrix', () => {
		const mList = parseMatrix('matrix(0.8660254037844387, 0.49999999999999994, -0.3472963553338606, 0.9541888941386711, 17.830375185938504, 22.99607783552538)  matrix(1.5, 0, 0, 1.5, 0.2, -15.35)');
		expect(combineMatrix(mList)).toEqual({
			type: 'matrix',
			val: [1.299, 0.75, -0.521, 1.431, 23.33, 8.45],
		});
	});

	test('combine mix', () => {
		const mList = parseMatrix('translate(-35, 0)rotate(100) skewX(10) skewX(-10) rotate(-100) translate(35)');
		expect(stringify([combineMatrix(mList)])).toBe('');
	});
});
