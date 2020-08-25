const chai = require('chai');
const should = chai.should();
import { combineMatrix } from '../../../src/slimming/matrix/combine';
import { parseMatrix } from '../../../src/slimming/matrix/parse';
import { stringify } from '../../../src/slimming/matrix/stringify';

describe('matrix/combine', () => {
	it('combine translate', () => {
		const mList = parseMatrix('translate(0, 100)translate(25,-1)    translate(3, 33) translate(10)');
		stringify([combineMatrix(mList)]).should.equal('translate(38,132)');
	});

	it('combine scale', () => {
		const mList = parseMatrix('scale(1, 2)scale(3e1)    scale(.1, .2)');
		combineMatrix(mList).should.deep.equal({
			type: 'scale',
			val: [3, 12],
		});
	});

	it('combine rotate', () => {
		const mList = parseMatrix('rotate(0)rotate(50)    rotate(-20)');
		combineMatrix(mList).should.deep.equal({
			type: 'rotate',
			val: [30],
		});
	});

	it('combine 3-value rotate', () => {
		const mList = parseMatrix('rotate(30, 20, 20)    rotate(-20, 20, 20)');
		combineMatrix(mList).should.deep.equal({
			type: 'rotate',
			val: [10, 20, 20],
		});
	});

	it('combine skewX', () => {
		const mList = parseMatrix('skewX(   0)skewX(50   )    skewX(-20)');
		combineMatrix(mList).should.deep.equal({
			type: 'skewX',
			val: [39.62],
		});
	});

	it('combine skewY', () => {
		const mList = parseMatrix(`
			 skewY(   0)skewY(50   )    skewY(-20)
			 `);
		combineMatrix(mList).should.deep.equal({
			type: 'skewY',
			val: [39.62],
		});
	});

	it('combine matrix', () => {
		const mList = parseMatrix('matrix(0.8660254037844387, 0.49999999999999994, -0.3472963553338606, 0.9541888941386711, 17.830375185938504, 22.99607783552538)  matrix(1.5, 0, 0, 1.5, 0.2, -15.35)');
		combineMatrix(mList).should.deep.equal({
			type: 'matrix',
			val: [1.299, 0.75, -0.521, 1.431, 23.33, 8.45],
		});
	});

	it('combine mix', () => {
		const mList = parseMatrix('translate(-35, 0)rotate(100) skewX(10) skewX(-10) rotate(-100) translate(35)');
		stringify([combineMatrix(mList)]).should.equal('');
	});
});
