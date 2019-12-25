import { numberLength } from '../utils/number-length';
import { computeH } from './compute-h';
import { computeV } from './compute-v';

export const computeL = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	// 需要转为水平或垂直的情况
	// 注意，0 长度的线段不能省略，它可能也是有意义的 @by wangfeng-pd @v1.5.0
	// https://www.w3.org/TR/SVG/paths.html#ZeroLengthSegments
	if (relative[1] === 0) {
		return computeH(absolute[0], relative[0], pathResult, pos);
	} else if (relative[0] === 0) {
		return computeV(absolute[1], relative[1], pathResult, pos);
	}

	// 普通情况
	const relLen = numberLength(relative);
	const absLen = numberLength(absolute);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[pathResult.length - 1].type === 'L') {
			pathResult.push({
				type: 'L',
				from: pos.slice(),
				val: absolute.slice(),
			});
		} else {
			pathResult.push({
				type: 'l',
				from: pos.slice(),
				val: relative.slice(),
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
