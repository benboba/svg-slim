import { lt } from 'ramda';
import { numberLength } from '../utils/number-length';

import { plus } from '../math/plus';
import { minus } from '../math/minus';

import { IPathResultItem } from './exec';

export const computeV = (absolute: number, relative: number, pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	if (rLen > 0 && pathResult[rLen - 1].type.toLowerCase() === 'v') {
		const lastItem: IPathResultItem = pathResult.pop();
		if (lastItem.type === 'v') {
			return computeV(absolute, plus(relative, lastItem.val[0]), pathResult, lastItem.from);
		} else {
			return computeV(absolute, minus(absolute, lastItem.from[1]), pathResult, lastItem.from);
		}
	} else if (relative !== 0) {
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'v',
				from: pos.slice(),
				val: [relative]
			});
		} else {
			pathResult.push({
				type: 'V',
				from: pos.slice(),
				val: [absolute]
			});
		}
		return [pos[0], absolute];
	}
	return pos;
};