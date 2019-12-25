import { plus } from '../math/plus';
import { symmetry } from '../math/symmetry';
import { numberLength } from '../utils/number-length';

export const computeT = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	// t 类型的 from 会存储 4 个值，前 2 个为前一个指令的 absolute，后 2 个存储本指令未记录的控制点的绝对坐标
	const from = pos.slice();
	const lastItem = pathResult[pathResult.length - 1];
	switch (lastItem.type) {
		case 'T':
		case 't':
			from.push(symmetry(lastItem.from[2], from[0]), symmetry(lastItem.from[3], from[1]));
			break;
		case 'Q':
			from.push(symmetry(lastItem.val[0], from[0]), symmetry(lastItem.val[1], from[1]));
			break;
		case 'q':
			from.push(symmetry(plus(lastItem.val[0], lastItem.from[0]), from[0]), symmetry(plus(lastItem.val[1], lastItem.from[1]), from[1]));
			break;
		default:
			// 前置不是 q/t 指令，则控制点与 from 相同
			from.push(from[0], from[1]);
			break;
	}
	const relLen = numberLength(relative);
	const absLen = numberLength(absolute);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[pathResult.length - 1].type === 'T') {
			pathResult.push({
				type: 'T',
				from,
				val: absolute.slice(),
			});
		} else {
			pathResult.push({
				type: 't',
				from,
				val: relative.slice(),
			});
		}
	} else if (relLen < absLen) {
		pathResult.push({
			type: 't',
			from,
			val: relative.slice(),
		});
	} else {
		pathResult.push({
			type: 'T',
			from,
			val: absolute.slice(),
		});
	}
	return absolute.slice();
};
