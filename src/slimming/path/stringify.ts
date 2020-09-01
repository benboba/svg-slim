import { IPathResultItem } from '../../../typings';
import { DEFAULT_ACCURATE_DIGIT, DEFAULT_SIZE_DIGIT } from '../const';
import { shortenNumberList } from '../utils/shorten-number-list';
import { stringifyFuncVal } from '../utils/stringify-funcval';
import { shortenDigit } from './shorten-digit';
import { stringifyArc } from './stringify-arc';

// 路径字符串化
export const stringifyPath = (pathResult: IPathResultItem[][], digit1: number = DEFAULT_SIZE_DIGIT, digit2: number = DEFAULT_ACCURATE_DIGIT) => {
	let d = '';
	let lastType = '';
	for (const subPath of pathResult) {
		for (const pathItem of subPath) {
			const stringifyFunc = pathItem.type === 'a' || pathItem.type === 'A' ? stringifyArc : stringifyFuncVal;
			if (
				// 注意：连续的 m 指令不能进行合并
				(pathItem.type === lastType && lastType.toLowerCase() !== 'm')
				||
				// 字符串化的时候，紧跟 m 指令的 l 指令，且大小写一致，可以直接向前合并
				(pathItem.type === 'l' && lastType === 'm')
				||
				(pathItem.type === 'L' && lastType === 'M')
			) {
				d = shortenNumberList(`${d},${stringifyFunc(shortenDigit(pathItem, digit1, digit2))}`);
			} else {
				lastType = pathItem.type;
				d += `${pathItem.type}${stringifyFunc(shortenDigit(pathItem, digit1, digit2))}`;
			}
		}
	}
	return d;
};
