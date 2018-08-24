import { toFixed } from '../math/tofixed';
import { execMatrix, IMatrixFunc } from './exec';
import { Matrix } from './matrix';

export function combineMatrix(m: string, digit1: number, digit2: number): string {
	let matrix = new Matrix();
	const operate: IMatrixFunc[] = execMatrix(m);
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
				return 'matrix(1,0,0,1,0,0)';
		}
	}
	matrix.a = toFixed(digit1, matrix.a);
	matrix.b = toFixed(digit1, matrix.b);
	matrix.c = toFixed(digit1, matrix.c);
	matrix.d = toFixed(digit1, matrix.d);
	matrix.e = toFixed(digit2, matrix.e);
	matrix.f = toFixed(digit2, matrix.f);
	return `matrix(${matrix.toString()})`;
}