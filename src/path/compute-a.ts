import { IPathResultItem } from '../../typings';
import { APOS_RX, APOS_RY, APOS_X, APOS_Y } from '../const';
import { numberLength } from '../utils/number-length';
import { computeL } from './compute-l';

export const computeA = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	// https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
	// 起始点和目标点重合，或者有一个半径为 0，可以转直线指令
	if ((absolute[APOS_X] === pos[0] && absolute[APOS_Y] === pos[1]) || absolute[APOS_RX] === 0 || absolute[APOS_RY] === 0) {
		return computeL([absolute[APOS_X], absolute[APOS_Y]], [relative[APOS_X], relative[APOS_Y]], pathResult, pos);
	}
	// 负数半径取绝对值
	if (absolute[APOS_RX] < 0) {
		absolute[APOS_RX] = Math.abs(absolute[APOS_RX]);
	}
	if (absolute[APOS_RY] < 0) {
		absolute[APOS_RY] = Math.abs(absolute[APOS_RY]);
	}
	const rLen = pathResult.length;
	const relLen = numberLength(relative);
	const absLen = numberLength(absolute);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[rLen - 1].type === 'A') {
			pathResult.push({
				type: 'A',
				from: pos.slice(),
				val: absolute,
			});
		} else {
			pathResult.push({
				type: 'a',
				from: pos.slice(),
				val: relative,
			});
		}
	} else if (relLen < absLen) {
		pathResult.push({
			type: 'a',
			from: pos.slice(),
			val: relative,
		});
	} else {
		pathResult.push({
			type: 'A',
			from: pos.slice(),
			val: absolute,
		});
	}
	return [absolute[APOS_X], absolute[APOS_Y]];
};
