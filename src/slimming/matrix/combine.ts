import { toFixed } from '../math/tofixed';
import { execMatrix, IMatrixFunc } from './exec';
import { Matrix } from './matrix';

const POS_A = 0;
const POS_B = 1;
const POS_C = 2;
const POS_D = 3;
const POS_E = 4;
const POS_F = 5;

export function combineMatrix(m: string, digit1: number, digit2: number): string {
	let matrix = new Matrix();
	const operate: IMatrixFunc[] = execMatrix(m);
	for (const item of operate) {
		if (matrix[item.type]) {
			matrix = matrix[item.type].apply(matrix, item.val);
		} else if (item.type === 'matrix') {
			const ex_matrix = new Matrix(item.val[POS_A], item.val[POS_B], item.val[POS_C], item.val[POS_D], item.val[POS_E], item.val[POS_F]);
			matrix = matrix.multiply(ex_matrix);
		} else { // 遇到非法的函数名称，则认为无法执行矩阵混合，直接返回单位矩阵
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