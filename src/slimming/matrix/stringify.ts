import { IMatrixFunc } from 'typings';
import { DEFAULT_ACCURATE_DIGIT, DEFAULT_MATRIX_DIGIT, DEFAULT_SIZE_DIGIT } from '../const';
import { stringifyFuncVal } from '../utils/stringify-funcval';
import { shorten } from './shorten';

export const stringify = (m: IMatrixFunc[], digit1: number = DEFAULT_MATRIX_DIGIT, digit2: number = DEFAULT_SIZE_DIGIT, digit3: number = DEFAULT_ACCURATE_DIGIT): string => {
	let result = '';
	m.forEach(v => {
		const _v = shorten(v, digit1, digit2, digit3);
		if (!_v.noEffect) {
			result += `${_v.type}(${stringifyFuncVal(_v.val)})`;
		}
	});
	return result;
};
