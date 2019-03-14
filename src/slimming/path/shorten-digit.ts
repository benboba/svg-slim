import { IPathResultItem } from './exec';
import { toFixed } from '../math/tofixed';
import { APOS_LEN, APOS_X, APOS_Y, APOS_RX, APOS_RY, APOS_ROTATION } from './compute-a';

export const shortenDigit = (pathItem: IPathResultItem, digit1: number, digit2: number): number[] => {
	if (pathItem.type.toLowerCase() === 'a') {
		return pathItem.val.map((val, index) => {
			const i = index % APOS_LEN;
			switch (i) {
				case APOS_RX:
				case APOS_RY:
				case APOS_X:
				case APOS_Y:
					return toFixed(digit1, val);
				case APOS_ROTATION:
					return toFixed(digit2, val);
				default:
					return val;
			}
		});
	} else {
		return pathItem.val.map(val => toFixed(digit1, val));
	}
};
