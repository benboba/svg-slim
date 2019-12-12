import { stringifyFuncVal } from '../utils/stringify-funcval';
import { shortenDigit } from './shorten-digit';
import { DEFAULT_SIZE_DIGIT, DEFAULT_ACCURATE_DIGIT } from '../config/config';
import { shortenNumberList } from '../utils/shorten-number-list';
import { stringifyArc } from './stringify-arc';

export const stringifyPath = (pathResult: IPathResultItem[], digit1: number = DEFAULT_SIZE_DIGIT, digit2: number = DEFAULT_ACCURATE_DIGIT) => {
	let d = '';
	let lastType = '';
	pathResult.forEach(pathItem => {
		const stringifyFunc = pathItem.type === 'a' || pathItem.type === 'A' ? stringifyArc : stringifyFuncVal;
		if (pathItem.type === lastType) {
			d = shortenNumberList(`${d},${stringifyFunc(shortenDigit(pathItem, digit1, digit2))}`);
		} else {
			lastType = pathItem.type;
			d += `${lastType}${stringifyFunc(shortenDigit(pathItem, digit1, digit2))}`;
		}
	});
	return d;
};
