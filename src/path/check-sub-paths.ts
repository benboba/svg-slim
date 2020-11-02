/* eslint-disable @typescript-eslint/no-var-requires */
const contours = require('svg-path-contours');
const triangle = require('triangulate-contours');
import { IPathResultItem } from '../../typings';
import { combineA, combineHV, combineL } from './combine';
import { complex } from './complex';
import { getRel } from './translate';

// 当前子路径中除了起始点和自己之外，还有其它任意指令
const hasBrother = (subPath: IPathResultItem[], index: number) => {
	return index > 1 || index < subPath.length - 1;
};

// 移除 0 长度的平移指令，规则是没有 stroke-cap 或具有兄弟，反之可以转为 z 指令
const checkHV = (subPath: IPathResultItem[], index: number, hasStrokeCap: boolean) => {
	if (!hasStrokeCap || hasBrother(subPath, index)) {
		subPath.splice(index, 1);
	} else {
		subPath[index].type = 'z';
	}
};

// 如果控制点位于起始点和终点的连线中间位置，则 q 指令可以转 l 指令
const checkQ = (pathItem: IPathResultItem, subPath: IPathResultItem[], index: number, hasStrokeCap: boolean) => {
	// 简单指令转复杂指令
	const prevItem = subPath[index - 1];
	const complexItem = complex(pathItem, prevItem);
	const relVal = getRel(complexItem);

	let sameLine = true;
	if (relVal[1] !== 0 && relVal[0] !== 0) {
		sameLine = Math.atan2(relVal[1], relVal[0]) === Math.atan2(relVal[3], relVal[2]);
	}
	const pointsIsSort = (
		(relVal[0] >= 0 === relVal[2] >= 0 || relVal[0] <= 0 === relVal[2] <= 0) && (relVal[1] >= 0 === relVal[3] >= 0 || relVal[1] <= 0 === relVal[3] <= 0) // 都在起始点的同一侧
		&&
		Math.abs(relVal[2]) >= Math.abs(relVal[0]) && Math.abs(relVal[3]) >= Math.abs(relVal[1]) // 起始点、控制点、结束点是顺序排列的
	);

	if (sameLine && pointsIsSort) {
		if (relVal.every(s => s === 0)) {
			// 控制点及指令的相对值全部为 0 ，可以视情况移除或转 z 指令
			if (!hasStrokeCap || hasBrother(subPath, index)) {
				subPath.splice(index, 1);
			} else {
				pathItem.type = 'z';
			}
			return;
		}
		// 如果前后都不是 q/t 节点，则可以转直线指令
		if (!'qt'.includes(prevItem.type.toLowerCase()) && (index === subPath.length - 1 || subPath[index + 1].type.toLowerCase() !== 't')) {
			pathItem.type = complexItem.type === 'q' ? 'l' : 'L';
			pathItem.val = complexItem.val.slice(2);
		}
	}
};

// 如果控制点位于起始点和终点的连线中间位置，则 c 指令可以转 l 指令
const checkC = (pathItem: IPathResultItem, subPath: IPathResultItem[], index: number, hasStrokeCap: boolean) => {
	const prevItem = subPath[index - 1];
	const complexItem = complex(pathItem, prevItem);
	const relVal = getRel(complexItem);

	let sameLine = true; // 都在同一条直线上
	let arc = NaN;
	for (let i = 0; i < 6; i += 2) {
		if (relVal[i] === 0 && relVal[i + 1] === 0) {
			continue;
		}
		if (isNaN(arc)) {
			arc = Math.atan2(relVal[i + 1], relVal[i]);
		} else if (arc !== Math.atan2(relVal[i + 1], relVal[i])) {
			sameLine = false;
			break;
		}
	}
	const pointsIsSort = (
		(relVal[0] >= 0 === relVal[2] >= 0 || relVal[0] <= 0 === relVal[2] <= 0) && (relVal[1] >= 0 === relVal[3] >= 0 || relVal[1] <= 0 === relVal[3] <= 0) && (relVal[2] >= 0 === relVal[4] >= 0 || relVal[2] <= 0 === relVal[4] <= 0) && (relVal[3] >= 0 === relVal[5] >= 0 || relVal[3] <= 0 === relVal[5] <= 0) // 都在起始点的同一侧
		&&
		Math.abs(relVal[2]) >= Math.abs(relVal[0]) && Math.abs(relVal[3]) >= Math.abs(relVal[1]) && Math.abs(relVal[4]) >= Math.abs(relVal[2]) && Math.abs(relVal[5]) >= Math.abs(relVal[3]) // 起始点、控制点1、控制点2、结束点是顺序排列的
	);

	if (sameLine && pointsIsSort) {
		if (relVal.every(s => s === 0)) {
			// 控制点及指令的相对值全部为 0 ，可以视情况移除或转 z 指令
			if (!hasStrokeCap || hasBrother(subPath, index)) {
				subPath.splice(index, 1);
			} else {
				pathItem.type = 'z';
			}
			return;
		}
		// 如果前后都不是 q/t 节点，则可以转直线指令
		if (!'cs'.includes(prevItem.type.toLowerCase()) && (index === subPath.length - 1 || subPath[index + 1].type.toLowerCase() !== 's')) {
			pathItem.type = complexItem.type === 'c' ? 'l' : 'L';
			pathItem.val = complexItem.val.slice(4);
		}
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
					if (!hasStrokeCap && subPath[j - 1].type.toLowerCase() === 'm') {
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

				case 't':
				case 'T':
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
			// triangle 存在 badcase，可能导致崩溃，所以必须 try
			try {
				const shapes = triangle(contours(subPath.map(item => [item.type, ...item.val])));
				if (!shapes.cells.length) {
					continue;
				}
			} catch {
				// empty
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
