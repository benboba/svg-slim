import { lt } from 'ramda';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

const POS2 = 2;
const POS3 = 3;

export const computeT = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	const from = pos.slice();
	const lastItem = pathResult[pathResult.length - 1];
	if (lastItem.type === 'T') {
		from.push(lastItem.from[POS2], lastItem.from[POS3]);
	} else if (lastItem.type === 't') {
		from.push(plus(lastItem.from[POS2], lastItem.from[0]), plus(lastItem.from[POS3], lastItem.from[1]));
	} else if (lastItem.type === 'Q') {
		from.push(lastItem.val[0], lastItem.val[1]);
	} else if (lastItem.type === 'q') {
		from.push(plus(lastItem.val[0], lastItem.from[0]), plus(lastItem.val[1], lastItem.from[1]));
	}
	if (lt(numberLength(relative), numberLength(absolute))) {
		pathResult.push({
			type: 't',
			from,
			val: relative.slice()
		});
	} else {
		pathResult.push({
			type: 'T',
			from,
			val: absolute.slice()
		});
	}
	return absolute.slice();
};