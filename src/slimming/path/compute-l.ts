import { lt } from 'ramda';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { computeH } from './compute-h';
import { computeV } from './compute-v';
import { IPathResultItem } from './exec';

export const computeL = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	if (relative[0] === 0 || relative[1] === 0) {
		// 需要转为水平或垂直的情况
		if (relative[0] !== 0) {
			return computeH(absolute[0], relative[0], pathResult, pos);
		} else if (relative[1] !== 0) {
			return computeV(absolute[1], relative[1], pathResult, pos);
		} else {
			return pos;
		}
	} else if (rLen > 0 && pathResult[rLen - 1].type.toLowerCase() === 'l') {
		// 需要和前面的数据合并的情况
		const lastItem = pathResult[rLen - 1];
		if (lastItem.type === 'l') {
			const rel = lastItem.val.slice().concat(relative);
			const abs: number[] = [];
			for (let i = 0, l = rel.length; i < l; i += 2) {
				if (i === 0) {
					abs[0] = plus(lastItem.from[0], rel[0]);
					abs[1] = plus(lastItem.from[1], rel[1]);
				} else {
					abs[i] = plus(abs[i - 2], rel[i]);
					abs[i + 1] = plus(abs[i - 1], rel[i + 1]);
				}
			}
			if (lt(numberLength(rel), numberLength(abs))) {
				lastItem.val = rel;
			} else {
				lastItem.type = 'L';
				lastItem.val = abs;
			}
		} else {
			const abs = lastItem.val.slice().concat(absolute);
			const rel: number[] = [];
			for (let i = 0, l = abs.length; i < l; i += 2) {
				if (i === 0) {
					rel[0] = minus(abs[0], lastItem.from[0]);
					rel[1] = minus(abs[1], lastItem.from[1]);
				} else {
					rel[i] = minus(abs[i], abs[i - 2]);
					rel[i + 1] = minus(abs[i + 1], abs[i - 1]);
				}
			}
			if (lt(numberLength(rel), numberLength(abs))) {
				lastItem.type = 'l';
				lastItem.val = rel;
			} else {
				lastItem.val = abs;
			}
		}
		return absolute.slice();
	} else {
		// 普通情况
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'l',
				from: pos.slice(),
				val: relative.slice()
			});
		} else {
			pathResult.push({
				type: 'L',
				from: pos.slice(),
				val: absolute.slice()
			});
		}
		return absolute.slice();
	}
};
