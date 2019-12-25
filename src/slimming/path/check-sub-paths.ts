// tslint:disable:no-require-imports
import contours = require('svg-path-contours');
import triangle = require('triangulate-contours');
import { minus } from '../math/minus';
import { combineA, combineHV, combineL } from './combine';
import { complex } from './complex';
import { getRel } from './translate';

// 存在安全兄弟，表示当前子路径中除了自己之外，还有其它的非 m/z 指令
const hasSafeBrother = (subPath: IPathResultItem[], index: number) => {
	let left = index - 1;
	while (left > 0) {
		if (subPath[left].type.toLowerCase() === 'z') {
			left--;
		} else {
			return true;
		}
	}
	let right = index + 1;
	while (right < subPath.length) {
		if (subPath[right].type.toLowerCase() === 'z') {
			right++;
		} else {
			return true;
		}
	}
	return false;
};

// 移除 0 长度的平移指令，规则是没有 stroke-cap 或具有安全兄弟
const checkHV = (subPath: IPathResultItem[], index: number, hasStrokeCap: boolean) => {
	if (!hasStrokeCap || hasSafeBrother(subPath, index)) {
		subPath.splice(index, 1);
		return;
	}
};

// 如果控制点位于起始点和终点的连线中间位置，则 q 指令可以转 l 指令
const checkQ = (pathItem: IPathResultItem, subPath: IPathResultItem[], index: number, hasStrokeCap: boolean) => {
	const relVal = getRel(pathItem);
	const sameLine = (relVal[0] * relVal[3] === relVal[1] * relVal[2]) && (relVal[0] * relVal[2] >= 0);
	if (sameLine) {
		if (relVal.every(s => s === 0)) {
			// 控制点及指令的相对值全部为 0 ，可以直接移除
			if (!hasStrokeCap || hasSafeBrother(subPath, index)) {
				subPath.splice(index, 1);
				return;
			}
		}
		// 如果前后都不是 q/t 节点，则可以转直线指令
		if (subPath[index - 1].type.toLowerCase() !== 'q' && subPath[index - 1].type.toLowerCase() !== 't' && (index === subPath.length - 1 || subPath[index + 1].type.toLowerCase() !== 'q')) {
			pathItem.type = pathItem.type === 'q' ? 'l' : 'L';
			pathItem.val = pathItem.val.slice(2);
		}
	}
};

// 如果控制点位于起始点和终点的连线中间位置，则 c 指令可以转 l 指令
const checkC = (pathItem: IPathResultItem, subPath: IPathResultItem[], index: number, hasStrokeCap: boolean) => {
	const relVal = getRel(pathItem);
	const sameLine = (relVal[0] * relVal[5] === relVal[1] * relVal[4]) && (relVal[0] * relVal[4] >= 0) && (relVal[2] * relVal[5] === relVal[3] * relVal[4]) && (relVal[2] * relVal[4] >= 0);
	if (sameLine) {
		if (relVal.every(s => s === 0)) {
			// 控制点及指令的相对值全部为 0 ，可直接移除
			if (!hasStrokeCap || hasSafeBrother(subPath, index)) {
				subPath.splice(index, 1);
				return;
			}
		}
		// 可以直接转直线指令
		pathItem.type = pathItem.type === 'c' ? 'l' : 'L';
		pathItem.val = pathItem.val.slice(4);
	}
};

export const checkSubPath = (pathResult: IPathResultItem[][], hasStroke: boolean, hasStrokeCap: boolean, sizeDigit: number, angelDigit: number) => {
	const result: IPathResultItem[][] = [];

	// 首先过一遍子路径，移除所有的空节点
	pathResult.forEach(subPath => {
		for (let j = subPath.length; j--;) {
			const pathItem = subPath[j];
			switch (pathItem.type) {
				case 'm':
					// 所有子路径起始位置改为绝对坐标
					pathItem.type = 'M';
					pathItem.val[0] += subPath[0].from[0];
					pathItem.val[1] += subPath[0].from[1];
					break;
				case 'z':
					// 没有 cap，可以移除紧跟 m 指令的 z 指令
					if (!hasStrokeCap && subPath[j - 1].type === 'M') {
						subPath.splice(j, 1);
					}
					break;

				// 移除长度为 0 的直线指令
				case 'h':
				case 'v':
					if (pathItem.val[0] === 0) {
						checkHV(subPath, j, hasStrokeCap);
					}
					break;
				case 'H':
					if (minus(pathItem.val[0], pathItem.from[0]) === 0) {
						checkHV(subPath, j, hasStrokeCap);
					}
					break;
				case 'V':
					if (minus(pathItem.val[0], pathItem.from[1]) === 0) {
						checkHV(subPath, j, hasStrokeCap);
					}
					break;

				case 't':
				case 'T':
					// 简单指令转回复杂指令
					complex(pathItem, subPath[j - 1]);
					// 移除 0 长度指令，曲线转直线
					checkQ(pathItem, subPath, j, hasStrokeCap);
					break;
				case 'q':
				case 'Q':
					// 移除 0 长度指令，曲线转直线
					checkQ(pathItem, subPath, j, hasStrokeCap);
					break;
				case 's':
				case 'S':
					// 简单指令转复杂指令
					complex(pathItem, subPath[j - 1]);
					// 移除 0 长度指令，曲线转直线
					checkC(pathItem, subPath, j, hasStrokeCap);
					break;
				case 'c':
				case 'C':
					// 移除 0 长度指令，曲线转直线
					checkC(pathItem, subPath, j, hasStrokeCap);
					break;
				default:
					break;
			}
		}
	});

	for (let i = pathResult.length; i--;) {
		const subPath = pathResult[i];

		// 没有 stroke 直接移除空的子路径
		if (!hasStroke) {
			const shapes = triangle(contours(subPath.map(item => [item.type, ...item.val])));
			if (!shapes.cells.length) {
				continue;
			}
		}

		// 同向路径合并
		for (let j = subPath.length; j--;) {
			const pathItem = subPath[j];
			switch (pathItem.type.toLowerCase()) {
				case 'h':
				case 'v':
					combineHV(subPath, pathItem, j);
					break;
				case 'l':
					combineL(subPath, pathItem, j, angelDigit);
					break;
				case 'a':
					combineA(subPath, pathItem, j, angelDigit);
					break;
				default:
					break;
			}
		}

		// 如果没有 marker，则空的 m 指令没有意义 https://www.w3.org/TR/SVG/paths.html#ZeroLengthSegments
		// 直接移除子路径即可，因为所有子路径起始点已经改为绝对地址，所以不会有副作用
		if (subPath.length > 1) {
			result.unshift(subPath);
		}
	}
	return result;
};
