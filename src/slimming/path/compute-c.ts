import { numberLength } from '../utils/number-length';
import { computeS } from './compute-s';
import { IPathResultItem } from './exec';
import { matchControl } from './match-control';

const CPOS_X1 = 0;
const CPOS_Y1 = 1;
const CPOS_X2 = 2;
const CPOS_X = 4;
const CPOS_Y = 5;

const canTransformS = (pathResult: IPathResultItem[], x1: number, y1: number): boolean => {
	const lastItem = pathResult[pathResult.length - 1];
	const type = lastItem.type;
	switch (type) {
		case 'C':
			return matchControl(lastItem.val.slice(CPOS_X2), 0, 0, x1, y1);
		case 'c':
			return matchControl(lastItem.val.slice(CPOS_X2), lastItem.from[0], lastItem.from[1], x1, y1);
		case 'S':
			return matchControl(lastItem.val, 0, 0, x1, y1);
		case 's':
			return matchControl(lastItem.val, lastItem.from[0], lastItem.from[1], x1, y1);
		default:
			return false;
	}
};

export const computeC = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	if (canTransformS(pathResult, absolute[CPOS_X1], absolute[CPOS_Y1])) {
		return computeS(absolute.slice(CPOS_X2), relative.slice(CPOS_X2), pathResult, pos);
	} else {
		// 普通情况
		const relLen = numberLength(relative);
		const absLen = numberLength(absolute);
		if (relLen === absLen) { // 如果相等则参照前一个指令
			if (pathResult[pathResult.length - 1].type === 'c') {
				pathResult.push({
					type: 'c',
					from: pos.slice(),
					val: relative.slice(),
				});
			} else {
				pathResult.push({
					type: 'C',
					from: pos.slice(),
					val: absolute.slice(),
				});
			}
		} else if (relLen < absLen) {
			pathResult.push({
				type: 'c',
				from: pos.slice(),
				val: relative.slice(),
			});
		} else {
			pathResult.push({
				type: 'C',
				from: pos.slice(),
				val: absolute.slice(),
			});
		}
		return [absolute[CPOS_X], absolute[CPOS_Y]];
	}
};
