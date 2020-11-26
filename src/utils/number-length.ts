import { shortenNumberList } from './shorten-number-list';
import { shortenNumber } from './shorten-number';
export const numberLength = (num: number[]) => shortenNumberList(num.map(shortenNumber).join(',')).length;
