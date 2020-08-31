import { IMatrixFunc } from 'typings';
import { CIRC, HALF_CIRC, matrixEPos } from '../const';
import { toFixed } from '../math/to-fixed';

const aPos = 0;
const bPos = 1;
const cPos = 2;
const dPos = 3;
const ePos = 4;
const fPos = 5;

// 把 matrix 函数反转为简单函数
export const simplify = (matrix: IMatrixFunc, digit1: number, digit2: number): IMatrixFunc => {
	const mVal = matrix.val.map((v, i) => toFixed((i < matrixEPos) ? digit1 : digit2, v)).join(',');
	const fixed1 = toFixed(digit1);
	const fixed2 = toFixed(digit2);

	if (/^1,0,0,1/.test(mVal)) {
		return {
			type: 'translate',
			val: fixed2(matrix.val[fPos]) === 0 ? [matrix.val[ePos]] : [matrix.val[ePos], matrix.val[fPos]],
		};
	}

	if (/^[^,]+,0,0,[^,]+,0,0/.test(mVal)) {
		return {
			type: 'scale',
			val: fixed1(matrix.val[aPos]) === fixed1(matrix.val[dPos]) ? [matrix.val[aPos]] : [matrix.val[aPos], matrix.val[dPos]],
		};
	}

	if (/^1,0,[^,]+,1,0,0/.test(mVal)) {
		let corner = (Math.atan(matrix.val[cPos]) * HALF_CIRC / Math.PI + CIRC) % CIRC;
		if (corner > CIRC - 10) {
			corner -= CIRC;
		}
		return {
			type: 'skewX',
			val: [corner],
		};
	}

	if (/^1,[^,]+,0,1,0,0/.test(mVal)) {
		let corner = (Math.atan(matrix.val[bPos]) * HALF_CIRC / Math.PI + CIRC) % CIRC;
		if (corner > CIRC - 10) {
			corner -= CIRC;
		}
		return {
			type: 'skewY',
			val: [corner],
		};
	}
	if (
		fixed1(matrix.val[aPos]) === fixed1(matrix.val[dPos])
		&&
		fixed1(matrix.val[bPos]) === -fixed1(matrix.val[cPos])
		&&
		fixed1(Math.pow(matrix.val[aPos], 2) + Math.pow(matrix.val[bPos], 2)) === 1
	) {
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
		// [1,0,0,1,x,y].[a,b,c,d,0,0].[1,0,0,1,-x,-y] = [a,b,c,d,e,f]，根据该公式反解
		const cx = (matrix.val[ePos] * (1 - matrix.val[aPos]) - matrix.val[bPos] * matrix.val[fPos]) / (2 - matrix.val[aPos] * 2);
		const cy = (cx * matrix.val[bPos] + matrix.val[fPos]) / (1 - matrix.val[dPos]);
		return {
			type: 'rotate',
			val: [corner, cx, cy],
		};
	}
	return matrix;
};
