import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

export const computeH = (absolute: number, relative: number, pathResult: IPathResultItem[], pos: number[]): number[] => {
	// 如果前一个函数也是水平移动，判断是否可以合并
	if (pathResult[pathResult.length - 1].type.toLowerCase() === 'h') {
		const lastItem: IPathResultItem = pathResult.pop() as IPathResultItem;
		// 判断的依据是：相对值的积为正数（即同向移动）
		if (lastItem.type === 'h') {
			if (lastItem.val[0] * relative >= 0) {
				return computeH(absolute, plus(relative, lastItem.val[0]), pathResult, lastItem.from);
			}
		} else {
			if ((lastItem.val[0] - lastItem.from[0]) * relative >= 0) {
				return computeH(absolute, minus(absolute, lastItem.from[0]), pathResult, lastItem.from);
			}
		}
		// 如果不符合合并条件，将前一个函数重新插入
		pathResult.push(lastItem);
	}
	// 如果确实发生了相对移动
	if (relative !== 0) {
		const relLen = numberLength(relative);
		const absLen = numberLength(absolute);
		if (relLen === absLen) { // 如果相等则参照前一个指令
			if (pathResult[pathResult.length - 1].type === 'h') {
				pathResult.push({
					type: 'h',
					from: pos.slice(),
					val: [relative],
				});
			} else {
				pathResult.push({
					type: 'H',
					from: pos.slice(),
					val: [absolute],
				});
			}
		} else if (relLen < absLen) {
			pathResult.push({
				type: 'h',
				from: pos.slice(),
				val: [relative],
			});
		} else {
			pathResult.push({
				type: 'H',
				from: pos.slice(),
				val: [absolute],
			});
		}
		return [absolute, pos[1]];
	}
	return pos;
};
