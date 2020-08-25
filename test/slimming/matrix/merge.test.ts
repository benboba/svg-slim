const chai = require('chai');
const should = chai.should();
import { merge } from '../../../src/slimming/matrix/merge';
import { parseMatrix } from '../../../src/slimming/matrix/parse';

describe('matrix/merge', () => {
	it('merge translate', () => {
        const mList = parseMatrix('translate(0, 100)translate(25,-1)translate(15)translate(-15)');
        merge(mList[0], mList[1]).should.deep.equal({
            type: 'translate',
            val: [25, 99],
        });
        merge(mList[2], mList[3]).should.deep.equal({
            type: 'translate',
            val: [0],
            noEffect: true,
        });
    });

	it('merge scale', () => {
        const mList = parseMatrix('scale(3e1) ,   scale(.1, .2)');
        merge(mList[0], mList[1]).should.deep.equal({
            type: 'scale',
            val: [3, 6],
        });

        const mList1 = parseMatrix('scale(3, 5)    scale(1.2)');
        merge(mList1[0], mList1[1]).should.deep.equal({
            type: 'scale',
            val: [3.6, 6],
        });

        const mList2 = parseMatrix('scale(2, 0.5)    scale(.5 2)');
        merge(mList2[0], mList2[1]).should.deep.equal({
            type: 'scale',
            val: [1],
            noEffect: true,
        });
	});

	it('merge rotate', () => {
        const mList = parseMatrix('rotate(35)rotate(-5.5)');
        merge(mList[0], mList[1]).should.deep.equal({
            type: 'rotate',
            val: [29.5],
        });
	});

	it('merge 3-value rotate', () => {
		const mList1 = parseMatrix('rotate(30, 20, 20)    rotate(-20, 20, 20)');
		merge(mList1[0], mList1[1]).should.deep.equal({
			type: 'rotate',
			val: [10, 20, 20],
        });

		const mList2 = parseMatrix('rotate(30, 20, 20)    rotate(-20)');
		merge(mList2[0], mList2[1]).should.deep.equal({
			type: 'rotate',
			val: [10, 48.18, 68.8],
		});
	});

	it('merge skewX', () => {
        const mList = parseMatrix('skewX(20)skewX(-20)');
        merge(mList[0], mList[1]).should.deep.equal({
            type: 'translate',
            val: [0],
            noEffect: true,
        });
	});

	it('merge skewY', () => {
        const mList = parseMatrix('skewY(15)skewY(-20)');
        merge(mList[0], mList[1]).should.deep.equal({
            type: 'skewY',
            val: [-5.48],
        });
	});

	it('merge matrix', () => {
        const mList = parseMatrix('matrix(0.8660254037844387, 0.49999999999999994, -0.3472963553338606, 0.9541888941386711, 17.830375185938504, 22.99607783552538)  matrix(1.5, 0, 0, 1.5, 0.2, -15.35)');
        merge(mList[0], mList[1]).should.deep.equal({
            type: 'matrix',
            val: [1.299, 0.75, -0.521, 1.431, 23.33, 8.45],
        });
	});
});
