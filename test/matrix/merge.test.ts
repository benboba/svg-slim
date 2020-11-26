import { merge } from '../../src/matrix/merge';
import { parseMatrix } from '../../src/matrix/parse';

describe('matrix/merge', () => {
	test('merge translate', () => {
		const mList = parseMatrix('translate(0, 100)translate(25,-1)translate(15)translate(-15)');
		expect(merge(mList[0], mList[1])).toEqual({
			type: 'translate',
			val: [25, 99],
		});
		expect(merge(mList[2], mList[3])).toEqual({
			type: 'translate',
			val: [0],
			noEffect: true,
		});
	});

	test('merge scale', () => {
		const mList = parseMatrix('scale(3e1) ,   scale(.1, .2)');
		expect(merge(mList[0], mList[1])).toEqual({
			type: 'scale',
			val: [3, 6],
		});

		const mList1 = parseMatrix('scale(3, 5)    scale(1.2)');
		expect(merge(mList1[0], mList1[1])).toEqual({
			type: 'scale',
			val: [3.6, 6],
		});

		const mList2 = parseMatrix('scale(2, 0.5)    scale(.5 2)');
		expect(merge(mList2[0], mList2[1])).toEqual({
			type: 'scale',
			val: [1],
			noEffect: true,
		});
	});

	test('merge rotate', () => {
		const mList = parseMatrix('rotate(35)rotate(-5.5)');
		expect(merge(mList[0], mList[1])).toEqual({
			type: 'rotate',
			val: [29.5],
		});
	});

	test('merge 3-value rotate', () => {
		const mList1 = parseMatrix('rotate(30, 20, 20)    rotate(-20, 20, 20)');
		expect(merge(mList1[0], mList1[1])).toEqual({
			type: 'rotate',
			val: [10, 20, 20],
		});

		const mList2 = parseMatrix('rotate(30, 20, 20)    rotate(-20)');
		expect(merge(mList2[0], mList2[1])).toEqual({
			type: 'rotate',
			val: [10, 48.18, 68.8],
		});
	});

	test('merge skewX', () => {
		const mList = parseMatrix('skewX(20)skewX(-20)');
		expect(merge(mList[0], mList[1])).toEqual({
			type: 'translate',
			val: [0],
			noEffect: true,
		});
	});

	test('merge skewY', () => {
		const mList = parseMatrix('skewY(15)skewY(-20)');
		expect(merge(mList[0], mList[1])).toEqual({
			type: 'skewY',
			val: [-5.48],
		});
	});

	test('merge matrix', () => {
		const mList = parseMatrix('matrix(0.8660254037844387, 0.49999999999999994, -0.3472963553338606, 0.9541888941386711, 17.830375185938504, 22.99607783552538)  matrix(1.5, 0, 0, 1.5, 0.2, -15.35)');
		expect(merge(mList[0], mList[1])).toEqual({
			type: 'matrix',
			val: [1.299, 0.75, -0.521, 1.431, 23.33, 8.45],
		});
	});
});
