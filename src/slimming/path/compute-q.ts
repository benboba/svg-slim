import { lt } from 'ramda';
import { numberLength } from '../utils/number-length';
import { computeT } from './compute-t';
import { IPathResultItem } from './exec';
import { matchControl } from './match-control';

const QPOS_X1 = 0;
const QPOS_Y1 = 1;
const QPOS_X = 2;
const QPOS_Y = 3;

const canTransformT = (pathResult, rLen, x1, y1) => {
	if (rLen > 0) {
		const lastItem = pathResult[rLen - 1];
		const type = lastItem.type;
		if (type === 'Q') {
			return matchControl(lastItem.val, 0, 0, x1, y1);
		} else if (type === 'q') {
			return matchControl(lastItem.val, lastItem.from[0], lastItem.from[1], x1, y1);
		} else if (type === 'T') {
			return matchControl(lastItem.from.slice(2).concat(lastItem.val), lastItem.from[0], lastItem.from[1], x1, y1);
		} else if (type === 't') {
			return matchControl(lastItem.from.slice(2).concat(lastItem.val), lastItem.from[0], lastItem.from[1], x1, y1);
		}
	}
	return false;
};

export const computeQ = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]) => {
	const rLen = pathResult.length;
	if (canTransformT(pathResult, rLen, absolute[QPOS_X1], absolute[QPOS_Y1])) {
		return computeT(absolute.slice(QPOS_X), relative.slice(QPOS_X), pathResult, pos);
	} else {
		// 普通情况
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'Q',
				from: pos.slice(),
				val: relative.slice()
			});
		} else {
			pathResult.push({
				type: 'q',
				from: pos.slice(),
				val: absolute.slice()
			});
		}
		return [absolute[QPOS_X], absolute[QPOS_Y]];
	}
};