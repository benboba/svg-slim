import { lt } from 'ramda';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

export const computeH = (absolute: number, relative: number, pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	if (rLen > 0 && pathResult[rLen - 1].type.toLowerCase() === 'h') {
		const lastItem: IPathResultItem = pathResult.pop();
		if (lastItem.type === 'h') {
			return computeH(absolute, plus(relative, lastItem.val[0]), pathResult, lastItem.from);
		} else {
			return computeH(absolute, minus(absolute, lastItem.from[0]), pathResult, lastItem.from);
		}
	} else if (relative !== 0) {
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'h',
				from: pos.slice(),
				val: [relative]
			});
		} else {
			pathResult.push({
				type: 'H',
				from: pos.slice(),
				val: [absolute]
			});
		}
		return [absolute, pos[1]];
	}
	return pos;
};