import { equals } from 'ramda';
import { IPathResultItem } from '../../typings';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { computeT } from './compute-t';
import { matchControl } from './match-control';

const canTransformT = (pathResult: IPathResultItem[], ctrlX: number, ctrlY: number, from: number[]) => {
	const lastItem = pathResult[pathResult.length - 1];
	const type = lastItem.type;
	switch (type) {
		case 'Q':
			return matchControl(lastItem.val[0], lastItem.val[1], from[0], from[1], ctrlX, ctrlY);
		case 'q':
			return matchControl(plus(lastItem.val[0], lastItem.from[0]), plus(lastItem.val[1], lastItem.from[1]), from[0], from[1], ctrlX, ctrlY);
		case 'T':
		case 't':
			return matchControl(lastItem.from[2], lastItem.from[3], from[0], from[1], ctrlX, ctrlY);
		default:
			// 前置不是 q/t 指令，则可以根据控制点和 from 是否重合来决定是否可以转为 t
			return equals([ctrlX, ctrlY], from);
	}
};

export const computeQ = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	if (canTransformT(pathResult, absolute[0], absolute[1], pos)) {
		return computeT(absolute.slice(2), relative.slice(2), pathResult, pos);
	} else {
		// 普通情况
		const relLen = numberLength(relative);
		const absLen = numberLength(absolute);
		if (relLen === absLen) { // 如果相等则参照前一个指令
			if (pathResult[pathResult.length - 1].type === 'Q') {
				pathResult.push({
					type: 'Q',
					from: pos.slice(),
					val: absolute.slice(),
				});
			} else {
				pathResult.push({
					type: 'q',
					from: pos.slice(),
					val: relative.slice(),
				});
			}
		} else if (relLen < absLen) {
			pathResult.push({
				type: 'q',
				from: pos.slice(),
				val: relative.slice(),
			});
		} else {
			pathResult.push({
				type: 'Q',
				from: pos.slice(),
				val: absolute.slice(),
			});
		}
		return [absolute[2], absolute[3]];
	}
};
