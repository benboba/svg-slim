import { propEq} from 'ramda';
import { INode } from '../../node/index';
import { douglasPeucker } from '../algorithm/douglas-peucker';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { APOS_X, computeA } from '../path/compute-a';
import { computeC } from '../path/compute-c';
import { computeH } from '../path/compute-h';
import { computeL } from '../path/compute-l';
import { computeM } from '../path/compute-m';
import { computeQ } from '../path/compute-q';
import { computeS } from '../path/compute-s';
import { computeT } from '../path/compute-t';
import { computeV } from '../path/compute-v';
import { computeZ } from '../path/compute-z';
import { execPath, IPathItem, IPathResultItem } from '../path/exec';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { toScientific } from '../utils/to-scientific';

const doCompute = (pathArr: IPathItem[]): IPathResultItem[] => {
	const pathResult: IPathResultItem[] = [];
	let pos: number[] = [0, 0];
	pathArr.forEach(pathItem => {
		switch (pathItem.type) {
			// 平移 - 绝对
			case 'M':
				pos = computeM(pathItem.val, [minus(pathItem.val[0], pos[0]), minus(pathItem.val[1], pos[1])], pathResult, pos);
				break;
			// 平移 - 相对
			case 'm':
				pos = computeM([plus(pathItem.val[0], pos[0]), plus(pathItem.val[1], pos[1])], pathItem.val, pathResult, pos);
				break;
			case 'Z':
			case 'z':
				pos = computeZ(pathResult, pos);
				break;
			// 水平直线 - 绝对
			case 'H':
				pos = computeH(pathItem.val[0], minus(pathItem.val[0], pos[0]), pathResult, pos);
				break;
			// 水平直线 - 相对
			case 'h':
				pos = computeH(plus(pathItem.val[0], pos[0]), pathItem.val[0], pathResult, pos);
				break;
			// 垂直直线 - 绝对
			case 'V':
				pos = computeV(pathItem.val[0], minus(pathItem.val[0], pos[1]), pathResult, pos);
				break;
			// 垂直直线 - 相对
			case 'v':
				pos = computeV(plus(pathItem.val[0], pos[1]), pathItem.val[0], pathResult, pos);
				break;
			// 直线 - 绝对
			case 'L':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					pos = computeL([pathItem.val[i], pathItem.val[i + 1]], [minus(pathItem.val[i], pos[0]), minus(pathItem.val[i + 1], pos[1])], pathResult, pos);
				}
				break;
			// 直线 - 相对
			case 'l':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					pos = computeL([plus(pathItem.val[i], pos[0]), plus(pathItem.val[i + 1], pos[1])], [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
				}
				break;
			// 三次贝塞尔曲线 - 绝对
			case 'C':
				pos = computeC(pathItem.val, pathItem.val.map((s, i) => minus(s, pos[i % 2])), pathResult, pos);
				break;
			// 三次贝塞尔曲线 - 相对
			case 'c':
				pos = computeC(pathItem.val.map((s, i) => plus(s, pos[i % 2])), pathItem.val, pathResult, pos);
				break;
			// 三次连续贝塞尔曲线 - 绝对
			case 'S':
				pos = computeS(pathItem.val, pathItem.val.map((s, i) => minus(s, pos[i % 2])), pathResult, pos);
				break;
			// 三次连续贝塞尔曲线 - 相对
			case 's':
				pos = computeS(pathItem.val.map((s, i) => plus(s, pos[i % 2])), pathItem.val, pathResult, pos);
				break;
			// 二次贝塞尔曲线 - 绝对
			case 'Q':
				pos = computeQ(pathItem.val, pathItem.val.map((s, i) => minus(s, pos[i % 2])), pathResult, pos);
				break;
			// 二次贝塞尔曲线 - 相对
			case 'q':
				pos = computeQ(pathItem.val.map((s, i) => plus(s, pos[i % 2])), pathItem.val, pathResult, pos);
				break;
			// 二次连续贝塞尔曲线 - 绝对
			case 'T':
				pos = computeT(pathItem.val, pathItem.val.map((s, i) => minus(s, pos[i % 2])), pathResult, pos);
				break;
			// 二次连续贝塞尔曲线 - 相对
			case 't':
				pos = computeT(pathItem.val.map((s, i) => plus(s, pos[i % 2])), pathItem.val, pathResult, pos);
				break;
			// 圆弧 - 绝对
			case 'A':
				pos = computeA(pathItem.val, pathItem.val.map((s, i) => i < APOS_X ? s : minus(s, pos[1 - (i % 2)])), pathResult, pos);
				break;
			// 圆弧 - 相对
			case 'a':
				pos = computeA(pathItem.val.map((s, i) => i < APOS_X ? s : plus(s, pos[1 - (i % 2)])), pathItem.val, pathResult, pos);
				break;
			default:
				break;
		}
	});
	return pathResult;
};

const availTypes = 'LlHhVv';

const DPItemNormalize = (pathItem: IPathResultItem): IPathResultItem => {
	switch (pathItem.type) {
		case 'l':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			for (let i = 2, l = pathItem.val.length; i < l; i += 2) {
				pathItem.val[i] = plus(pathItem.val[i], pathItem.val[i - 2]);
				pathItem.val[i + 1] = plus(pathItem.val[i + 1], pathItem.val[i - 1]);
			}
			break;
		case 'H':
			pathItem.val.push(pathItem.from[1]);
			break;
		case 'h':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val.push(pathItem.from[1]);
			break;
		case 'V':
			pathItem.val.unshift(pathItem.from[0]);
			break;
		case 'v':
			pathItem.val.unshift(pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			break;
		default:
			break;
	}
	pathItem.type = 'L';
	return pathItem;
};

const DPItemMerge = (lastItem: IPathResultItem, pathItem: IPathResultItem): void => {
	lastItem.val = lastItem.val.concat(DPItemNormalize(pathItem).val);
};

const DPInit = (threshold: number, pathArr: IPathResultItem[]): IPathResultItem[] => {
	const pathResult: IPathResultItem[] = [];
	let len = 0;
	for (let i = 0, l = pathArr.length; i < l; i++) {
		const pathItem = pathArr[i];
		if (availTypes.indexOf(pathItem.type) !== -1) {
			const lastItem = pathResult[len - 1];
			if (lastItem.type === 'L') {
				DPItemMerge(lastItem, pathItem);
			} else {
				pathResult.push(DPItemNormalize(pathItem));
				len++;
			}
		} else {
			if (len > 0 && pathResult[len - 1].type === 'L') {
				const lastItem = pathResult[len - 1];
				lastItem.val = douglasPeucker(threshold, lastItem.from.concat(lastItem.val)).slice(2);
			}
			pathResult.push(pathItem);
			len++;
		}
	}
	if (pathResult[len - 1].type === 'L') {
		const lastItem = pathResult[len - 1];
		lastItem.val = douglasPeucker(threshold, lastItem.from.concat(lastItem.val)).slice(2);
	}
	return pathResult;
};

export const computePath = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(propEq('nodeName', 'path'), (node: INode) => {
			const attrD = node.getAttribute('d');

			if (attrD) {
				const pathArr: IPathItem[] = execPath(attrD);
				let pathResult: IPathResultItem[] = doCompute(pathArr);

				// 如果存在道格拉斯 - 普克规则，则执行道格拉斯普克算法，之后需要再次更新
				if (rule[1] && rule[2]) {
					pathResult = doCompute(DPInit(rule[2] as number, pathResult));
				}

				let d = '';
				pathResult.forEach(pathItem => {
					d += `${pathItem.type}${pathItem.val.map(toScientific).join(',')}`;
				});

				// 最后移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号
				node.setAttribute('d', d.replace(/,([+-])/g, '$1').replace(/(^|[^\d])0\./g, '$1.').replace(/([\.eE]\d+),\./g, '$1.'));
			}

		}, dom);
	}
	resolve();
});