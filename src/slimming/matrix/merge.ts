import { IMatrixFunc } from './exec';
import { combineMatrix } from './combine';
import { shorten } from './shorten';
import { DEFAULT_ACCURATE_DIGIT, DEFAULT_MATRIX_DIGIT, DEFAULT_SIZE_DIGIT } from '../config/config';

export const merge = (func1: IMatrixFunc, func2: IMatrixFunc, digit1: number = DEFAULT_MATRIX_DIGIT, digit2: number = DEFAULT_SIZE_DIGIT, digit3: number = DEFAULT_ACCURATE_DIGIT): IMatrixFunc => {
	let resFunc: IMatrixFunc = {
		type: func1.type,
		val: [],
	};
	switch (func1.type) {
		case 'translate':
			if (func1.val.length === 1) {
				func1.val[1] = 0;
			}
			if (func2.val.length === 1) {
				func2.val[1] = 0;
			}
			resFunc.val = [func1.val[0] + func2.val[0], func1.val[1] + func2.val[1]];
			break;

		case 'scale':
			if (func1.val.length === 1) {
				func1.val[1] = func1.val[0];
			}
			if (func2.val.length === 1) {
				func2.val[1] = func2.val[0];
			}
			resFunc.val = [func1.val[0] * func2.val[0], func1.val[1] * func2.val[1]];
			break;

		case 'rotate':
			resFunc.val[0] = func1.val[0] + func2.val[0];
			break;

		case 'skewX':
		case 'skewY':
			resFunc = combineMatrix([func1, func2], digit1, digit2, digit3);
			break;

		default:
			return combineMatrix([func1, func2], digit1, digit2, digit3);
	}
	return shorten(resFunc, digit1, digit2, digit3);
};
