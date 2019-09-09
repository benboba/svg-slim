import { lt } from 'ramda';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

export const computeM = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	if (rLen > 0 && pathResult[rLen - 1].type.toLowerCase() === 'm') {
		const lastItem: IPathResultItem = pathResult.pop() as IPathResultItem;
		if (lastItem.type === 'm') {
			return computeM(absolute, [plus(relative[0], lastItem.val[0]), plus(relative[1], lastItem.val[1])], pathResult, lastItem.from);
		} else {
			return computeM(absolute, [minus(absolute[0], lastItem.from[0]), minus(absolute[1], lastItem.from[1])], pathResult, lastItem.from);
		}
	} else {
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'm',
				from: pos.slice(),
				val: relative.slice(),
			});
		} else {
			pathResult.push({
				type: 'M',
				from: pos.slice(),
				val: absolute.slice(),
			});
		}
		return absolute.slice();
	}
};
