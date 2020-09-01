import { lt } from 'ramda';
import { IPathResultItem } from '../../../typings';
import { numberLength } from '../utils/number-length';

export const computeM = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	if (lt(numberLength(absolute), numberLength(relative))) {
		pathResult.push({
			type: 'M',
			from: pos.slice(),
			val: absolute.slice(),
		});
	} else {
		pathResult.push({
			type: 'm',
			from: pos.slice(),
			val: relative.slice(),
		});
	}
	return absolute.slice();
};
