import { IPathResultItem } from '../../typings';
import { numberLength } from '../utils/number-length';

export const SPOS_X2 = 0;
export const SPOS_Y2 = 1;
export const SPOS_X = 2;
export const SPOS_Y = 3;

export const computeS = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	const relLen = numberLength(relative);
	const absLen = numberLength(absolute);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[pathResult.length - 1].type === 'S') {
			pathResult.push({
				type: 'S',
				from: pos.slice(),
				val: absolute.slice(),
			});
		} else {
			pathResult.push({
				type: 's',
				from: pos.slice(),
				val: relative.slice(),
			});
		}
	} else if (relLen < absLen) {
		pathResult.push({
			type: 's',
			from: pos.slice(),
			val: relative.slice(),
		});
	} else {
		pathResult.push({
			type: 'S',
			from: pos.slice(),
			val: absolute.slice(),
		});
	}
	return [absolute[SPOS_X], absolute[SPOS_Y]];
};
