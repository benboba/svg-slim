import { lt } from 'ramda';

import { numberLength } from '../utils/number-length';

import { IPathResultItem } from './exec';
import { computeS } from './compute-s';
import { matchControl } from './match-control';

const CPOS_X1 = 0;
const CPOS_Y1 = 1;
const CPOS_X2 = 2;
const CPOS_X = 4;
const CPOS_Y = 5;

const canTransformS = (pathResult, rLen, x1, y1) => {
	if (rLen > 0) {
		const lastItem = pathResult[rLen - 1];
		const type = lastItem.type;
		if (type === 'C') {
			return matchControl(lastItem.val.slice(CPOS_X2), 0, 0, x1, y1);
		} else if (type === 'c') {
			return matchControl(lastItem.val.slice(CPOS_X2), lastItem.from[0], lastItem.from[1], x1, y1);
		} else if (type === 'S') {
			return matchControl(lastItem.val, 0, 0, x1, y1);
		} else if (type === 's') {
			return matchControl(lastItem.val, lastItem.from[0], lastItem.from[1], x1, y1);
		}
	}
	return false;
};

export const computeC = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]) => {
	const rLen = pathResult.length;
	if (canTransformS(pathResult, rLen, absolute[CPOS_X1], absolute[CPOS_Y1])) {
		return computeS(absolute.slice(CPOS_X2), relative.slice(CPOS_X2), pathResult, pos);
	} else {
		// 普通情况
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'c',
				from: pos.slice(),
				val: relative.slice()
			});
		} else {
			pathResult.push({
				type: 'C',
				from: pos.slice(),
				val: absolute.slice()
			});
		}
		return [absolute[CPOS_X], absolute[CPOS_Y]];
	}
};