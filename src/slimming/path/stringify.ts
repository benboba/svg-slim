import { IPathResultItem } from './exec';
import { stringifyFuncVal } from '../utils/stringify-funcval';
import { shortenDigit } from './shorten-digit';
import { DEFAULT_SIZE_DIGIT, DEFAULT_ACCURATE_DIGIT } from '../config/config';
import { shortenNumberList } from '../utils/shorten-number-list';

export const stringifyPath = (pathResult: IPathResultItem[], digit1: number = DEFAULT_SIZE_DIGIT, digit2: number = DEFAULT_ACCURATE_DIGIT) => {
	let d = '';
	let lastType = '';
	pathResult.forEach(pathItem => {
		if (pathItem.type === lastType) {
			d = shortenNumberList(`${d},${stringifyFuncVal(shortenDigit(pathItem, digit1, digit2))}`);
		} else {
			lastType = pathItem.type;
			d += `${lastType}${stringifyFuncVal(shortenDigit(pathItem, digit1, digit2))}`;
		}
	});
	return d;
};
