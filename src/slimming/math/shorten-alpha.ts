import { getShorter } from '../utils/get-shorter';
import { shortenPureDecimal } from '../utils/shorten-pure-decimal';
import { toPercent } from './to-percent';
import { toFixed } from './tofixed';

// 此工具函数用于优化同时可以用小数和百分比表示，并且二者可以互转的值，例如颜色的 alpha 值
export const shortenAlpha = (digit: number, s: number) => {
	const perc = shortenPureDecimal(toPercent(digit, s));
	const num = shortenPureDecimal(`${toFixed(digit, s)}`);
	return getShorter(perc, num);
};
