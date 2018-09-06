import { IMatrixFunc } from './exec';
import { Matrix } from './matrix';

export function combineMatrix(operate: IMatrixFunc[]): IMatrixFunc {
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
				const ex_matrix = new Matrix(...item.val);
				matrix = matrix.multiply(ex_matrix);
				break;
			default:
				return {
					type: 'matrix',
					val: [1, 0, 0, 1, 0, 0],
					noEffect: true
				};
		}
	}
	return {
		type: 'matrix',
		val: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]
	};
}