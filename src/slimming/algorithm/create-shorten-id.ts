import { startChar, nameChar } from '../utils/shortenlist';

const startLen = startChar.length;
const nameLen = nameChar.length;

const sList = startChar.split('');
let slen = startLen;
let pi = 0;

export const createShortenID = (si: number): string => {
	while (si >= slen) {
		sList.push.apply(sList, nameChar.split('').map(s => sList[pi] + s));
		slen += nameLen;
		pi++;
	}
	return sList[si];
};
