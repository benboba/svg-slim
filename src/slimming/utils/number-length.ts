import { shortenNumberList } from './shorten-number-list';
export const numberLength = (num: number|number[]) => shortenNumberList(`${num}`).length;
