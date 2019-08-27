import { IMatrixFunc } from './exec';
import { toFixed } from '../math/tofixed';
import { simplify } from './simplify';
import { DEFAULT_SIZE_DIGIT, DEFAULT_MATRIX_DIGIT, DEFAULT_ACCURATE_DIGIT } from '../config/config';
import { matrixEPos } from '../const';

// 降低 transform 函数的参数精度，移除冗余参数，并对无效函数打上标记
export const shorten = (m: IMatrixFunc, digit1: number = DEFAULT_MATRIX_DIGIT, digit2: number = DEFAULT_SIZE_DIGIT, digit3: number = DEFAULT_ACCURATE_DIGIT): IMatrixFunc => {
	const res: IMatrixFunc = {
		type: m.type,
		val: []
	};

	switch (m.type) {
		case 'translate':
			m.val.forEach((v, i) => {
				res.val[i] = toFixed(digit2, v);
			});
			if (res.val[1] === 0 || res.val[1] === -0) {
				res.val.length = 1;
			}
			if (res.val[0] === 0 || res.val[0] === -0) {
				res.val[0] = 0;
				if (res.val.length === 1) {
					res.noEffect = true;
				}
			}
			break;

		case 'scale':
			m.val.forEach((v, i) => {
				res.val[i] = toFixed(digit1, v);
			});
			if (res.val[0] === res.val[1]) {
				res.val.length = 1;
			}
			if (res.val[0] === 1 && res.val.length === 1) {
				res.noEffect = true;
			}
			break;

		case 'rotate':
		case 'skewX':
		case 'skewY':
			res.val[0] = toFixed(digit3, m.val[0]);
			if (res.val[0] === 0 || res.val[0] === -0) {
				res.val[0] = 0;
				res.noEffect = true;
			}
			break;

		default:
			const _res = simplify(m, digit1, digit2, digit3);
			if (_res.type === 'matrix') {
				_res.val.forEach((v, i) => {
					res.val[i] = toFixed((i < matrixEPos) ? digit1 : digit2, v);
				});
				break;
			} else {
				return shorten(_res, digit1, digit2, digit3);
			}
	}
	return res;
};
