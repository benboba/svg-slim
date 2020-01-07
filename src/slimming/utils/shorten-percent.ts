import { toFixed } from '../math/tofixed';
import { shortenPureDecimal } from './shorten-pure-decimal';
import { toPercent } from '../math/to-percent';

// 此工具函数用于优化同时可以用小数和百分比表示，并且二者可以互转的值，例如颜色的 alpha 值
// 小于 0.1 的 alpha 值，用百分比表示更短
const PERCENT_THRESHOLD = 0.1;
export const shortenPercent = (digit: number, s: number) => shortenPureDecimal((s < PERCENT_THRESHOLD && s !== 0) ?  toPercent(digit, s) : `${toFixed(digit, s)}`);
