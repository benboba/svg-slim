import { Vector } from '../math/vector';
import { minus } from '../math/minus';

const check = (threshold: number, startI: number, endI: number, paths: number[]) => {
	let max = 0;
	let maxI = 0;
	// 拿到基础向量
	const baseVector = new Vector(minus(paths[endI], paths[startI]), minus(paths[endI + 1], paths[startI + 1]));
	for (let i = startI + 2; i < endI; i += 2) {
		// 获取每个点基于起始和结束位置的向量
		const vectorToStart = new Vector(minus(paths[i], paths[startI]), minus(paths[i + 1], paths[startI + 1]));
		const vectorToEnd = new Vector(minus(paths[i], paths[endI]), minus(paths[i + 1], paths[endI + 1]));
		let distance = 0;
		// 与起始或结束点重合的点直接跳过
		if (!vectorToStart.isZero && !vectorToEnd.isZero) {
			// 边界情况：投影分量的模大于基础向量，说明途径点在起始点或结束点之外，不能单纯靠垂直分量来抽稀
			const prjToStart = Vector.projected(vectorToStart, baseVector);
			const prjToEnd = Vector.projected(vectorToEnd, baseVector);
			if (prjToStart.modulo > baseVector.modulo) {
				distance = prjToStart.modulo;
			} else if (prjToEnd.modulo > baseVector.modulo) {
				distance = prjToEnd.modulo;
			} else {
				distance = Vector.plumb(vectorToStart, baseVector).modulo;
			}
			if (distance > max) {
				max = distance;
				maxI = i;
			}
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
	const pathCopy = pathArr.slice();
	check(threshold, 0, pathCopy.length - 2, pathCopy);
	return pathCopy;
};
