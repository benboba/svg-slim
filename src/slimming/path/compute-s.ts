import { lt } from 'ramda';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

export const SPOS_X2 = 0;
export const SPOS_Y2 = 1;
export const SPOS_X = 2;
export const SPOS_Y = 3;

export const computeS = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	if (lt(numberLength(relative), numberLength(absolute))) {
		pathResult.push({
			type: 's',
			from: pos.slice(),
			val: relative.slice()
		});
	} else {
		pathResult.push({
			type: 'S',
			from: pos.slice(),
			val: absolute.slice()
		});
	}
	return [absolute[SPOS_X], absolute[SPOS_Y]];
};