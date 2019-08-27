import { IMatrixFunc } from './exec';
import { toFixed } from '../math/tofixed';
import { matrixEPos } from '../const';

const aPos = 0;
const bPos = 1;
const cPos = 2;
const dPos = 3;
const ePos = 4;
const fPos = 5;
const CIRC = 360;
const HALF_CIRC = 180;

// 把 matrix 函数反转为简单函数
export const simplify = (matrix: IMatrixFunc, digit1: number, digit2: number, digit3: number): IMatrixFunc => {
	const mVal = matrix.val.map((v, i) => toFixed((i < matrixEPos) ? digit1 : digit2, v)).join(',');
	const fixed1 = toFixed(digit1);
	const fixed2 = toFixed(digit2);
	const fixed3 = toFixed(digit3);

	if (/^1,0,0,1/.test(mVal)) {
		return {
			type: 'translate',
			val: fixed2(matrix.val[fPos]) === 0 ? [fixed2(matrix.val[ePos])] : [fixed2(matrix.val[ePos]), fixed2(matrix.val[fPos])]
		};
	}

	if (/^[^,]+,0,0,[^,]+,0,0/.test(mVal)) {
		return {
			type: 'scale',
			val: fixed1(matrix.val[aPos]) === fixed1(matrix.val[dPos]) ? [fixed1(matrix.val[aPos])] : [fixed1(matrix.val[aPos]), fixed1(matrix.val[dPos])]
		};
	}

	if (/^1,0,[^,]+,1,0,0/.test(mVal)) {
		let corner = (Math.atan(matrix.val[cPos]) * HALF_CIRC / Math.PI + CIRC) % CIRC;
		if (corner > CIRC - 10) {
			corner -= CIRC;
		}
		return {
			type: 'skewX',
			val: [fixed3(corner)]
		};
	}

	if (/^1,[^,]+,0,1,0,0/.test(mVal)) {
		let corner = (Math.atan(matrix.val[bPos]) * HALF_CIRC / Math.PI + CIRC) % CIRC;
		if (corner > CIRC - 10) {
			corner -= CIRC;
		}
		return {
			type: 'skewY',
			val: [fixed3(corner)]
		};
	}

	if (matrix.val[ePos] === 0 && matrix.val[fPos] === 0 && fixed1(matrix.val[aPos]) === fixed1(matrix.val[dPos]) && fixed1(matrix.val[bPos]) === -fixed1(matrix.val[cPos]) && fixed1(Math.pow(matrix.val[aPos], 2) + Math.pow(matrix.val[bPos], 2)) === 1) {
		let arc: number;
		if (matrix.val[aPos] >= 0) {
			arc = Math.asin(matrix.val[bPos]);
		} else {
			if (matrix.val[bPos] >= 0) {
				arc = Math.acos(matrix.val[aPos]);
			} else {
				arc = -Math.acos(matrix.val[aPos]);
			}
		}

		let corner = (arc * HALF_CIRC / Math.PI + CIRC) % CIRC;
		if (corner > CIRC - 10) {
			corner -= CIRC;
		}
		return {
			type: 'rotate',
			val: [fixed3(corner)]
		};
	}
	return matrix;
};
