import { numberLength } from '../utils/number-length';
import { computeH } from './compute-h';
import { computeV } from './compute-v';

const combineL = (pathResult: IPathResultItem[], relative: number[], pos: number[]) => {
	const rLen = pathResult.length;
	if (pathResult[rLen - 1].type.toLowerCase() === 'l') {
		// 同方向的直线直接合并
		const lastItem = pathResult[rLen - 1];
		if (lastItem.type === 'l') {
			if (lastItem.val[0] / lastItem.val[1] === relative[0] / relative[1] && lastItem.val[0] > 0 === relative[0] > 0 && lastItem.val[1] > 0 === relative[1] > 0) {
				relative[0] += lastItem.val[0];
				relative[1] += lastItem.val[1];
				[pos[0], pos[1]] = lastItem.from;
				pathResult.pop();
			}
		} else {
			if ((lastItem.val[0] - lastItem.from[0]) / (lastItem.val[1] - lastItem.from[1]) === relative[0] / relative[1] && (lastItem.val[0] - lastItem.from[0]) > 0 === relative[0] > 0 && (lastItem.val[1] - lastItem.from[1]) > 0 === relative[1] > 0) {
				relative[0] += lastItem.val[0] - lastItem.from[0];
				relative[1] += lastItem.val[1] - lastItem.from[1];
				[pos[0], pos[1]] = lastItem.from;
				pathResult.pop();
			}
		}
	}
};

export const computeL = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	if (relative[0] === 0 || relative[1] === 0) {
		// 需要转为水平或垂直的情况
		if (relative[0] === 0 && relative[1] === 0) {
			return pos;
		} else if (relative[0] === 0) {
			return computeV(absolute[1], relative[1], pathResult, pos);
		} else {
			return computeH(absolute[0], relative[0], pathResult, pos);
		}
	}

	combineL(pathResult, relative, pos);

	// 普通情况
	const relLen = numberLength(relative);
	const absLen = numberLength(absolute);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[pathResult.length - 1].type === 'l') {
			pathResult.push({
				type: 'l',
				from: pos.slice(),
				val: relative.slice(),
			});
		} else {
			pathResult.push({
				type: 'L',
				from: pos.slice(),
				val: absolute.slice(),
			});
		}
	} else if (relLen < absLen) {
		pathResult.push({
			type: 'l',
			from: pos.slice(),
			val: relative.slice(),
		});
	} else {
		pathResult.push({
			type: 'L',
			from: pos.slice(),
			val: absolute.slice(),
		});
	}
	return absolute.slice();
};
