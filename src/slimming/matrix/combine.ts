import { IMatrixFunc } from '../../../typings';
import { DEFAULT_ACCURATE_DIGIT, DEFAULT_MATRIX_DIGIT, DEFAULT_SIZE_DIGIT } from '../const';
import { Matrix } from './matrix';
import { shorten } from './shorten';

export const combineMatrix = (operate: IMatrixFunc[], digit1: number = DEFAULT_MATRIX_DIGIT, digit2: number = DEFAULT_SIZE_DIGIT, digit3: number = DEFAULT_ACCURATE_DIGIT): IMatrixFunc => {
	let matrix = new Matrix();
	for (const item of operate) {
		switch (item.type) {
			case 'translate':
				matrix = matrix.translate(item.val[0], item.val[1]);
				break;
			case 'rotate':
				if (item.val.length === 3) {
					matrix = matrix.translate(item.val[1], item.val[2]);
					matrix = matrix.rotate(item.val[0]);
					matrix = matrix.translate(-item.val[1], -item.val[2]);
				} else {
					matrix = matrix.rotate(item.val[0]);
				}
				break;
			case 'scale':
				matrix = matrix.scale(item.val[0], ...item.val.slice(1));
				break;
			case 'skewX':
				matrix = matrix.skewX(item.val[0]);
				break;
			case 'skewY':
				matrix = matrix.skewY(item.val[0]);
				break;
			default:
				matrix = matrix.multiply(new Matrix(...item.val));
				break;
		}
	}
	return shorten({
		type: 'matrix',
		val: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f],
	}, digit1, digit2, digit3);
};
