import { lt } from 'ramda';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

export const computeV = (absolute: number, relative: number, pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	// 如果前一个函数也是垂直移动，判断是否可以合并
	if (rLen > 0 && pathResult[rLen - 1].type.toLowerCase() === 'v') {
		const lastItem: IPathResultItem = pathResult.pop();
		// 判断的依据是：相对值的积为正数（即同向移动）
		if (lastItem.type === 'v') {
			if (lastItem.val[0] * relative >= 0) {
				return computeV(absolute, plus(relative, lastItem.val[0]), pathResult, lastItem.from);
			}
		} else {
			if ((lastItem.val[0] - lastItem.from[1]) * relative >= 0) {
				return computeV(absolute, minus(absolute, lastItem.from[1]), pathResult, lastItem.from);
			}
		}
		// 如果不符合合并条件，将前一个函数重新插入
		pathResult.push(lastItem);
	}
	// 如果确实发生了相对移动
	if (relative !== 0) {
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'v',
				from: pos.slice(),
				val: [relative]
			});
		} else {
			pathResult.push({
				type: 'V',
				from: pos.slice(),
				val: [absolute]
			});
		}
		return [pos[0], absolute];
	}
	return pos;
};