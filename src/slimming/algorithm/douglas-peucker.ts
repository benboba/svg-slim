import { Vector } from '../math/vector';
import { minus } from '../math/minus';

const check = (threshold: number, startI: number, endI: number, paths: number[]) => {
	let max = 0;
	let maxI = 0;
	// 拿到基础向量
	const baseVector = new Vector(minus(paths[endI], paths[startI]), minus(paths[endI + 1], paths[startI + 1]));
	for (let i = startI + 2; i < endI; i += 2) {
		// 拿到垂直分量
		const vectorPann = new Vector(minus(paths[i], paths[startI]), minus(paths[i + 1], paths[startI + 1]));
		const distance: number = vectorPann.isZero ? 0 : Vector.plumb(vectorPann, baseVector).modulo;
		if (distance > max) {
			max = distance;
			maxI = i;
		}
	}
	if (max <= threshold) {
		paths.splice(startI + 2, endI - startI - 2);
	} else {
		if (maxI < endI - 2) {
			check(threshold, maxI, endI, paths);
		}
		if (maxI > startI + 2) {
			check(threshold, startI, maxI, paths);
		}
	}
};

export const douglasPeucker = (threshold: number, pathArr: number[]) => {
	check(threshold, 0, pathArr.length - 2, pathArr);
	return pathArr;
};
