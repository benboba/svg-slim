import { IMatrixFunc } from './exec';
import { Matrix } from './matrix';
import { shorten } from './shorten';

export function combineMatrix(operate: IMatrixFunc[], digit1: number, digit2: number, digit3: number): IMatrixFunc {
	let matrix = new Matrix();
	for (const item of operate) {
		switch (item.type) {
			case 'translate':
				matrix = matrix.translate(item.val[0], item.val[1]);
				break;
			case 'rotate':
				matrix = matrix.rotate(item.val[0]);
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
			case 'matrix':
				matrix = matrix.multiply(new Matrix(...item.val));
				break;
			default:
				return {
					type: 'matrix',
					val: [1, 0, 0, 1, 0, 0],
					noEffect: true
				};
		}
	}
	return shorten({
		type: 'matrix',
		val: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]
	}, digit1, digit2, digit3);
}
