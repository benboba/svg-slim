import { Vector } from '../math/vector';
import { minus } from '../math/minus';

const check = (threshold: number, start_i: number, end_i: number, paths: number[]) => {
	let max = 0;
	let maxI = 0;
	// 拿到基础向量
	const baseVector = new Vector(minus(paths[end_i], paths[start_i]), minus(paths[end_i + 1], paths[start_i + 1]));
	for (let i = start_i + 2; i < end_i; i += 2) {
		// 拿到垂直分量
		const vector_pann = new Vector(minus(paths[i], paths[start_i]), minus(paths[i + 1], paths[start_i + 1]));
		let distance: number;
		if (vector_pann.isZero) {
			distance = 0;
		} else {
			distance = Vector.plumb(vector_pann, baseVector).modulo;
		}
		if (distance > max) {
			max = distance;
			maxI = i;
		}
	}
	if (max <= threshold) {
		paths.splice(start_i + 2, end_i - start_i - 2);
	} else {
		if (maxI < end_i - 2) {
			check(threshold, maxI, end_i, paths);
		}
		if (maxI > start_i + 2) {
			check(threshold, start_i, maxI, paths);
		}
	}
};

export const douglasPeucker = (threshold: number, pathArr: number[]) => {
	check(threshold, 0, pathArr.length - 2, pathArr);
	return pathArr;
};
