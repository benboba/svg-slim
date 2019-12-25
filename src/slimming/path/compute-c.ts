import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { computeS } from './compute-s';
import { matchControl } from './match-control';

const canTransformS = (pathResult: IPathResultItem[], ctrlX: number, ctrlY: number, from: number[]): boolean => {
	const lastItem = pathResult[pathResult.length - 1];
	const type = lastItem.type;
	switch (type) {
		case 'C':
			return matchControl(lastItem.val[2], lastItem.val[3], from[0], from[1], ctrlX, ctrlY);
		case 'c':
			return matchControl(plus(lastItem.val[2], lastItem.from[0]), plus(lastItem.val[3], lastItem.from[1]), from[0], from[1], ctrlX, ctrlY);
		case 'S':
			return matchControl(lastItem.val[0], lastItem.val[1], from[0], from[1], ctrlX, ctrlY);
		case 's':
			return matchControl(plus(lastItem.val[0], lastItem.from[0]), plus(lastItem.val[1], lastItem.from[1]), from[0], from[1], ctrlX, ctrlY);
		default:
			// 前置不是 c/s 指令，则可以根据控制点和 from 是否重合来决定是否可以转为 s
			return ctrlX === from[0] && ctrlY === from[1];
	}
};

export const computeC = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	if (canTransformS(pathResult, absolute[0], absolute[1], pos)) {
		return computeS(absolute.slice(2), relative.slice(2), pathResult, pos);
	} else {
		// 普通情况
		const relLen = numberLength(relative);
		const absLen = numberLength(absolute);
		if (relLen === absLen) { // 如果相等则参照前一个指令
			if (pathResult[pathResult.length - 1].type === 'C') {
				pathResult.push({
					type: 'C',
					from: pos.slice(),
					val: absolute.slice(),
				});
			} else {
				pathResult.push({
					type: 'c',
					from: pos.slice(),
					val: relative.slice(),
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
		return [absolute[4], absolute[5]];
	}
};
