import { IMatrixFunc } from './exec';
import { combineMatrix } from './combine';
import { shorten } from './shorten';

export const merge = (func1: IMatrixFunc, func2: IMatrixFunc, digit1: number, digit2: number, digit3: number): IMatrixFunc => {
	const resFunc: IMatrixFunc = {
		type: func1.type,
		val: []
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
		case 'skewX':
		case 'skewY':
			resFunc.val[0] = func1.val[0] + func2.val[0];
			break;

		case 'matrix':
			return combineMatrix([func1, func2], digit1, digit2, digit3);

		default:
			break;
	}
	return shorten(resFunc, digit1, digit2, digit3);
};
