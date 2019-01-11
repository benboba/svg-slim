import { lt } from 'ramda';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

export const computeT = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	const from = pos.slice();
	const lastItem = pathResult[pathResult.length - 1];
	switch (lastItem.type) {
		case 'T':
			from.push(lastItem.from[2], lastItem.from[3]);
			break;
		case 't':
			from.push(plus(lastItem.from[2], lastItem.from[0]), plus(lastItem.from[3], lastItem.from[1]));
			break;
		case 'Q':
			from.push(lastItem.val[0], lastItem.val[1]);
			break;
		case 'q':
			from.push(plus(lastItem.val[0], lastItem.from[0]), plus(lastItem.val[1], lastItem.from[1]));
			break;
		default:
			break;
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
